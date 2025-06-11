/**
 * Prompt Registry - Central Hub for Campaign Management Prompts
 *
 * Combines all prompt definitions into a single registry and handles their execution.
 * Provides getAllPrompts() for MCP discovery and executePrompt() with validation.
 */

import { z } from "zod/v4"
import { logger } from ".."
import { enhancedCampaignPrompts } from "./campaign"
import { factionPromptDefinitions } from "./faction/index"
import { promptHelpDefinitions } from "./help"
import { locationPromptDefinitions } from "./location/index"
import { npcPromptDefinitions } from "./npc/index"
import { questPromptDefinitions } from "./quest"

// Combine all prompt definitions
export const prompts = {
	...npcPromptDefinitions,
	...enhancedCampaignPrompts,
	...questPromptDefinitions,
	...factionPromptDefinitions,
	...locationPromptDefinitions,
	...promptHelpDefinitions,
}

/**
 * A serializable representation of the prompts for the MCP client.
 * This excludes non-serializable fields like the handler function and Zod schema.
 */
export const listablePrompts = Object.entries(prompts).map(([name, { description, arguments: args }]) => ({
	name,
	description,
	arguments: args,
}))

/**
 * Execute a specific prompt
 */
export async function executePrompt(name: string, args: Record<string, unknown>) {
	logger.info(`Executing prompt: ${name}`, args)

	const promptDef = prompts[name as keyof typeof prompts]
	if (!promptDef) {
		throw new Error(`Prompt not found: ${name}`)
	}

	try {
		// Parse and validate the args with the prompt's schema
		const validatedArgs = promptDef.schema.parse(args)

		// Execute the prompt handler with validated args
		return await promptDef.handler(validatedArgs)
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.error(`Validation error in prompt ${name}:`, {
				validationError: error.flatten(),
				promptName: name,
				providedArgs: args,
			})
			throw new Error(`Invalid arguments for prompt "${name}": ${error.message}`)
		}

		logger.error(`Error executing prompt ${name}:`, {
			error: error instanceof Error ? {
				name: error.name,
				message: error.message,
				stack: error.stack,
			} : error,
			promptName: name,
			args,
		})
		throw error
	}
}
