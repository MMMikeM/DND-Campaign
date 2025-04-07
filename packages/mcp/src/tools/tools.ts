import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from ".."
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { helpToolDefinitions } from "./tool.help"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { ToolDefinition, ToolHandlerReturn } from "./utils/types"
import { factionToolDefinitions } from "./faction-tools"
import { regionToolDefinitions } from "./region-tools"
import { npcToolDefinitions } from "./npc-tools"
import { questToolDefinitions } from "./quest-tools"
import { associationToolDefinitions } from "./association-tools"
import { conflictToolDefinitions } from "./conflict-tools"
import { foreshadowingToolDefinitions } from "./foreshadowing-tools"
import { narrativeToolDefinitions } from "./narrative-tools"
import { worldToolDefinitions } from "./world-tools"
import { embeddingToolDefinitions } from "./embedding-tools"
import { getEntityToolDefinition } from "./get-entity"

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
export const associations = extractToolsAndHandlers(associationToolDefinitions)
export const conflicts = extractToolsAndHandlers(conflictToolDefinitions)
export const foreshadowing = extractToolsAndHandlers(foreshadowingToolDefinitions)
export const narrative = extractToolsAndHandlers(narrativeToolDefinitions)
export const world = extractToolsAndHandlers(worldToolDefinitions)
export const embeddings = extractToolsAndHandlers(embeddingToolDefinitions)
export const help = extractToolsAndHandlers(helpToolDefinitions)
export const getEntity = extractToolsAndHandlers(getEntityToolDefinition)

export function registerToolHandlers(server: Server) {
	const tools = [
		...factions.tools,
		...regions.tools,
		...npcs.tools,
		...quests.tools,
		...associations.tools,
		...conflicts.tools,
		...foreshadowing.tools,
		...narrative.tools,
		...world.tools,
		...embeddings.tools,
		...help.tools,
		...getEntity.tools,
	]

	const allToolHandlers = {
		...factions.handlers,
		...regions.handlers,
		...npcs.handlers,
		...quests.handlers,
		...associations.handlers,
		...conflicts.handlers,
		...foreshadowing.handlers,
		...narrative.handlers,
		...world.handlers,
		...embeddings.handlers,
		...help.handlers,
		...getEntity.handlers,
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
