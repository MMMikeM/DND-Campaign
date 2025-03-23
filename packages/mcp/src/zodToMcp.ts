import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"

/**
 * Get schema properties as a type
 */
type SchemaProperties<T extends z.ZodTypeAny> = T extends z.ZodObject<infer Shape>
	? { [K in keyof Shape]?: string | SchemaProperties<Shape[K]> }
	: never

/**
 * Converts a Zod schema to an MCP-compatible input schema with typed descriptions
 *
 * @param schema The Zod schema to convert
 * @param descriptions Optional object with field descriptions that match the schema structure
 */
function zodToMCP<T extends z.ZodTypeAny>(
	schema: T,
	descriptions?: SchemaProperties<T>,
): Tool["inputSchema"] {
	// Helper functions
	const getNestedDescription = (
		path: string[],
		descObj?: Record<string, unknown>,
	): string | undefined => {
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
					additionalProperties: processSchema(schema._def.valueType, [
						...path,
						"additionalProperties",
					]),
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
	function processObjectSchema(
		schema: z.ZodObject<z.ZodRawShape>,
		path: string[] = [],
	): SchemaProperty {
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
		}
	}

	return result as Tool["inputSchema"]
}

export default zodToMCP
