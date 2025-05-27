import { z } from "zod/v4"

/**
 * Function to convert Zod schema to JSON Schema for MCP
 * Automatically adds (Required) or (Optional) to descriptions and handles array types
 */
function zodToMCP<T extends z.ZodType>(schema: T): z.core.JSONSchema.BaseSchema {
	const JSONSchema = z.toJSONSchema(schema)
	return JSONSchema
}

export default zodToMCP
