import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"

/**
 * Get schema properties as a type
 */
type SchemaProperties<T extends z.ZodTypeAny> = T extends z.ZodObject<infer Shape>
	? { [K in keyof Shape]?: string | SchemaProperties<Shape[K]> }
	: never

/**
 * Define a more specific type for MCP Tool inputSchema to fix array issues
 */
type MCPInputSchema = {
	type: "object"
	properties: Record<string, unknown>
	required?: string[]
	[key: string]: unknown
}

/**
 * Converts a Zod schema to an MCP-compatible input schema with typed descriptions
 *
 * Features:
 * - Converts Zod schemas to MCP JSON Schema format
 * - Adds descriptions to fields from provided descriptions object
 * - Special handling for JSON fields by detecting the union pattern
 * - Automatically converts JSON fields to string arrays in the schema
 * - Marks fields as required or optional in the description
 *
 * @param schema The Zod schema to convert
 * @param descriptions Optional object with field descriptions that match the schema structure
 */
function zodToMCP<T extends z.ZodTypeAny>(schema: T, descriptions?: SchemaProperties<T>): MCPInputSchema {
	// Helper functions
	const getNestedDescription = (path: string[], descObj?: Record<string, unknown>): string | undefined => {
		if (!descObj) return undefined

		const [current, ...rest] = path
		if (rest.length === 0) {
			return typeof descObj[current] === "string" ? (descObj[current] as string) : undefined
		}

		const nested = descObj[current]
		if (nested && typeof nested === "object" && !Array.isArray(nested)) {
			return getNestedDescription(rest, nested as Record<string, unknown>)
		}

		return undefined
	}

	const getDescription = (schema: z.ZodTypeAny, path: string[]): string | undefined => {
		// Check if we have a description in the provided descriptions object
		if (descriptions) {
			const desc = getNestedDescription(path, descriptions as Record<string, unknown>)
			if (desc) return desc
		}

		// Fall back to schema description
		return typeof schema._def.description === "string" ? schema._def.description : undefined
	}

	const unwrapSchema = (schema: z.ZodTypeAny): z.ZodTypeAny =>
		schema instanceof z.ZodOptional || schema instanceof z.ZodNullable
			? unwrapSchema(schema._def.innerType)
			: schema

	const withDescription = (
		schema: z.ZodTypeAny,
		result: Record<string, unknown>,
		path: string[],
	): Record<string, unknown> => {
		const description = getDescription(schema, path)
		return description ? { ...result, description } : result
	}

	// Interface for schema properties
	interface SchemaProperty {
		type: string
		description?: string
		[key: string]: unknown
	}

	// Process schema based on its type
	function processSchema(schema: z.ZodTypeAny, path: string[] = []): SchemaProperty {
		// Handle wrapped types first
		if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
			return processSchema(schema._def.innerType, path)
		}

		// Special handling for JSON fields (pattern detection)
		if (schema instanceof z.ZodUnion) {
			const options = schema._def.options

			// Detect JSON field pattern (union of union, record, and array)
			const isJsonStringArrayField =
				options.length >= 3 &&
				options[0] instanceof z.ZodUnion &&
				options[1] instanceof z.ZodRecord &&
				options[2] instanceof z.ZodArray

			if (isJsonStringArrayField) {
				return {
					type: "array",
					items: { type: "string" },
					description: getDescription(schema, path),
				}
			}
		}

		// Handle objects
		if (schema instanceof z.ZodObject) {
			return withDescription(schema, processObjectSchema(schema, path), path)
		}

		// Handle record type (dictionary/map)
		if (schema instanceof z.ZodRecord) {
			return withDescription(
				schema,
				{
					type: "object",
					additionalProperties: processSchema(schema._def.valueType, [...path, "additionalProperties"]),
				},
				path,
			)
		}

		// Handle arrays
		if (schema instanceof z.ZodArray) {
			return withDescription(
				schema,
				{
					type: "array",
					items: processSchema(schema.element, [...path, "items"]),
				},
				path,
			)
		}

		// Handle primitive types
		if (schema instanceof z.ZodString) {
			const result: SchemaProperty = { type: "string" }

			// Add string validations
			if (schema._def.checks) {
				for (const check of schema._def.checks) {
					if (check.kind === "regex" && check.regex) result.pattern = check.regex.source
					if (check.kind === "email") result.format = "email"
					if (check.kind === "url") result.format = "uri"
					if (check.kind === "uuid") result.format = "uuid"
				}
			}

			return withDescription(schema, result, path)
		}

		if (schema instanceof z.ZodNumber) return withDescription(schema, { type: "number" }, path)
		if (schema instanceof z.ZodBoolean) return withDescription(schema, { type: "boolean" }, path)
		if (schema instanceof z.ZodNull || schema instanceof z.ZodUndefined) return { type: "null" }

		// Handle any type
		if (schema instanceof z.ZodAny) {
			return withDescription(schema, { type: "object" }, path)
		}

		// Handle enums
		if (schema instanceof z.ZodEnum) {
			return withDescription(
				schema,
				{
					type: "string",
					enum: schema._def.values,
				},
				path,
			)
		}

		// Handle union types
		if (schema instanceof z.ZodUnion) {
			return withDescription(
				schema,
				{
					type: "object",
					anyOf: schema._def.options.map((option: z.ZodTypeAny) => processSchema(option, path)),
				},
				path,
			)
		}

		// Handle literals
		if (schema instanceof z.ZodLiteral) {
			const literalValue = schema._def.value
			const literalType = typeof literalValue

			return withDescription(
				schema,
				{
					type: ["string", "number", "boolean"].includes(literalType) ? literalType : "string",
					enum: [literalValue],
				},
				path,
			)
		}

		// Fallback for unknown types
		console.warn("Unknown schema type encountered:", schema)
		return { type: "object", properties: {} }
	}

	// Process object schema
	function processObjectSchema(schema: z.ZodObject<z.ZodRawShape>, path: string[] = []): SchemaProperty {
		const properties: Record<string, SchemaProperty> = {}
		const required: string[] = []

		// Process all fields
		for (const key of Object.keys(schema.shape)) {
			const value = schema.shape[key] as z.ZodTypeAny

			// Process normally for all fields
			properties[key] = processSchema(value, [...path, key])

			// Track required fields
			if (!(value instanceof z.ZodOptional) && !(value instanceof z.ZodNullable)) {
				required.push(key)
			}
		}

		const result: SchemaProperty = {
			type: "object",
			properties,
		}

		if (required.length > 0) {
			result.required = required
		}

		return result
	}

	// Process the schema and handle final output format
	const result = processSchema(schema)

	// Wrap non-object results or unions in a value property
	if (result.type !== "object" || schema instanceof z.ZodUnion) {
		return {
			type: "object",
			properties: { value: result },
			required: ["value"],
		} as MCPInputSchema
	}

	// Add additional context to descriptions if provided
	// This enriches the schema with usage information
	if (result.properties && typeof result.properties === "object") {
		for (const key in result.properties) {
			const prop = result.properties[key] as SchemaProperty
			const isRequired = Array.isArray(result.required) && result.required.includes(key)

			// If this is already detected as an array type with string items,
			// enhance the description to make it clear it should be an array
			if (
				prop.type === "array" &&
				prop.items &&
				typeof prop.items === "object" &&
				(prop.items as any).type === "string"
			) {
				// Update the description to clarify it's a string array
				if (prop.description) {
					prop.description = isRequired
						? `${prop.description} (Required - provide as string array)`
						: `${prop.description} (Optional - provide as string array)`
				}
			}
			// Normal handling for other fields
			else if (prop.description) {
				prop.description = isRequired ? `${prop.description} (Required)` : `${prop.description} (Optional)`
			}
		}
	}

	return result as MCPInputSchema
}

export default zodToMCP
