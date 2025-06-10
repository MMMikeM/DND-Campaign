import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from ".."
import { conflictToolDefinitions } from "./conflict-tools"
import { eventToolDefinitions } from "./events-tools"
import { factionToolDefinitions } from "./faction-tools"
import { foreshadowingToolDefinitions } from "./foreshadowing-tools"
import { getEntityToolDefinition } from "./get-entity"
import { helpToolDefinitions } from "./help-tools"
import { itemToolDefinitions } from "./items-tools"
import { narrativeToolDefinitions } from "./narrative-tools"
import { npcToolDefinitions } from "./npc-tools"
import { questToolDefinitions } from "./quest-tools"
import { regionToolDefinitions } from "./region-tools"
import { fuzzySearchToolDefinitions } from "./utils/fuzzy-search"
import type { ToolDefinition, ToolHandlerReturn } from "./utils/types"
import { worldToolDefinitions as worldbuildingToolDefinitions } from "./worldbuilding-tools"

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

export const factions = extractToolsAndHandlers(factionToolDefinitions)
export const regions = extractToolsAndHandlers(regionToolDefinitions)
export const npcs = extractToolsAndHandlers(npcToolDefinitions)
export const quests = extractToolsAndHandlers(questToolDefinitions)
export const conflicts = extractToolsAndHandlers(conflictToolDefinitions)
export const narrative = extractToolsAndHandlers(narrativeToolDefinitions)
export const worldbuilding = extractToolsAndHandlers(worldbuildingToolDefinitions)
export const events = extractToolsAndHandlers(eventToolDefinitions)
export const foreshadowing = extractToolsAndHandlers(foreshadowingToolDefinitions)
export const items = extractToolsAndHandlers(itemToolDefinitions)
export const help = extractToolsAndHandlers(helpToolDefinitions)
export const getEntity = extractToolsAndHandlers(getEntityToolDefinition)
export const fuzzySearch = extractToolsAndHandlers(fuzzySearchToolDefinitions)

export function registerToolHandlers(server: Server) {
	const tools = [
		...help.tools,
		...getEntity.tools,
		...factions.tools,
		...regions.tools,
		...npcs.tools,
		...quests.tools,
		...conflicts.tools,
		...narrative.tools,
		...worldbuilding.tools,
		...events.tools,
		...foreshadowing.tools,
		...items.tools,
		...fuzzySearch.tools,
	]

	const allToolHandlers = {
		...help.handlers,
		...getEntity.handlers,
		...factions.handlers,
		...regions.handlers,
		...npcs.handlers,
		...quests.handlers,
		...conflicts.handlers,
		...narrative.handlers,
		...worldbuilding.handlers,
		...events.handlers,
		...foreshadowing.handlers,
		...items.handlers,
		...fuzzySearch.handlers,
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
			logger.error(`Error calling tool ${name}:`, error as Record<string, unknown>)
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			}
		}
	})

	logger.info("MCP Tool handlers registered")
}
