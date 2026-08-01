/**
 * Prompt Server Registration - MCP Protocol Handler
 *
 * Registers each prompt from the registry with the MCP server; the SDK
 * handles ListPrompts/GetPrompt routing and argument validation.
 */

import type { McpServer } from "@modelcontextprotocol/server"
import { logger } from ".."
import { prompts } from "./registry"

export function registerPromptHandlers(server: McpServer) {
	for (const [name, { description, schema, handler }] of Object.entries(prompts)) {
		server.registerPrompt(name, { description, argsSchema: schema }, async (args: Record<string, unknown>) => {
			logger.info(`Executing prompt: ${name}`, args)
			try {
				return await handler(args)
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
					promptArgs: args,
				})
				throw error
			}
		})
	}

	logger.info("MCP Prompt handlers registered")
}
