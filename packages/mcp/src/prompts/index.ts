// prompt-server.ts
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { GetPromptRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from ".."
import { getAllPrompts, executePrompt } from "./prompt-registry"

export function registerPromptHandlers(server: Server) {
	server.setRequestHandler(ListPromptsRequestSchema, async () => {
		return { prompts: getAllPrompts() }
	})

	// Handler for getting a specific prompt
	server.setRequestHandler(GetPromptRequestSchema, async (request) => {
		const { name, arguments: promptArgs = {} } = request.params
		logger.info(`Getting prompt: ${name}`, promptArgs)

		try {
			// Execute the prompt with the provided arguments
			const result = await executePrompt(name, promptArgs)
			return result
		} catch (error) {
			logger.error(`Error in prompt ${name}:`, error)
			throw error
		}
	})

	logger.info("MCP Prompt handlers registered")
}
