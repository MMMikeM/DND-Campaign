// prompt-registry.ts

import { z } from "zod/v4"
import { logger } from ".."
import { enhancedCampaignPrompts } from "./enhanced-campaign-prompts"
import { enhancedNpcPromptDefinitions } from "./prompt-npc-enhanced"
import { enhancedQuestPromptDefinitions } from "./prompt-quest-enhanced"
import { extractArgsFromZodSchema, type PromptDefinition } from "./prompt-utils"

// Combine all prompt definitions
const allPromptDefinitions = {
	...enhancedNpcPromptDefinitions,
	...enhancedCampaignPrompts,
	...enhancedQuestPromptDefinitions,
}

/**
 * Get all prompts in MCP format
 */
export function getAllPrompts() {
	return Object.entries(allPromptDefinitions).map(([name, def]: [string, PromptDefinition<any>]) => ({
		name,
		description: def.description,
		arguments: extractArgsFromZodSchema(def.schema),
	}))
}

/**
 * Execute a specific prompt
 */
export async function executePrompt(name: string, args: Record<string, unknown>) {
	logger.info(`Executing prompt: ${name}`, args)

	const promptDef = allPromptDefinitions[name as keyof typeof allPromptDefinitions]
	if (!promptDef) {
		throw new Error(`Prompt not found: ${name}`)
	}

	try {
		// Parse and validate the args with the prompt's schema
		const validatedArgs = promptDef.schema.parse(args)

		// Execute the prompt handler with validated args
		return await promptDef.handler(validatedArgs as any)
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.error(`Validation error in prompt ${name}:`, error.flatten())
			throw new Error(`Invalid arguments: ${error.message}`)
		}

		logger.error(`Error executing prompt ${name}:`, error)
		throw error
	}
}
