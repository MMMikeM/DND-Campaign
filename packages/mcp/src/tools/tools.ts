import type { McpServer } from "@modelcontextprotocol/server"
import { logger } from ".."
import { serializeError } from "../logger"
import { withCachedJsonSchema } from "../schema-cache"
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
import { createErrorResponse, createResponse } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"

/** Category groupings for the help tool; every category is registered with the server. */
export const toolCategories: Record<string, Record<string, ToolDefinition>> = {
	conflicts: conflictToolDefinitions,
	consequences: consequenceToolDefinitions,
	factions: factionToolDefinitions,
	foreshadowing: foreshadowingToolDefinitions,
	items: itemToolDefinitions,
	lore: loreToolDefinitions,
	maps: mapToolDefinitions,
	npcs: npcToolDefinitions,
	quests: questToolDefinitions,
	"quest-stages": questStageToolDefinitions,
	regions: regionToolDefinitions,
}

export const generalToolDefinitions: Record<string, ToolDefinition> = {
	...getEntityToolDefinition,
	...fuzzySearchToolDefinitions,
}

export const allToolDefinitions: Record<string, ToolDefinition> = {
	...helpToolDefinitions,
	...generalToolDefinitions,
	...Object.assign({}, ...Object.values(toolCategories)),
}

// Built once at module scope: registerToolHandlers runs per request under the
// sessionless createMcpHandler model, and the facade's JSON-conversion cache
// only pays off if the same instance is reused across servers.
const toolRegistrations = Object.entries(allToolDefinitions).map(([name, definition]) => ({
	name,
	definition,
	inputSchema: withCachedJsonSchema(definition.inputSchema),
}))

export function registerToolHandlers(server: McpServer) {
	for (const { name, definition, inputSchema } of toolRegistrations) {
		const { description, annotations, handler } = definition
		server.registerTool(name, { description, inputSchema, annotations }, async (args) => {
			try {
				const result = await handler(args as Record<string, unknown>)
				return createResponse(JSON.stringify(result, null, 2))
			} catch (error) {
				logger.error("Error calling tool", { tool: name, args, error: serializeError(error) })
				return createErrorResponse(
					`Error: ${error instanceof Error ? error.message : String(error || "Unknown error")}`,
				)
			}
		})
	}

	logger.debug("MCP Tool handlers registered")
}
