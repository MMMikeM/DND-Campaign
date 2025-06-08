/**
 * Prompt Registry - Central Hub for Campaign Management Prompts
 *
 * Combines all prompt definitions into a single registry and handles their execution.
 * Provides getAllPrompts() for MCP discovery and executePrompt() with validation.
 */

import { z } from "zod/v4"
import { logger } from ".."
import { enhancedCampaignPrompts } from "./campaign"
import { enhancedFactionPromptDefinitions } from "./faction"
import { promptHelpDefinitions } from "./help"
import { enhancedLocationPromptDefinitions } from "./location"
import { enhancedNpcPromptDefinitions } from "./npc"
import { enhancedQuestPromptDefinitions } from "./quest"
import { templatePromptDefinitions } from "./templates"
import { extractArgsFromZodSchema, type PromptDefinition } from "./utils"

// Combine all prompt definitions
const allPromptDefinitions = {
	...enhancedNpcPromptDefinitions,
	...enhancedCampaignPrompts,
	...enhancedQuestPromptDefinitions,
	...enhancedFactionPromptDefinitions,
	...enhancedLocationPromptDefinitions,
	...promptHelpDefinitions,
	...templatePromptDefinitions,
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
