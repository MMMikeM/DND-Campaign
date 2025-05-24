// prompt-registry.ts

import { z } from "zod/v4"
// Import other category definitions
// import { factionPromptDefinitions } from "./faction-prompts";
import { logger } from ".."
import { npcPromptDefinitions } from "./prompt-npc"
import type { PromptCategory } from "./prompt-types"
import { extractArgsFromZodSchema } from "./prompt-utils"

// Combine all prompt definitions
const allPromptDefinitions = {
	...npcPromptDefinitions,
	// Add other categories as needed
	// ...factionPromptDefinitions,
}

/**
 * Get all prompts in MCP format
 */
export function getAllPrompts() {
	return Object.entries(allPromptDefinitions).map(([name, def]) => ({
		name,
		description: def.description,
		arguments: extractArgsFromZodSchema(def.schema),
	}))
}

/**
 * Get prompts filtered by category
 */
export function getPromptsByCategory(category: PromptCategory) {
	return Object.entries(allPromptDefinitions)
		.filter(([_, def]) => def.category === category)
		.map(([name, def]) => ({
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

	const promptDef = allPromptDefinitions[name]
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
			logger.error(`Validation error in prompt ${name}:`, error.flatten())
			throw new Error(`Invalid arguments: ${error.message}`)
		}

		logger.error(`Error executing prompt ${name}:`, error)
		throw error
	}
}
