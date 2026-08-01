/**
 * Prompt Server Registration - MCP Protocol Handler
 *
 * Registers each prompt from the registry with the MCP server; the SDK
 * handles ListPrompts/GetPrompt routing and argument validation.
 */

import type { McpServer } from "@modelcontextprotocol/server"
import { logger } from ".."
import { serializeError } from "../logger"
import { prompts } from "./registry"
import type { PromptDefinition } from "./types"

export function registerPromptHandlers(server: McpServer) {
	for (const [name, { description, schema, handler }] of Object.entries<PromptDefinition>(prompts)) {
		server.registerPrompt(name, { description, argsSchema: schema }, async (args: Record<string, unknown>) => {
			logger.info(`Executing prompt: ${name}`, args)
			try {
				return await handler(args)
			} catch (error) {
				logger.error(`Error in prompt ${name}:`, {
					error: serializeError(error),
					promptName: name,
					promptArgs: args,
				})
				throw error
			}
		})
	}

	logger.debug("MCP Prompt handlers registered")
}
