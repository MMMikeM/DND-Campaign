import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from ".."
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { helpToolDefinitions } from "./tool.help"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"

// Import tool definitions instead of pre-extracted tools and handlers
import { factionToolDefinitions } from "./faction-tools" // Updated path
import { regionToolDefinitions } from "./region-tools" // Updated path and assumed variable name
import { npcToolDefinitions } from "./npc-tools"
import { questToolDefinitions } from "./quest-tools"
import { associationToolDefinitions } from "./association-tools"
import { conflictToolDefinitions } from "./conflict-tools" // Import conflict definitions
import { foreshadowingToolDefinitions } from "./foreshadowing-tools" // Import foreshadowing definitions
import { narrativeToolDefinitions } from "./narrative-tools" // Import narrative definitions
import { worldToolDefinitions } from "./world-tools" // Import world definitions
import { embeddingToolDefinitions } from "./embedding-tools" // Import new definitions
import type { ToolDefinition, ToolHandlerReturn } from "./tool.utils"

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
export const conflicts = extractToolsAndHandlers(conflictToolDefinitions) // Extract conflict tools
export const foreshadowing = extractToolsAndHandlers(foreshadowingToolDefinitions) // Extract foreshadowing tools
export const narrative = extractToolsAndHandlers(narrativeToolDefinitions) // Extract narrative tools
export const world = extractToolsAndHandlers(worldToolDefinitions) // Extract world tools
export const embeddings = extractToolsAndHandlers(embeddingToolDefinitions)
export const help = extractToolsAndHandlers(helpToolDefinitions)

export function registerToolHandlers(server: Server) {
	const tools = [
		...factions.tools,
		...regions.tools,
		...npcs.tools,
		...quests.tools,
		...associations.tools,
		...conflicts.tools, // Add conflict tools
		...foreshadowing.tools, // Add foreshadowing tools
		...narrative.tools, // Add narrative tools
		...world.tools, // Add world tools
		...embeddings.tools,
		...help.tools,
	]

	const allToolHandlers = {
		...factions.handlers,
		...regions.handlers,
		...npcs.handlers,
		...quests.handlers,
		...associations.handlers,
		...conflicts.handlers, // Add conflict handlers
		...foreshadowing.handlers, // Add foreshadowing handlers
		...narrative.handlers, // Add narrative handlers
		...world.handlers, // Add world handlers
		...embeddings.handlers,
		...help.handlers,
	}

	// Register tools lit handler
	server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

	// Register tool call handler
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
