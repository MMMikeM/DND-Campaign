import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
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
import type { ToolDefinition, ToolHandlerReturn } from "./utils/types"

function extractToolsAndHandlers<T extends Record<string, ToolDefinition>>(definitions: T) {
	const tools = Object.entries(definitions).map(([name, { description, inputSchema }]) => ({
		name,
		description,
		inputSchema,
	})) as Array<Tool & { name: keyof T }>

	const handlers = Object.entries(definitions).reduce(
		(acc, [name, { handler }]) => {
			acc[name as keyof T] = handler
			return acc
		},
		{} as Record<keyof T, (args?: Record<string, unknown>) => Promise<ToolHandlerReturn>>,
	)

	return { tools, handlers }
}

export const conflicts = extractToolsAndHandlers(conflictToolDefinitions)
export const consequences = extractToolsAndHandlers(consequenceToolDefinitions)
export const factions = extractToolsAndHandlers(factionToolDefinitions)
export const foreshadowing = extractToolsAndHandlers(foreshadowingToolDefinitions)
export const fuzzySearch = extractToolsAndHandlers(fuzzySearchToolDefinitions)
export const getEntity = extractToolsAndHandlers(getEntityToolDefinition)
export const help = extractToolsAndHandlers(helpToolDefinitions)
export const items = extractToolsAndHandlers(itemToolDefinitions)
export const lore = extractToolsAndHandlers(loreToolDefinitions)
export const maps = extractToolsAndHandlers(mapToolDefinitions)
export const npcs = extractToolsAndHandlers(npcToolDefinitions)
export const quests = extractToolsAndHandlers(questToolDefinitions)
export const questStages = extractToolsAndHandlers(questStageToolDefinitions)
export const regions = extractToolsAndHandlers(regionToolDefinitions)

export function registerToolHandlers(server: Server) {
	const tools = [
		// Utility tools
		...help.tools,
		...getEntity.tools,
		...fuzzySearch.tools,
		...maps.tools,

		// Manage tools
		...conflicts.tools,
		...consequences.tools,
		...factions.tools,
		...foreshadowing.tools,
		...items.tools,
		...lore.tools,
		...npcs.tools,
		...quests.tools,
		...questStages.tools,
		...regions.tools,
	]

	const allToolHandlers = {
		// Utility tools
		...help.handlers,
		...getEntity.handlers,
		...fuzzySearch.handlers,
		...maps.handlers,

		// Manage tools
		...conflicts.handlers,
		...consequences.handlers,
		...factions.handlers,
		...foreshadowing.handlers,
		...items.handlers,
		...lore.handlers,
		...npcs.handlers,
		...quests.handlers,
		...questStages.handlers,
		...regions.handlers,
	}

	server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		const { name, arguments: args } = request.params

		const handler = allToolHandlers[name as keyof typeof allToolHandlers]
		logger.info("MCP Tool handlers", { handler })
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

	logger.info("MCP Tool handlers registered")
}
