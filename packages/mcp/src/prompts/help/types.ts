/**
 * Help Prompt Types
 *
 * Type definitions and schema for the prompt help system.
 */

import { z } from "zod/v4"

export const promptHelpSchema = z.object({
	prompt_name: z.string().optional().describe("Specific prompt to get help for (optional)"),
	category: z.enum(["npc", "faction", "location", "quest", "all"]).optional().describe("Filter by entity type"),
	show_examples: z.boolean().optional().default(false).describe("Include usage examples"),
})

export type PromptHelpArgs = z.infer<typeof promptHelpSchema>

export interface PromptHelpData {
	description: string
	purpose: string
	arguments: Record<string, string>
	benefits: string[]
	example?: {
		input: Record<string, unknown>
		expected_output: string
	}
}

export interface EntityTypeInfo {
	type: string
	prompt: string
	title: string
	description: string
}
