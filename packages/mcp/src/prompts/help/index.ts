/**
 * Prompt Help System
 *
 * Provides the "prompt-help" prompt for interactive documentation and guidance.
 * Shows detailed usage instructions, examples, and performance metrics for all
 * enhanced campaign prompts with category-based filtering.
 */

import { logger } from "../.."
import type { PromptDefinition } from "../types"
import { createPromptResult, createTextMessage, createTypedHandler, extractArgsFromZodSchema } from "../types"
import { formatPromptDiscovery, formatSpecificPromptHelp } from "./formatters"
import { type PromptHelpArgs, promptHelpSchema } from "./types"

async function promptHelpHandler(args: PromptHelpArgs) {
	logger.info("Providing prompt help", args)

	const { prompt_name, category, show_examples } = args

	if (prompt_name) {
		const formattedHelp = formatSpecificPromptHelp(prompt_name, show_examples ?? false)
		return createPromptResult([createTextMessage("assistant", formattedHelp)])
	}

	const formattedDiscovery = formatPromptDiscovery(category, show_examples ?? false)
	return createPromptResult([createTextMessage("assistant", formattedDiscovery)])
}

export const promptHelpDefinitions: Record<string, PromptDefinition> = {
	"prompt-help": {
		description: "Get help and examples for enhanced entity creation prompts",
		schema: promptHelpSchema,
		arguments: extractArgsFromZodSchema(promptHelpSchema),
		handler: createTypedHandler(promptHelpSchema, promptHelpHandler),
	},
}
