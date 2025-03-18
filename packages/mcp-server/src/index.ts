import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { type } from "arktype"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { SQLiteDatabase } from "./database.js"
import logger from "./logger.js"
import { createServer } from "node:http"
import { initializeDatabase } from "@tome-keeper/shared"
import { sql } from "drizzle-orm"

// Debug: Print all environment variables
console.log("Environment variables:", {
	MCP_PORT: process.env.MCP_PORT,
	MCP_TRANSPORT: process.env.MCP_TRANSPORT,
	DB_PATH: process.env.DB_PATH,
	LOG_LEVEL: process.env.LOG_LEVEL,
	LOG_FILE: process.env.LOG_FILE,
	NODE_ENV: process.env.NODE_ENV,
})

interface SchemaType {
	description?: string
	arguments: Record<string, unknown>
}

function getArgumentsSchema(schema: SchemaType) {
	if (!schema || !schema.arguments) {
		return {
			type: "object",
			properties: {},
			required: [],
			description: schema?.description,
		}
	}

	return {
		type: "object",
		properties: Object.fromEntries(
			Object.entries(schema.arguments).map(([key, value]) => [
				key,
				typeof value === "object" && value !== null
					? value
					: { type: typeof value === "string" ? value : "string" },
			]),
		),
		required: Object.keys(schema.arguments),
		description: schema.description,
	}
}

// Store insights in memory
const insights: string[] = []

// Initialize database
logger.info("Initializing database...")
const dbPath = process.env.DB_PATH || path.join(process.cwd(), "data.sqlite")
const { mcp, sqlite, db } = initializeDatabase(dbPath)
logger.info("Database initialized successfully")

