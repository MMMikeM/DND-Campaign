import { z } from "zod/v4"

/**
 * Function to convert Zod schema to JSON Schema for MCP
 * Automatically adds (Required) or (Optional) to descriptions and handles array types
 */
export function zodToMCP<T extends z.ZodType>(schema: T): z.core.JSONSchema.BaseSchema {
	const JSONSchema = z.toJSONSchema(schema)
	console.error(JSONSchema)
	return JSONSchema
}

export default zodToMCP
