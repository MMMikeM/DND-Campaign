import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"

/**
 * Converts a Zod schema to an MCP-compatible input schema
 * with improved type handling and description support
 *//**
 * Converts a Zod schema to an MCP-compatible input schema
 * with improved type handling and description support
 */
function zodToMCP(schema: z.ZodTypeAny): Tool["inputSchema"] {
	// Extract descriptions from zod schemas
	function getDescription(schema: z.ZodTypeAny): string | undefined {
		// Access the _def property in a type-safe way
		const def = schema._def
		return typeof def.description === "string" ? def.description : undefined
	}

	// Define more specific return types for different schema components
	interface SchemaProperty {
		type: string
		description?: string
		[key: string]: unknown
	}

	// Process Zod schema recursively
	function processSchema(schema: z.ZodTypeAny): SchemaProperty {
		const description = getDescription(schema)

		// Unwrap optional and nullable
		if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
			const unwrapped = processSchema(schema.unwrap())
			// Preserve the description from the optional/nullable wrapper if it exists
			if (description) unwrapped.description = description
			return unwrapped
		}

		// Handle primitives
		if (schema instanceof z.ZodString) {
			const result: SchemaProperty = { type: "string" }
			if (description) result.description = description

			// Handle string formats if defined
			// Access _def properties safely
			const stringDef = schema._def

			// Handle patterns - need to check differently for regex
			// Zod stores patterns in checks array
			if (stringDef.checks) {
				for (const check of stringDef.checks) {
					if (check.kind === "regex" && check.regex) {
						result.pattern = check.regex.source
					}

					// Handle special string formats
					if (check.kind === "email") result.format = "email"
					if (check.kind === "url") result.format = "uri"
					if (check.kind === "uuid") result.format = "uuid"
				}
			}

			return result
		}

		if (schema instanceof z.ZodNumber) {
			const result: SchemaProperty = { type: "number" }
			if (description) result.description = description

			// Add min/max constraints if present
			const numberDef = schema._def
			if (numberDef.checks) {
				for (const check of numberDef.checks) {
					if (check.kind === "min") result.minimum = check.value
					if (check.kind === "max") result.maximum = check.value
				}
			}

			return result
		}

		if (schema instanceof z.ZodBoolean) {
			const result: SchemaProperty = { type: "boolean" }
			if (description) result.description = description
			return result
		}

		if (schema instanceof z.ZodNull) {
			return { type: "null" }
		}

		if (schema instanceof z.ZodUndefined) {
			return { type: "null" }
		}

		// Handle arrays
		if (schema instanceof z.ZodArray) {
			const result: SchemaProperty & { items?: SchemaProperty } = {
				type: "array",
				items: processSchema(schema.element),
			}
			if (description) result.description = description
			return result
		}

		// Handle objects
		if (schema instanceof z.ZodObject) {
			const properties: Record<string, SchemaProperty> = {}
			const required: string[] = []

			// Process each property
			for (const [key, value] of Object.entries(schema.shape) as [string, z.ZodTypeAny][]) {
				properties[key] = processSchema(value as z.ZodTypeAny)

				// Track required fields
				if (!(value instanceof z.ZodOptional) && !(value instanceof z.ZodNullable)) {
					required.push(key)
				}
			}

			const result: SchemaProperty & {
				properties: Record<string, SchemaProperty>
				required?: string[]
			} = {
				type: "object",
				properties,
			}

			if (required.length > 0) {
				result.required = required
			}

			if (description) {
				result.description = description
			}

			return result
		}

		// Handle unions (enums)
		if (schema instanceof z.ZodEnum) {
			const enumDef = schema._def
			return {
				type: "string",
				enum: enumDef.values,
				...(description ? { description } : {}),
			}
		}

		if (schema instanceof z.ZodUnion) {
			const unionDef = schema._def
			const result: SchemaProperty = {
				type: "object",
				anyOf: unionDef.options.map((option: z.ZodTypeAny) => processSchema(option)),
			}
			if (description) result.description = description
			return result
		}

		if (schema instanceof z.ZodLiteral) {
			const literalDef = schema._def
			const literalType = typeof literalDef.value
			return {
				type:
					literalType === "string" || literalType === "number" || literalType === "boolean"
						? literalType
						: "string",
				enum: [literalDef.value],
				...(description ? { description } : {}),
			}
		}

		// Fallback for any other schema types
		return { type: "object", properties: {} }
	}

	// Start processing the schema
	const result = processSchema(schema)

	// Ensure we return a valid MCP input schema
	if (result.type !== "object") {
		return {
			type: "object",
			properties: {
				value: result,
			},
			required: ["value"],
		}
	}

	// Special handling for union types that may already have type="object" but need to be wrapped
	if (schema instanceof z.ZodUnion) {
		return {
			type: "object",
			properties: {
				value: result,
			},
			required: ["value"],
		}
	}

	// Type assertion to ensure correct return type
	return result as Tool["inputSchema"]
}

export default zodToMCP
