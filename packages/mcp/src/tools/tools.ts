import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from ".."
import { conflictToolDefinitions } from "./conflict-tools"
import { factionToolDefinitions } from "./faction-tools"
import { foreshadowingToolDefinitions } from "./foreshadowing-tools"
import { getEntityToolDefinition } from "./get-entity"
import { helpToolDefinitions } from "./help-tools"
import { itemToolDefinitions } from "./items-tools"
import { loreToolDefinitions } from "./lore-tools"
import { mapToolDefinitions } from "./map-tools"
import { narrativeDestinationToolDefinitions } from "./narrative-destination-tools"
import { narrativeEventToolDefinitions } from "./narrative-events-tools"
import { npcToolDefinitions } from "./npc-tools"
import { questToolDefinitions } from "./quest-tools"
import { regionToolDefinitions } from "./region-tools"
import { fuzzySearchToolDefinitions } from "./utils/fuzzy-search"
import type { ToolDefinition, ToolHandlerReturn } from "./utils/types"

function extractToolsAndHandlers<T extends string>(definitions: Record<string, ToolDefinition>) {
	const tools = Object.entries(definitions).map(([name, { description, inputSchema }]) => ({
		name,
		description,
		inputSchema,
	})) as Array<Tool & { name: T }>

	const handlers = Object.entries(definitions).reduce(
		(acc, [name, { handler }]) => {
			acc[name] = handler
			return acc
		},
		{} as Record<string, (args?: Record<string, unknown>) => Promise<ToolHandlerReturn>>,
	)

	return { tools, handlers }
}

export const conflicts = extractToolsAndHandlers(conflictToolDefinitions)
export const factions = extractToolsAndHandlers(factionToolDefinitions)
export const foreshadowing = extractToolsAndHandlers(foreshadowingToolDefinitions)
export const fuzzySearch = extractToolsAndHandlers(fuzzySearchToolDefinitions)
export const getEntity = extractToolsAndHandlers(getEntityToolDefinition)
export const help = extractToolsAndHandlers(helpToolDefinitions)
export const items = extractToolsAndHandlers(itemToolDefinitions)
export const lore = extractToolsAndHandlers(loreToolDefinitions)
export const maps = extractToolsAndHandlers(mapToolDefinitions)
export const narrativeDestinations = extractToolsAndHandlers(narrativeDestinationToolDefinitions)
export const narrativeEvents = extractToolsAndHandlers(narrativeEventToolDefinitions)
export const npcs = extractToolsAndHandlers(npcToolDefinitions)
export const quests = extractToolsAndHandlers(questToolDefinitions)
export const regions = extractToolsAndHandlers(regionToolDefinitions)

export function registerToolHandlers(server: Server) {
	const tools = [
		...conflicts.tools,
		...factions.tools,
		...foreshadowing.tools,
		...fuzzySearch.tools,
		...getEntity.tools,
		...help.tools,
		...items.tools,
		...lore.tools,
		...maps.tools,
		...narrativeDestinations.tools,
		...narrativeEvents.tools,
		...npcs.tools,
		...quests.tools,
		...regions.tools,
	]

	const allToolHandlers = {
		...conflicts.handlers,
		...factions.handlers,
		...foreshadowing.handlers,
		...fuzzySearch.handlers,
		...getEntity.handlers,
		...help.handlers,
		...items.handlers,
		...lore.handlers,
		...maps.handlers,
		...narrativeDestinations.handlers,
		...narrativeEvents.handlers,
		...npcs.handlers,
		...quests.handlers,
		...regions.handlers,
	}

	server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		const { name, arguments: args } = request.params

		const handler = allToolHandlers[name as keyof typeof allToolHandlers]
		if (!handler) {
			throw new Error(`Tool not found: ${name}`)
		}

		try {
			const result = await handler(args)
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			}
		} catch (error) {
			logger.error("Error calling tool", { err: error, tool: name, args })
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error: ${error instanceof Error ? error.message : JSON.stringify(error, null, 2)}`,
					},
				],
			}
		}
	})

	logger.info("MCP Tool handlers registered")
}
