import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

/**
 * Function to convert Zod schema to JSON Schema for MCP
 * Automatically adds (Required) or (Optional) to descriptions and handles array types
 */
export function zodToMCP<T extends z.ZodTypeAny>(schema: T) {
	const jsonSchema = zodToJsonSchema(schema, { target: "jsonSchema7", $refStrategy: "none" }) as {
		properties: Record<string, unknown>
		required: string[]
	}

	return jsonSchema
}

export default zodToMCP