// Create MCP Server
const server = new Server(
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

const createTableParamsSchema = type({
	name: '"mcp_dnd_create_table"',
	arguments: {
		query: type(/^CREATE TABLE/i).describe("a CREATE TABLE statement"),
	},
}).describe("Create a new table in the database")

const listTablesParamsSchema = type({
	name: '"mcp_dnd_list_tables"',
	arguments: {},
}).describe("List all tables in the database")

const describeTableParamsSchema = type({
	name: '"mcp_dnd_describe_table"',
	arguments: {
		table_name: "string",
	},
}).describe("Get schema information for a table")

const appendInsightParamsSchema = type({
	name: '"mcp_dnd_append_insight"',
	arguments: {
		insight: "string",
	},
}).describe("Add a business insight to the memo")

// ===== Quest Tools =====
const createQuestParamsSchema = type({
	name: '"mcp_dnd_create_quest"',
	arguments: {
		quest: type("object"),
	},
}).describe("Create a new quest")

const getQuestParamsSchema = type({
	name: '"mcp_dnd_get_quest"',
	arguments: {
		id: "string",
	},
}).describe("Get a quest by ID")

const updateQuestParamsSchema = type({
	name: '"mcp_dnd_update_quest"',
	arguments: {
		quest: type("object"),
	},
}).describe("Update an existing quest")

const deleteQuestParamsSchema = type({
	name: '"mcp_dnd_delete_quest"',
	arguments: {
		id: "string",
	},
}).describe("Delete a quest")

// ===== NPC Tools =====
const createNPCParamsSchema = type({
	name: '"mcp_dnd_create_npc"',
	arguments: {
		npc: type("object"),
	},
}).describe("Create a new NPC")

const getNPCParamsSchema = type({
	name: '"mcp_dnd_get_npc"',
	arguments: {
		id: "string",
	},
}).describe("Get an NPC by ID")

const updateNPCParamsSchema = type({
	name: '"mcp_dnd_update_npc"',
	arguments: {
		npc: type("object"),
	},
}).describe("Update an existing NPC")

const deleteNPCParamsSchema = type({
	name: '"mcp_dnd_delete_npc"',
	arguments: {
		id: "string",
	},
}).describe("Delete an NPC")

// ===== Faction Tools =====
const createFactionParamsSchema = type({
	name: '"mcp_dnd_create_faction"',
	arguments: {
		id: "string",
		faction: type("object"),
	},
}).describe("Create a new faction")

const getFactionParamsSchema = type({
	name: '"mcp_dnd_get_faction"',
	arguments: {
		id: "string",
	},
}).describe("Get a faction by ID")

const updateFactionParamsSchema = type({
	name: '"mcp_dnd_update_faction"',
	arguments: {
		id: "string",
		faction: type("object"),
	},
}).describe("Update an existing faction")

const deleteFactionParamsSchema = type({
	name: '"mcp_dnd_delete_faction"',
	arguments: {
		id: "string",
	},
}).describe("Delete a faction")

// ===== Location Tools =====
const createLocationParamsSchema = type({
	name: '"mcp_dnd_create_location"',
	arguments: {
		id: "string",
		location: type("object"),
	},
}).describe("Create a new location")

const getLocationParamsSchema = type({
	name: '"mcp_dnd_get_location"',
	arguments: {
		id: "string",
	},
}).describe("Get a location by ID")

const updateLocationParamsSchema = type({
	name: '"mcp_dnd_update_location"',
	arguments: {
		id: "string",
		location: type("object"),
	},
}).describe("Update an existing location")

const deleteLocationParamsSchema = type({
	name: '"mcp_dnd_delete_location"',
	arguments: {
		id: "string",
	},
}).describe("Delete a location")

const validParams = createTableParamsSchema
	.or(listTablesParamsSchema)
	.or(describeTableParamsSchema)
	.or(appendInsightParamsSchema)
	// Quest params
	.or(createQuestParamsSchema)
	.or(getQuestParamsSchema)
	.or(updateQuestParamsSchema)
	.or(deleteQuestParamsSchema)
	// NPC params
	.or(createNPCParamsSchema)
	.or(getNPCParamsSchema)
	.or(updateNPCParamsSchema)
	.or(deleteNPCParamsSchema)
	// Faction params
	.or(createFactionParamsSchema)
	.or(getFactionParamsSchema)
	.or(updateFactionParamsSchema)
	.or(deleteFactionParamsSchema)
	// Location params
	.or(createLocationParamsSchema)
	.or(getLocationParamsSchema)
	.or(updateLocationParamsSchema)
	.or(deleteLocationParamsSchema)

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: [
		{
			name: "mcp_dnd_create_table",
			description: createTableParamsSchema.description,
			inputSchema: getArgumentsSchema(createTableParamsSchema),
		},
		{
			name: "mcp_dnd_list_tables",
			description: listTablesParamsSchema.description,
			inputSchema: getArgumentsSchema(listTablesParamsSchema),
		},
		{
			name: "mcp_dnd_describe_table",
			description: describeTableParamsSchema.description,
			inputSchema: getArgumentsSchema(describeTableParamsSchema),
		},
		{
			name: "mcp_dnd_append_insight",
			description: appendInsightParamsSchema.description,
			inputSchema: getArgumentsSchema(appendInsightParamsSchema),
		},
		// Quest Tools
		{
			name: "mcp_dnd_create_quest",
			description: createQuestParamsSchema.description,
			inputSchema: getArgumentsSchema(createQuestParamsSchema),
		},
		{
			name: "mcp_dnd_get_quest",
			description: getQuestParamsSchema.description,
			inputSchema: getArgumentsSchema(getQuestParamsSchema),
		},
		{
			name: "mcp_dnd_update_quest",
			description: updateQuestParamsSchema.description,
			inputSchema: getArgumentsSchema(updateQuestParamsSchema),
		},
		{
			name: "mcp_dnd_delete_quest",
			description: deleteQuestParamsSchema.description,
			inputSchema: getArgumentsSchema(deleteQuestParamsSchema),
		},
		// NPC Tools
		{
			name: "mcp_dnd_create_npc",
			description: createNPCParamsSchema.description,
			inputSchema: getArgumentsSchema(createNPCParamsSchema),
		},
		{
			name: "mcp_dnd_get_npc",
			description: getNPCParamsSchema.description,
			inputSchema: getArgumentsSchema(getNPCParamsSchema),
		},
		{
			name: "mcp_dnd_update_npc",
			description: updateNPCParamsSchema.description,
			inputSchema: getArgumentsSchema(updateNPCParamsSchema),
		},
		{
			name: "mcp_dnd_delete_npc",
			description: deleteNPCParamsSchema.description,
			inputSchema: getArgumentsSchema(deleteNPCParamsSchema),
		},
		// Faction Tools
		{
			name: "mcp_dnd_create_faction",
			description: createFactionParamsSchema.description,
			inputSchema: getArgumentsSchema(createFactionParamsSchema),
		},
		{
			name: "mcp_dnd_get_faction",
			description: getFactionParamsSchema.description,
			inputSchema: getArgumentsSchema(getFactionParamsSchema),
		},
		{
			name: "mcp_dnd_update_faction",
			description: updateFactionParamsSchema.description,
			inputSchema: getArgumentsSchema(updateFactionParamsSchema),
		},
		{
			name: "mcp_dnd_delete_faction",
			description: deleteFactionParamsSchema.description,
			inputSchema: getArgumentsSchema(deleteFactionParamsSchema),
		},
		// Location Tools
		{
			name: "mcp_dnd_create_location",
			description: createLocationParamsSchema.description,
			inputSchema: getArgumentsSchema(createLocationParamsSchema),
		},
		{
			name: "mcp_dnd_get_location",
			description: getLocationParamsSchema.description,
			inputSchema: getArgumentsSchema(getLocationParamsSchema),
		},
		{
			name: "mcp_dnd_update_location",
			description: updateLocationParamsSchema.description,
			inputSchema: getArgumentsSchema(updateLocationParamsSchema),
		},
		{
			name: "mcp_dnd_delete_location",
			description: deleteLocationParamsSchema.description,
			inputSchema: getArgumentsSchema(deleteLocationParamsSchema),
		},
	],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	logger.debug("Handling CallToolRequest", {
		tool: request.params.name,
		args: request.params.arguments,
	})

	try {
		const data = validParams.assert(request.params)
		const name = data.name
		const args = data.arguments

		switch (name) {
			case "mcp_dnd_create_table": {
				logger.info("Creating table", { query: args.query })
				db.run(sql.raw(args.query))
				logger.debug("Table created successfully")
				return {
					content: [{ type: "text", text: "Table created successfully" }],
				}
			}

			case "mcp_dnd_list_tables": {
				logger.debug("Listing tables")
				try {
					const tables = mcp.mcp_dnd_list_tables()
					logger.debug("Tables found", { count: tables.length, tables })
					return { content: [{ type: "text", text: JSON.stringify(tables) }] }
				} catch (error) {
					logger.error("Failed to list tables", {
						error: error instanceof Error ? error.message : String(error),
					})
					return {
						content: [
							{
								type: "text",
								text: `Error listing tables: ${error instanceof Error ? error.message : String(error)}`,
							},
						],
					}
				}
			}

			case "mcp_dnd_describe_table": {
				logger.debug("Describing table", { table: args.table_name })
				const schema = mcp.mcp_dnd_describe_table(args.table_name)
				logger.debug("Table schema", { columns: Object.keys(schema).length })
				return { content: [{ type: "text", text: JSON.stringify(schema) }] }
			}

			case "mcp_dnd_append_insight": {
				logger.info("Adding new insight", { insight: args.insight })
				insights.push(args.insight)
				await server.sendResourceUpdated({ uri: "memo://insights" })
				logger.debug("Insight added successfully", { total: insights.length })
				return { content: [{ type: "text", text: "Insight added" }] }
			}

			// Quest operations
			case "mcp_dnd_create_quest": {
				logger.info("Creating quest", { quest: args.quest })
				try {
					const questId = args.quest.id || randomUUID()
					const result = mcp.mcp_dnd_create_quest(args.quest)
					logger.debug("Quest created successfully")
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
					const quest = mcp.mcp_dnd_get_quest(args.id)
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
					mcp.mcp_dnd_update_quest(args.quest.id, args.quest)
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
					mcp.mcp_dnd_delete_quest(args.id)
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
					const result = mcp.mcp_dnd_create_npc(args.npc)
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
					const npc = mcp.mcp_dnd_get_npc(args.id)
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
					mcp.mcp_dnd_update_npc(args.npc.id, args.npc)
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
					mcp.mcp_dnd_delete_npc(args.id)
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
					const result = mcp.mcp_dnd_create_faction(args.faction)
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
					const faction = mcp.mcp_dnd_get_faction(args.id)
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
					mcp.mcp_dnd_update_faction(args.id, args.faction)
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
					mcp.mcp_dnd_delete_faction(args.id)
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
					const result = mcp.mcp_dnd_create_location(args.location)
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
					const location = mcp.mcp_dnd_get_location(args.id)
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
					mcp.mcp_dnd_update_location(args.id, args.location)
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
					mcp.mcp_dnd_delete_location(args.id)
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
				await server.connect(transport)
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
		await server.connect(transport)
		logger.info("Server started with stdio transport")
	}
}

// Handle cleanup
process.on("SIGINT", () => {
	logger.info("Shutting down server...")
	sqlite.close()
	process.exit(0)
})

process.on("SIGTERM", () => {
	logger.info("Shutting down server...")
	sqlite.close()
	process.exit(0)
})

startServer().catch((err) => {
	logger.fatal("Unhandled error", {
		error: err instanceof Error ? err.message : String(err),
		stack: err instanceof Error ? err.stack : undefined,
	})
	process.exit(1)
})
