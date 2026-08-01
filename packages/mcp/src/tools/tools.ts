import type { McpServer } from "@modelcontextprotocol/server"
import { logger } from ".."
import { conflictToolDefinitions } from "./conflict-tools"
import { consequenceToolDefinitions } from "./consequence-tools"
import { factionToolDefinitions } from "./faction-tools"
import { foreshadowingToolDefinitions } from "./foreshadowing-tools"
import { getEntityToolDefinition } from "./get-entity"
import { helpToolDefinitions } from "./help-tools"
import { itemToolDefinitions } from "./items-tools"
import { loreToolDefinitions } from "./lore-tools"
import { mapToolDefinitions } from "./map-tools"
import { npcToolDefinitions } from "./npc-tools"
import { questStageToolDefinitions } from "./quest-stage-tools"
import { questToolDefinitions } from "./quest-tools"
import { regionToolDefinitions } from "./region-tools"
import { fuzzySearchToolDefinitions } from "./utils/fuzzy-search"
import type { ToolDefinition } from "./utils/types"

export const allToolDefinitions: Record<string, ToolDefinition> = {
	// Utility tools
	...helpToolDefinitions,
	...getEntityToolDefinition,
	...fuzzySearchToolDefinitions,
	...mapToolDefinitions,

	// Manage tools
	...conflictToolDefinitions,
	...consequenceToolDefinitions,
	...factionToolDefinitions,
	...foreshadowingToolDefinitions,
	...itemToolDefinitions,
	...loreToolDefinitions,
	...npcToolDefinitions,
	...questToolDefinitions,
	...questStageToolDefinitions,
	...regionToolDefinitions,
}

export function registerToolHandlers(server: McpServer) {
	for (const [name, { description, inputSchema, annotations, handler }] of Object.entries(allToolDefinitions)) {
		server.registerTool(name, { description, inputSchema, annotations }, async (args) => {
			try {
				const result = await handler(args as Record<string, unknown>)
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result, null, 2),
						},
					],
				}
			} catch (error) {
				logger.error("Error calling tool", {
					tool: name,
					args,
					error:
						error && error instanceof Error
							? {
									name: error.name,
									message: error.message,
									stack: error.stack,
									cause: error.cause,
								}
							: {
									errorType: typeof error,
									errorValue: error,
									errorString: String(error),
									errorJSON: error ? JSON.stringify(error) : "null",
								},
				})
				return {
					isError: true,
					content: [
						{
							type: "text",
							text: `Error: ${error && error instanceof Error ? error.message : String(error || "Unknown error")}`,
						},
					],
				}
			}
		})
	}

	logger.info("MCP Tool handlers registered")
}
