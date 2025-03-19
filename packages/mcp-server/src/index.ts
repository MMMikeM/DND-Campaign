import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import logger from "./logger.js"
import { createServer } from "node:http"
import * as z from "zod"

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

// Helper function to convert Zod schema to MCP schema
function zodToMCP(schema: z.ZodType<unknown>) {
	if (schema instanceof z.ZodObject) {
		const shape = schema.shape
		const properties: Record<string, { type: string; description?: string }> = {}
		const required: string[] = []

		for (const [key, value] of Object.entries(shape)) {
			if (value instanceof z.ZodString) {
				properties[key] = { type: "string" }
			} else if (value instanceof z.ZodNumber) {
				properties[key] = { type: "number" }
			} else if (value instanceof z.ZodBoolean) {
				properties[key] = { type: "boolean" }
			} else if (value instanceof z.ZodArray) {
				properties[key] = { type: "array" }
			} else if (value instanceof z.ZodObject) {
				properties[key] = { type: "object" }
			} else if (value instanceof z.ZodOptional) {
				properties[key] = { type: "any" }
			} else if (value instanceof z.ZodNullable) {
				properties[key] = { type: "any" }
			} else {
				properties[key] = { type: "any" }
			}

			if (!(value instanceof z.ZodOptional) && !(value instanceof z.ZodNullable)) {
				required.push(key)
			}
		}

		return {
			type: "object",
			properties,
			required,
		}
	}

	return {
		type: "object",
		properties: {},
		required: [],
	}
}

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
			inputSchema: zodToMCP(newQuestSchema),
		},
		{
			name: "mcp_dnd_get_quest",
			description: "Get a quest by ID",
			inputSchema: {
				type: "object",
				properties: {
					id: { type: "number" },
				},
				required: ["id"],
			},
		},
		{
			name: "mcp_dnd_update_quest",
			description: "Update a quest",
			inputSchema: zodToMCP(updateQuestSchema),
		},
		{
			name: "mcp_dnd_delete_quest",
			description: "Delete a quest",
			inputSchema: zodToMCP(getQuestSchema),
		},
		// NPC Tools
		{
			name: "mcp_dnd_create_npc",
			description: "Create a new NPC",
			inputSchema: zodToMCP(newNpcSchema),
		},
		{
			name: "mcp_dnd_get_npc",
			description: "Get an NPC by ID",
			inputSchema: zodToMCP(getNpcSchema),
		},
		{
			name: "mcp_dnd_update_npc",
			description: "Update an NPC",
			inputSchema: zodToMCP(updateNpcSchema),
		},
		{
			name: "mcp_dnd_delete_npc",
			description: "Delete an NPC",
			inputSchema: zodToMCP(getNpcSchema),
		},
		// Faction Tools
		{
			name: "mcp_dnd_create_faction",
			description: "Create a new faction",
			inputSchema: zodToMCP(newFactionSchema),
		},
		{
			name: "mcp_dnd_get_faction",
			description: "Get a faction by ID",
			inputSchema: zodToMCP(getFactionSchema),
		},
		{
			name: "mcp_dnd_update_faction",
			description: "Update a faction",
			inputSchema: zodToMCP(updateFactionSchema),
		},
		{
			name: "mcp_dnd_delete_faction",
			description: "Delete a faction",
			inputSchema: zodToMCP(getFactionSchema),
		},
		// Location Tools
		{
			name: "mcp_dnd_create_location",
			description: "Create a new location",
			inputSchema: zodToMCP(newLocationSchema),
		},
		{
			name: "mcp_dnd_get_location",
			description: "Get a location by ID",
			inputSchema: zodToMCP(getLocationSchema),
		},
		{
			name: "mcp_dnd_update_location",
			description: "Update a location",
			inputSchema: zodToMCP(updateLocationSchema),
		},
		{
			name: "mcp_dnd_delete_location",
			description: "Delete a location",
			inputSchema: zodToMCP(getLocationSchema),
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
				if (!args) throw new Error("No arguments provided")
				const test = db.query.quests.findMany()
				return { content: [{ type: "text", text: JSON.stringify(test) }] }
				const quest = newQuestSchema.parse(args.id)
				logger.info("Creating quest", { quest })
				try {
					const result = operations.quests.create(quest)
					return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] }
				} catch (error) {
					logger.error("Failed to create quest", { error: (error as Error).message })
					return {
						content: [{ type: "text", text: `Error creating quest: ${(error as Error).message}` }],
					}
				}
			}

			case "mcp_dnd_get_quest": {
				if (!args) throw new Error("No arguments provided")
				console.log(args.id)
				const id = getQuestSchema.parse(args.id)
				logger.debug("Getting quest", { id })
				try {
					const quest = operations.quests.get(id)
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
				if (!args) throw new Error("No arguments provided")
				const quest = updateQuestSchema.parse(args)
				logger.info("Updating quest", { quest })
				try {
					if (!quest.id) throw new Error("Quest ID is required for update")
					operations.quests.update(quest.id, quest)
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
				if (!args) throw new Error("No arguments provided")
				const id = getQuestSchema.parse(args)
				logger.info("Deleting quest", { id })
				try {
					operations.quests.delete(id)
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
				if (!args) throw new Error("No arguments provided")
				const npc = newNpcSchema.parse(args)
				logger.info("Creating NPC", { npc })
				try {
					const result = operations.npcs.create(npc)
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
				if (!args) throw new Error("No arguments provided")
				const id = getNpcSchema.parse(args)
				logger.debug("Getting NPC", { id })
				try {
					const npc = operations.npcs.get(id)
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
				if (!args) throw new Error("No arguments provided")
				const npc = updateNpcSchema.parse(args)
				logger.info("Updating NPC", { npc })
				try {
					if (!npc.id) throw new Error("NPC ID is required for update")
					operations.npcs.update(npc.id, npc)
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
				if (!args) throw new Error("No arguments provided")
				const id = getNpcSchema.parse(args)
				logger.info("Deleting NPC", { id })
				try {
					operations.npcs.delete(id)
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
				if (!args) throw new Error("No arguments provided")
				const faction = newFactionSchema.parse(args)
				logger.info("Creating faction", { faction })
				try {
					const result = operations.factions.create(faction)
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
				if (!args) throw new Error("No arguments provided")
				const id = getFactionSchema.parse(args)
				logger.debug("Getting faction", { id })
				try {
					const faction = operations.factions.get(id)
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
				if (!args) throw new Error("No arguments provided")
				const faction = updateFactionSchema.parse(args)
				logger.info("Updating faction", { faction })
				try {
					if (!faction.id) throw new Error("Faction ID is required for update")
					operations.factions.update(faction.id, faction)
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
				if (!args) throw new Error("No arguments provided")
				const id = getFactionSchema.parse(args)
				logger.info("Deleting faction", { id })
				try {
					operations.factions.delete(id)
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
				if (!args) throw new Error("No arguments provided")
				const location = newLocationSchema.parse(args)
				logger.info("Creating location", { location })
				try {
					const result = operations.locations.create(location)
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
				if (!args) throw new Error("No arguments provided")
				const id = getLocationSchema.parse(args)
				logger.debug("Getting location", { id })
				try {
					const location = operations.locations.get(id)
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
				if (!args) throw new Error("No arguments provided")
				const location = updateLocationSchema.parse(args)
				logger.info("Updating location", { location })
				try {
					if (!location.id) throw new Error("Location ID is required for update")
					operations.locations.update(location.id, location)
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
				if (!args) throw new Error("No arguments provided")
				const id = getLocationSchema.parse(args)
				logger.info("Deleting location", { id })
				try {
					operations.locations.delete(id)
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
			logger.info("Received request", {
				url: req.url,
				method: req.method,
				headers: req.headers,
			})

			// Parse the URL to handle query parameters
			const url = new URL(req.url || "", `http://${req.headers.host}`)
			const pathname = url.pathname

			if (pathname === "/mcp" && req.method === "GET") {
				logger.info("Establishing SSE connection")
				// SSE connection
				transport = new SSEServerTransport("/mcp", res)
				await mcpServer.connect(transport)
				logger.info("SSE connection established")
			} else if (pathname === "/mcp" && req.method === "POST") {
				logger.info("Handling POST request")
				// Handle incoming messages
				if (transport instanceof SSEServerTransport) {
					await transport.handlePostMessage(req, res)
					logger.info("POST request handled successfully")
				} else {
					logger.error("No SSE connection established for POST request")
					res.writeHead(500).end("No SSE connection established")
				}
			} else {
				logger.warn("Invalid request path", { pathname })
				res.writeHead(404).end()
			}
		})

		httpServer.listen(port, () => {
			logger.info("SSE server listening", {
				url: `http://localhost:${port}/mcp`,
				transport: process.env.MCP_TRANSPORT,
				port: port,
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
