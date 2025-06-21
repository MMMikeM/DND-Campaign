/**
 * Prompt Server Registration - MCP Protocol Handler
 *
 * Registers prompt handlers with the MCP server for AI assistant integration.
 * Handles ListPrompts and GetPrompt requests, routing to the prompt registry.
 */

import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
	GetPromptRequestSchema,
	type GetPromptResult,
	ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { logger } from ".."
import { executePrompt, listablePrompts } from "./registry"

export function registerPromptHandlers(server: Server) {
	server.setRequestHandler(ListPromptsRequestSchema, async () => ({ prompts: listablePrompts }))

	// Handler for getting a specific prompt
	server.setRequestHandler(GetPromptRequestSchema, async (request): Promise<GetPromptResult> => {
		const { name, arguments: promptArgs = {} } = request.params
		logger.info(`Getting prompt: ${name}`, promptArgs)

		try {
			// Execute the prompt with the provided arguments
			const result = await executePrompt(name, promptArgs)
			return result
		} catch (error) {
			logger.error(`Error in prompt ${name}:`, {
				error:
					error instanceof Error
						? {
								name: error.name,
								message: error.message,
								stack: error.stack,
							}
						: error,
				promptName: name,
				promptArgs,
			})
			throw error
		}
	})

	logger.info("MCP Prompt handlers registered")
}
