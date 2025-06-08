/**
 * Prompt Utilities - Schema Processing and Argument Extraction
 *
 * Provides utility functions for extracting argument definitions from Zod schemas
 * for MCP prompt registration and automatic argument documentation.
 */

import type { PromptArgument } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod/v4"
import type { PromptDefinition } from "./types"

export type { PromptDefinition }

/**
 * Extracts argument information from a Zod schema
 */
export function extractArgsFromZodSchema<T extends z.ZodObject<Record<string, z.ZodAny>>>(schema: T): PromptArgument[] {
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
