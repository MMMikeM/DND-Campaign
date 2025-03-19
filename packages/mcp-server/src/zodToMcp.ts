import type { Tool } from "@modelcontextprotocol/sdk/types"
import { z } from "zod"

/**
 * Converts a Zod schema to an MCP-compatible input schema
 * with improved type handling and description support
 *//**
 * Converts a Zod schema to an MCP-compatible input schema
 * with improved type handling and description support
 */
function zodToMCPSchema(schema: z.ZodTypeAny): Tool["inputSchema"] {
	// Extract descriptions from zod schemas
	function getDescription(schema: z.ZodTypeAny): string | undefined {
		const description = (schema as any)._def?.description
		return typeof description === "string" ? description : undefined
	}

	// Process Zod schema recursively
	function processSchema(schema: z.ZodTypeAny): any {
		const description = getDescription(schema)

		// Unwrap optional and nullable
		if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
			return processSchema(schema.unwrap())
		}

		// Handle primitives
		if (schema instanceof z.ZodString) {
			const result: { type: string; description?: string; pattern?: string; format?: string } = {
				type: "string",
			}
			if (description) result.description = description

			// Handle string formats if defined
			const { regex } = schema._def
			if (regex) result.pattern = regex.source

			// Handle email, url, etc. formats when using z.string().email(), etc.
			const { checks } = schema._def
			if (checks?.length > 0) {
				const checkType = checks[0].kind
				if (checkType === "email") result.format = "email"
				if (checkType === "url") result.format = "uri"
				if (checkType === "uuid") result.format = "uuid"
			}

			return result
		}

		if (schema instanceof z.ZodNumber) {
			const result: { type: string; description?: string; minimum?: number; maximum?: number } = {
				type: "number",
			}
			if (description) result.description = description

			// Add min/max constraints if present
			const { checks } = schema._def
			if (checks?.length > 0) {
				for (const check of checks) {
					if (check.kind === "min") result.minimum = check.value
					if (check.kind === "max") result.maximum = check.value
				}
			}

			return result
		}

		if (schema instanceof z.ZodBoolean) {
			const result = { type: "boolean" }
			if (description) (result as any).description = description
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
			const result: { type: string; items?: any; description?: string } = {
				type: "array",
				items: processSchema(schema.element),
			}
			if (description) result.description = description
			return result
		}

		// Handle objects
		if (schema instanceof z.ZodObject) {
			const properties: Record<string, any> = {}
			const required: string[] = []

			// Process each property
			for (const [key, value] of Object.entries(schema.shape)) {
				properties[key] = processSchema(value)

				// Track required fields
				if (!(value instanceof z.ZodOptional) && !(value instanceof z.ZodNullable)) {
					required.push(key)
				}
			}

			const result: {
				type: string
				properties: Record<string, any>
				required?: string[]
				description?: string
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
			return {
				type: "string",
				enum: schema._def.values,
				...(description ? { description } : {}),
			}
		}

		if (schema instanceof z.ZodUnion) {
			// For MCP, we convert unions to anyOf
			return {
				anyOf: schema._def.options.map(processSchema),
				...(description ? { description } : {}),
			}
		}

		if (schema instanceof z.ZodLiteral) {
			const literalType = typeof schema._def.value
			return {
				type:
					literalType === "string" || literalType === "number" || literalType === "boolean"
						? literalType
						: "string",
				enum: [schema._def.value],
				...(description ? { description } : {}),
			}
		}

		// Fallback for any other schema types
		return { type: "object", properties: {} }
	}

	// Start processing the schema
	const result = processSchema(schema)

	// Ensure we return a valid MCP input schema
	if (!result.type || result.type !== "object") {
		return {
			type: "object",
			properties: {
				value: result,
			},
			required: ["value"],
		}
	}

	return result
}
