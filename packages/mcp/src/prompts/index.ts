/**
 * Prompt Server Registration - MCP Protocol Handler
 *
 * Registers each prompt from the registry with the MCP server; the SDK
 * handles ListPrompts/GetPrompt routing and argument validation.
 */

import type { McpServer } from "@modelcontextprotocol/server"
import { logger } from ".."
import { serializeError } from "../logger"
import { withCachedJsonSchema } from "../schema-cache"
import { prompts } from "./registry"
import type { PromptDefinition } from "./types"

// Built once at module scope: registerPromptHandlers runs per request under
// the sessionless createMcpHandler model, so schema facades must be shared.
const promptRegistrations = Object.entries<PromptDefinition>(prompts).map(
	([name, { description, schema, handler }]) => ({
		name,
		description,
		argsSchema: withCachedJsonSchema(schema),
		handler,
	}),
)

export function registerPromptHandlers(server: McpServer) {
	for (const { name, description, argsSchema, handler } of promptRegistrations) {
		server.registerPrompt(name, { description, argsSchema }, async (args: Record<string, unknown>) => {
			logger.info(args, `Executing prompt: ${name}`)
			try {
				return await handler(args)
			} catch (error) {
				logger.error(
					{
						error: serializeError(error),
						promptName: name,
						promptArgs: args,
					},
					`Error in prompt ${name}:`,
				)
				throw error
			}
		})
	}

	logger.debug("MCP Prompt handlers registered")
}
