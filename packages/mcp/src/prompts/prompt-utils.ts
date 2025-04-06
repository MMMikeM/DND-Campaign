// prompt-utils.ts
import { z } from "zod"
import type { PromptArgument } from "./prompt-types"

/**
 * Extracts argument information from a Zod schema
 */
export function extractArgsFromZodSchema<T extends z.AnyZodObject>(schema: T): PromptArgument[] {
	const result: PromptArgument[] = []

	// Get the shape of the schema
	const shape = schema.shape

	// Process each property in the schema
	for (const [name, field] of Object.entries(shape)) {
		// Extract description
		let description = name
		if (field instanceof z.ZodType) {
			// Try to extract description from the field
			const desc = field.description
			if (desc) {
				description = desc
			}
		}

		// Determine if the field is required
		const isOptional = field instanceof z.ZodOptional || field instanceof z.ZodDefault

		result.push({
			name,
			description,
			required: !isOptional,
		})
	}

	return result
}
