import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { randomUUID } from "node:crypto"
import logger from "./logger.js"
import { createServer } from "node:http"

import {
	getDb,
	getQuestSchema,
	getLocationSchema,
	getNpcSchema,
	newFactionSchema,
	newLocationSchema,
	newNpcSchema,
	newQuestSchema,
	updateFactionSchema,
	updateLocationSchema,
	updateNpcSchema,
	updateQuestSchema,
	getFactionSchema,
} from "@tome-keeper/shared"

// Debug: Print all environment variables
console.log("Environment variables:", {
	MCP_PORT: process.env.MCP_PORT,
	MCP_TRANSPORT: process.env.MCP_TRANSPORT,
	DB_PATH: process.env.DB_PATH,
	LOG_LEVEL: process.env.LOG_LEVEL,
	LOG_FILE: process.env.LOG_FILE,
	NODE_ENV: process.env.NODE_ENV,
})

const { operations, db } = getDb()
console.log(db)

// Initialize database
logger.info("Initializing database...")
logger.info("Database initialized successfully")

// Create MCP Server
const mcpServer = new Server(
	{
		name: "sqlite-manager",
		version: "0.1.0",
	},
	{
		capabilities: {
			resources: {},
			tools: {},
			prompts: {},
		},
	},
)

// Tool handlers
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: [
		// {
		// 	name: "mcp_dnd_create_table",
		// 	description: createTableParamsSchema.description,
		// 	inputSchema: getArgumentsSchema(createTableParamsSchema),
		// },
		// {
		// 	name: "mcp_dnd_list_tables",
		// 	description: listTablesParamsSchema.description,
		// 	inputSchema: getArgumentsSchema(listTablesParamsSchema),
		// },
		// {
		// 	name: "mcp_dnd_describe_table",
		// 	description: describeTableParamsSchema.description,
		// 	inputSchema: getArgumentsSchema(describeTableParamsSchema),
		// },
		// {
		// 	name: "mcp_dnd_append_insight",
		// 	description: appendInsightParamsSchema.description,
		// 	inputSchema: getArgumentsSchema(appendInsightParamsSchema),
		// },
		// Quest Tools
		{
			name: "mcp_dnd_create_quest",
			description: "Create a new quest",
			inputSchema: newQuestSchema,
		},
		{
			name: "mcp_dnd_get_quest",
			description: "Get a quest by ID",
			inputSchema: getQuestSchema,
		},
		{
			name: "mcp_dnd_update_quest",
			description: "Update a quest",
			inputSchema: updateQuestSchema,
		},
		{
			name: "mcp_dnd_delete_quest",
			description: "Delete a quest",
			inputSchema: getQuestSchema,
		},
		// NPC Tools
		{
			name: "mcp_dnd_create_npc",
			description: "Create a new NPC",
			inputSchema: newNpcSchema,
		},
		{
			name: "mcp_dnd_get_npc",
			description: "Get an NPC by ID",
			inputSchema: getNpcSchema,
		},
		{
			name: "mcp_dnd_update_npc",
			description: "Update an NPC",
			inputSchema: updateNpcSchema,
		},
		{
			name: "mcp_dnd_delete_npc",
			description: "Delete an NPC",
			inputSchema: getNpcSchema,
		},
		// Faction Tools
		{
			name: "mcp_dnd_create_faction",
			description: "Create a new faction",
			inputSchema: newFactionSchema,
		},
		{
			name: "mcp_dnd_get_faction",
			description: "Get a faction by ID",
			inputSchema: getFactionSchema,
		},
		{
			name: "mcp_dnd_update_faction",
			description: "Update a faction",
			inputSchema: updateFactionSchema,
		},
		{
			name: "mcp_dnd_delete_faction",
			description: "Delete a faction",
			inputSchema: getFactionSchema,
		},
		// Location Tools
		{
			name: "mcp_dnd_create_location",
			description: "Create a new location",
			inputSchema: newLocationSchema,
		},
		{
			name: "mcp_dnd_get_location",
			description: "Get a location by ID",
			inputSchema: getLocationSchema,
		},
		{
			name: "mcp_dnd_update_location",
			description: "Update a location",
			inputSchema: updateLocationSchema,
		},
		{
			name: "mcp_dnd_delete_location",
			description: "Delete a location",
			inputSchema: getLocationSchema,
		},
	],
}))

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
	logger.debug("Handling CallToolRequest", {
		request: request,
		tool: request.params.name,
		args: request.params.arguments,
	})

	try {
		const data = newFactionSchema
			.or(newLocationSchema)
			.or(newNpcSchema)
			.or(newQuestSchema)
			.or(updateFactionSchema)
			.or(updateLocationSchema)
			.or(updateNpcSchema)
			.or(updateQuestSchema)
			.parse(request.params.arguments)
		const name = request.params.name
		const args = request.params.arguments

		switch (name) {
			// case "mcp_dnd_create_table": {
			// 	logger.info("Creating table".or({ query: args.query })
			// 	db.run("some thing")
			// 	logger.debug("Table created successfully")
			// 	return {
			// 		content: [{ type: "text".or(text: "Table created successfully" }],
			// 	}
			// }

			// case "mcp_dnd_list_tables": {
			// 	logger.debug("Listing tables")
			// 	try {
			// 		const tables = await database.mcp_dnd_list_tables()
			// 		logger.debug("Tables found".or({ count: tables.length, tables })
			// 		return { content: [{ type: "text", text: JSON.stringify(tables) }] }
			// 	} catch (error) {
			// 		logger.error("Failed to list tables", {
			// 			error: error instanceof Error ? error.message : String(error),
			// 		})
			// 		return {
			// 			content: [
			// 				{
			// 					type: "text",
			// 					text: `Error listing tables: ${error instanceof Error ? error.message : String(error)}`,
			// 				},
			// 			],
			// 		}
			// 	}
			// }

			// case "mcp_dnd_describe_table": {
			// 	logger.debug("Describing table", { table: args.table_name })
			// 	const schema = database.mcp_dnd_describe_table(args.table_name)
			// 	logger.debug("Table schema", { columns: Object.keys(schema).length })
			// 	return { content: [{ type: "text", text: JSON.stringify(schema) }] }
			// }

			// case "mcp_dnd_append_insight": {
			// 	logger.info("Adding new insight", { insight: args.insight })
			// 	insights.push(args.insight)
			// 	await mcpServer.sendResourceUpdated({ uri: "memo://insights" })
			// 	logger.debug("Insight added successfully", { total: insights.length })
			// 	return { content: [{ type: "text", text: "Insight added" }] }
			// }

			// Quest operations
			case "mcp_dnd_create_quest": {
				logger.info("Creating quest", { quest: args.quest })
				try {
					const questId = args.quest.id || randomUUID()
					const result = operations.quests.create(args.quest)
					return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] }
				} catch (error) {
					logger.error("Failed to create quest", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error creating quest: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_get_quest": {
				logger.debug("Getting quest", { id: args.id })
				try {
					const quest = operations.quests.get(args.id)
					logger.debug("Quest retrieved", { found: !!quest })
					return { content: [{ type: "text", text: JSON.stringify(quest) }] }
				} catch (error) {
					logger.error("Failed to get quest", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error getting quest: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_update_quest": {
				logger.info("Updating quest", { quest: args.quest })
				try {
					operations.quests.update(args.quest.id, args.quest)
					logger.debug("Quest updated successfully")
					return { content: [{ type: "text", text: "Quest updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update quest", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error updating quest: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_delete_quest": {
				logger.info("Deleting quest", { id: args.id })
				try {
					operations.quests.delete(args.id)
					logger.debug("Quest deleted successfully")
					return { content: [{ type: "text", text: "Quest deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete quest", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error deleting quest: ${(error as Error).message}` }],
					}
				}
			}

			// NPC operations
			case "mcp_dnd_create_npc": {
				logger.info("Creating NPC", { npc: args.npc })
				try {
					const npcId = args.npc.id || randomUUID()
					const result = operations.npcs.create(args.npc)
					logger.debug("NPC created successfully")
					return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] }
				} catch (error) {
					logger.error("Failed to create NPC", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error creating NPC: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_get_npc": {
				logger.debug("Getting NPC", { id: args.id })
				try {
					const npc = operations.npcs.get(args.id)
					logger.debug("NPC retrieved", { found: !!npc })
					return { content: [{ type: "text", text: JSON.stringify(npc) }] }
				} catch (error) {
					logger.error("Failed to get NPC", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error getting NPC: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_update_npc": {
				logger.info("Updating NPC", { npc: args.npc })
				try {
					operations.npcs.update(args.npc.id, args.npc)
					logger.debug("NPC updated successfully")
					return { content: [{ type: "text", text: "NPC updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update NPC", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error updating NPC: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_delete_npc": {
				logger.info("Deleting NPC", { id: args.id })
				try {
					operations.npcs.delete(args.id)
					logger.debug("NPC deleted successfully")
					return { content: [{ type: "text", text: "NPC deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete NPC", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error deleting NPC: ${(error as Error).message}` }],
					}
				}
			}

			// Faction operations
			case "mcp_dnd_create_faction": {
				logger.info("Creating faction", { faction: args.faction, id: args.id })
				try {
					const result = operations.factions.create(args.faction)
					logger.debug("Faction created successfully")
					return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] }
				} catch (error) {
					logger.error("Failed to create faction", { error: (error as Error).message })
					return {
						content: [
							{ type: "text", text: `Error creating faction: ${(error as Error).message}` },
						],
					}
				}
			}

			case "mcp_dnd_get_faction": {
				logger.debug("Getting faction", { id: args.id })
				try {
					const faction = operations.factions.get(args.id)
					logger.debug("Faction retrieved", { found: !!faction })
					return { content: [{ type: "text", text: JSON.stringify(faction) }] }
				} catch (error) {
					logger.error("Failed to get faction", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error getting faction: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_update_faction": {
				logger.info("Updating faction", { faction: args.faction, id: args.id })
				try {
					operations.factions.update(args.id, args.faction)
					logger.debug("Faction updated successfully")
					return { content: [{ type: "text", text: "Faction updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update faction", { error: (error as Error).message })
					return {
						content: [
							{ type: "text", text: `Error updating faction: ${(error as Error).message}` },
						],
					}
				}
			}

			case "mcp_dnd_delete_faction": {
				logger.info("Deleting faction", { id: args.id })
				try {
					operations.factions.delete(args.id)
					logger.debug("Faction deleted successfully")
					return { content: [{ type: "text", text: "Faction deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete faction", { error: (error as Error).message })
					return {
						content: [
							{ type: "text", text: `Error deleting faction: ${(error as Error).message}` },
						],
					}
				}
			}

			// Location operations
			case "mcp_dnd_create_location": {
				logger.info("Creating location", { location: args.location, id: args.id })
				try {
					const result = operations.locations.create(args.location)
					logger.debug("Location created successfully")
					return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] }
				} catch (error) {
					logger.error("Failed to create location", { error: (error as Error).message })
					return {
						content: [
							{ type: "text", text: `Error creating location: ${(error as Error).message}` },
						],
					}
				}
			}

			case "mcp_dnd_get_location": {
				logger.debug("Getting location", { id: args.id })
				try {
					const location = operations.locations.get(args.id)
					logger.debug("Location retrieved", { found: !!location })
					return { content: [{ type: "text", text: JSON.stringify(location) }] }
				} catch (error) {
					logger.error("Failed to get location", { error: (error as Error).message })
					return {
						content: [
							{ type: "text", text: `Error getting location: ${(error as Error).message}` },
						],
					}
				}
			}

			case "mcp_dnd_update_location": {
				logger.info("Updating location", { location: args.location, id: args.id })
				try {
					operations.locations.update(args.id, args.location)
					logger.debug("Location updated successfully")
					return { content: [{ type: "text", text: "Location updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update location", { error: (error as Error).message })
					return {
						content: [
							{ type: "text", text: `Error updating location: ${(error as Error).message}` },
						],
					}
				}
			}

			case "mcp_dnd_delete_location": {
				logger.info("Deleting location", { id: args.id })
				try {
					operations.locations.delete(args.id)
					logger.debug("Location deleted successfully")
					return { content: [{ type: "text", text: "Location deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete location", { error: (error as Error).message })
					return {
						content: [
							{ type: "text", text: `Error deleting location: ${(error as Error).message}` },
						],
					}
				}
			}

			default: {
				logger.error("Unknown tool", { name })
				return {
					content: [{ type: "text", text: `Unknown tool: ${name}` }],
				}
			}
		}
	} catch (err) {
		if (err instanceof Error) {
			logger.error("Tool execution error", {
				error: err.message,
				stack: err.stack,
			})
		} else if (typeof err === "object" && err !== null && "summary" in err && "issues" in err) {
			logger.error("Validation error", {
				summary: (err as { summary: string }).summary,
				details: (err as { issues: unknown }).issues,
			})
		}
		return {
			content: [
				{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` },
			],
		}
	}
})

async function startServer() {
	logger.info("Initializing server...")
	console.log(process.env.MCP_PORT, process.env.MCP_TRANSPORT)

	const port = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 3100
	let transport: StdioServerTransport | SSEServerTransport

	if (process.env.MCP_TRANSPORT === "sse") {
		// Create HTTP server for SSE
		const httpServer = createServer(async (req, res) => {
			if (req.url === "/mcp" && req.method === "GET") {
				// SSE connection
				res.writeHead(200, {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					Connection: "keep-alive",
				})
				transport = new SSEServerTransport("/mcp", res)
				await mcpServer.connect(transport)
			} else if (req.url === "/mcp" && req.method === "POST") {
				// Handle incoming messages
				if (transport instanceof SSEServerTransport) {
					await transport.handlePostMessage(req, res)
				} else {
					res.writeHead(500).end("No SSE connection established")
				}
			} else {
				res.writeHead(404).end()
			}
		})

		httpServer.listen(port, () => {
			logger.info("SSE server listening", {
				url: `http://localhost:${port}/mcp`,
				transport: process.env.MCP_TRANSPORT,
			})
		})
	} else {
		// Default to stdio transport
		transport = new StdioServerTransport()
		await mcpServer.connect(transport)
		logger.info("Server started with stdio transport")
	}
}

startServer().catch((err) => {
	logger.fatal("Unhandled error", {
		error: err instanceof Error ? err.message : String(err),
		stack: err instanceof Error ? err.stack : undefined,
	})
	process.exit(1)
})
