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

	// Post-process the schema to handle descriptions correctly
	const properties = jsonSchema.properties

	for (const [key, prop] of Object.entries(properties)) {
		// Handle descriptions for parameters
		if ("type" in prop && prop.description) {
			// Handle array types with proper min/max items
			if (prop.type === "array") {
				// Add minItems/maxItems settings for array types if not already present
				if (!prop.minItems) prop.minItems = 1
				if (!prop.maxItems) prop.maxItems = 5
			}
		}
	}

	return jsonSchema
}

export default zodToMCP
