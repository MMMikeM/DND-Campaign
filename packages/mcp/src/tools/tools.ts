import {
	ListToolsRequestSchema,
	CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { logger } from "..";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { helpTool, helpToolHandler } from "./tool.help";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

// Import tool definitions instead of pre-extracted tools and handlers
import { factionToolDefinitions } from "./tool.factions";
import { locationToolDefinitions } from "./tool.locations";
import { npcToolDefinitions } from "./tool.npcs";
import { questToolDefinitions } from "./tool.quests";
import { associationToolDefinitions } from "./tool.associations";
import type { ToolDefinition, ToolHandlerReturn } from "./tool.utils";

function extractToolsAndHandlers<T extends string>(
	definitions: Record<string, ToolDefinition>,
) {
	const tools = Object.entries(definitions).map(
		([name, { description, inputSchema }]) => ({
			name,
			description,
			inputSchema,
		}),
	) as Array<Tool & { name: T }>;

	const handlers = Object.entries(definitions).reduce(
		(acc, [name, { handler }]) => {
			acc[name] = handler;
			return acc;
		},
		{} as Record<
			string,
			(args?: Record<string, unknown>) => Promise<ToolHandlerReturn>
		>,
	);

	return { tools, handlers };
}

// Extract tools and handlers for each category
export const factions = extractToolsAndHandlers(factionToolDefinitions);
export const locations = extractToolsAndHandlers(locationToolDefinitions);
export const npcs = extractToolsAndHandlers(npcToolDefinitions);
export const quests = extractToolsAndHandlers(questToolDefinitions);
export const associations = extractToolsAndHandlers(associationToolDefinitions);

export function registerToolHandlers(server: Server) {
	// Helper function to extract tools and handlers from definitions

	// Combine all tools
	const allTools = [
		...factions.tools,
		...locations.tools,
		...npcs.tools,
		...quests.tools,
		...associations.tools,
		helpTool,
	];

	// Combined tool handlers
	const allToolHandlers = {
		...factions.handlers,
		...locations.handlers,
		...npcs.handlers,
		...quests.handlers,
		...associations.handlers,
		help: (args?: Record<string, unknown>) => helpToolHandler(allTools, args),
	};

	// Register tools list handler
	server.setRequestHandler(ListToolsRequestSchema, async () => {
		return { tools: allTools };
	});

	// Register tool call handler
	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		const { name, arguments: args } = request.params;

		const handler = allToolHandlers[name as keyof typeof allToolHandlers];
		if (!handler) {
			throw new Error(`Tool not found: ${name}`);
		}

		try {
			const result = await handler(args);
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			logger.error(
				`Error calling tool ${name}:`,
				error as Record<string, unknown>,
			);
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			};
		}
	});

	// Log that tools are registered
	logger.info("MCP Tool handlers registered");
}
