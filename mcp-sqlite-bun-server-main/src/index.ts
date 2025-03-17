#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
	CallToolRequestSchema,
	GetPromptRequestSchema,
	ListPromptsRequestSchema,
	ListResourcesRequestSchema,
	ListToolsRequestSchema,
	ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { type } from "arktype"
import { join } from "node:path"
import logger from "./logger"
import { createMcpDemoPrompt } from "./prompts"
import { SQLiteDatabase } from "./database/index"
import type { RequiredQuest, RequiredNPC, RequiredFaction, RequiredLocation } from "./database/operations/types"

// Store insights in memory
const insights: string[] = []

// Initialize SQLite database
const dbPath = join(import.meta.dirname, "../data.sqlite")
const database = new SQLiteDatabase(dbPath)

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

// Synthesize memo from insights
const synthesizeMemo = () => {
	if (insights.length === 0) {
		return "No business insights have been discovered yet."
	}

	const insightsList = insights.map((i) => `- ${i}`).join("\n")
	return (
		`📊 Business Intelligence Memo 📊\n\n` +
		`Key Insights Discovered:\n\n${insightsList}\n\n` +
		`Summary:\n` +
		`Analysis has revealed ${insights.length} key business insights that suggest opportunities for strategic optimization and growth.`
	)
}

// Resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
	logger.debug("Handling ListResourcesRequest")
	const response = {
		resources: [
			{
				uri: "memo://insights",
				name: "Business Insights Memo",
				description: "A living document of discovered business insights",
				mimeType: "text/plain",
			},
		],
	}
	logger.debug("ListResources response", {
		resources: response.resources.length,
	})
	return response
})

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
	logger.debug("Handling ReadResourceRequest", { uri: request.params.uri })
	const uri = new URL(request.params.uri)
	if (uri.protocol !== "memo:") {
		logger.error("Invalid protocol", { protocol: uri.protocol })
		throw new Error("Unsupported protocol")
	}
	if (uri.hostname !== "insights") {
		logger.error("Unknown resource", { hostname: uri.hostname })
		throw new Error("Unknown resource")
	}

	const memo = synthesizeMemo()
	logger.debug("Generated memo", {
		length: memo.length,
		insights: insights.length,
	})
	return {
		contents: [
			{
				uri: request.params.uri,
				mimeType: "text/plain",
				text: memo,
			},
		],
	}
})

const mcpDemoPromptRequestSchema = type({
	name: '"mcp-demo"',
	arguments: {
		topic: type("string").describe("Topic to seed the database with initial data"),
	},
}).describe("a demo prompt for SQLite MCP Server")

// Prompt handlers
server.setRequestHandler(ListPromptsRequestSchema, async () => {
	logger.debug("Handling ListPromptsRequest")
	const response = {
		prompts: [
			{
				name: "mcp-demo",
				description: mcpDemoPromptRequestSchema.description,
				arguments: [
					{
						name: "topic",
						description: "Topic to seed the database with initial data",
						required: true,
					},
				],
			},
		],
	}
	logger.debug("ListPrompts response", { prompts: response.prompts.length })
	return response
})

const promptParamsSchema = mcpDemoPromptRequestSchema

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
	logger.debug("Handling GetPromptRequest", { params: request.params })
	const {
		arguments: { topic },
	} = promptParamsSchema.assert(request.params)
	logger.info("Generating prompt for topic", { topic })

	return {
		description: `Demo template for ${topic}`,
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: createMcpDemoPrompt(topic),
				},
			},
		],
	}
})

// ===== SQL Tools =====
const readQueryParamsSchema = type({
	name: '"read-query"',
	arguments: {
		query: type(/^SELECT/i).describe("a SELECT query"),
	},
}).describe("Execute a read-only SQL query")

const writeQueryParamsSchema = type({
	name: '"write-query"',
	arguments: {
		query: type(/^(INSERT|UPDATE|DELETE)/i).describe("an INSERT, UPDATE, or DELETE query"),
	},
}).describe("Execute a write SQL query")

const createTableParamsSchema = type({
	name: '"create-table"',
	arguments: {
		query: type(/^CREATE TABLE/i).describe("a CREATE TABLE statement"),
	},
}).describe("Create a new table in the database")

const listTablesParamsSchema = type({
	name: '"list-tables"',
	arguments: {},
}).describe("List all tables in the database")

const describeTableParamsSchema = type({
	name: '"describe-table"',
	arguments: {
		table_name: "string",
	},
}).describe("Get schema information for a table")

const appendInsightParamsSchema = type({
	name: '"append-insight"',
	arguments: {
		insight: "string",
	},
}).describe("Add a business insight to the memo")

// ===== Quest Tools =====
const createQuestParamsSchema = type({
	name: '"create-quest"',
	arguments: {
		quest: type("object").as<RequiredQuest>(),
	},
}).describe("Create a new quest")

const getQuestParamsSchema = type({
	name: '"get-quest"',
	arguments: {
		id: "string",
	},
}).describe("Get a quest by ID")

const updateQuestParamsSchema = type({
	name: '"update-quest"',
	arguments: {
		quest: type("object").as<RequiredQuest>(),
	},
}).describe("Update an existing quest")

const deleteQuestParamsSchema = type({
	name: '"delete-quest"',
	arguments: {
		id: "string",
	},
}).describe("Delete a quest")

// ===== NPC Tools =====
const createNPCParamsSchema = type({
	name: '"create-npc"',
	arguments: {
		npc: type("object").as<RequiredNPC>(),
	},
}).describe("Create a new NPC")

const getNPCParamsSchema = type({
	name: '"get-npc"',
	arguments: {
		id: "string",
	},
}).describe("Get an NPC by ID")

const updateNPCParamsSchema = type({
	name: '"update-npc"',
	arguments: {
		npc: type("object").as<RequiredNPC>(),
	},
}).describe("Update an existing NPC")

const deleteNPCParamsSchema = type({
	name: '"delete-npc"',
	arguments: {
		id: "string",
	},
}).describe("Delete an NPC")

// ===== Faction Tools =====
const createFactionParamsSchema = type({
	name: '"create-faction"',
	arguments: {
		id: "string",
		faction: type("object").as<RequiredFaction>(),
	},
}).describe("Create a new faction")

const getFactionParamsSchema = type({
	name: '"get-faction"',
	arguments: {
		id: "string",
	},
}).describe("Get a faction by ID")

const updateFactionParamsSchema = type({
	name: '"update-faction"',
	arguments: {
		id: "string",
		faction: type("object").as<RequiredFaction>(),
	},
}).describe("Update an existing faction")

const deleteFactionParamsSchema = type({
	name: '"delete-faction"',
	arguments: {
		id: "string",
	},
}).describe("Delete a faction")

// ===== Location Tools =====
const createLocationParamsSchema = type({
	name: '"create-location"',
	arguments: {
		id: "string",
		location: type("object").as<RequiredLocation>(),
	},
}).describe("Create a new location")

const getLocationParamsSchema = type({
	name: '"get-location"',
	arguments: {
		id: "string",
	},
}).describe("Get a location by ID")

const updateLocationParamsSchema = type({
	name: '"update-location"',
	arguments: {
		id: "string",
		location: type("object").as<RequiredLocation>(),
	},
}).describe("Update an existing location")

const deleteLocationParamsSchema = type({
	name: '"delete-location"',
	arguments: {
		id: "string",
	},
}).describe("Delete a location")

const validParams = readQueryParamsSchema
	.or(writeQueryParamsSchema)
	.or(createTableParamsSchema)
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
		// SQL Tools
		{
			name: "read-query",
			description: readQueryParamsSchema.description,
			inputSchema: readQueryParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "write-query",
			description: writeQueryParamsSchema.description,
			inputSchema: writeQueryParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "create-table",
			description: createTableParamsSchema.description,
			inputSchema: createTableParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "list-tables",
			description: listTablesParamsSchema.description,
			inputSchema: listTablesParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "describe-table",
			description: describeTableParamsSchema.description,
			inputSchema: describeTableParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "append-insight",
			description: appendInsightParamsSchema.description,
			inputSchema: appendInsightParamsSchema.get("arguments").toJsonSchema(),
		},
		// Quest Tools
		{
			name: "create-quest",
			description: createQuestParamsSchema.description,
			inputSchema: createQuestParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "get-quest",
			description: getQuestParamsSchema.description,
			inputSchema: getQuestParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "update-quest",
			description: updateQuestParamsSchema.description,
			inputSchema: updateQuestParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "delete-quest",
			description: deleteQuestParamsSchema.description,
			inputSchema: deleteQuestParamsSchema.get("arguments").toJsonSchema(),
		},
		// NPC Tools
		{
			name: "create-npc",
			description: createNPCParamsSchema.description,
			inputSchema: createNPCParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "get-npc",
			description: getNPCParamsSchema.description,
			inputSchema: getNPCParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "update-npc",
			description: updateNPCParamsSchema.description,
			inputSchema: updateNPCParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "delete-npc",
			description: deleteNPCParamsSchema.description,
			inputSchema: deleteNPCParamsSchema.get("arguments").toJsonSchema(),
		},
		// Faction Tools
		{
			name: "create-faction",
			description: createFactionParamsSchema.description,
			inputSchema: createFactionParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "get-faction",
			description: getFactionParamsSchema.description,
			inputSchema: getFactionParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "update-faction",
			description: updateFactionParamsSchema.description,
			inputSchema: updateFactionParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "delete-faction",
			description: deleteFactionParamsSchema.description,
			inputSchema: deleteFactionParamsSchema.get("arguments").toJsonSchema(),
		},
		// Location Tools
		{
			name: "create-location",
			description: createLocationParamsSchema.description,
			inputSchema: createLocationParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "get-location",
			description: getLocationParamsSchema.description,
			inputSchema: getLocationParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "update-location",
			description: updateLocationParamsSchema.description,
			inputSchema: updateLocationParamsSchema.get("arguments").toJsonSchema(),
		},
		{
			name: "delete-location",
			description: deleteLocationParamsSchema.description,
			inputSchema: deleteLocationParamsSchema.get("arguments").toJsonSchema(),
		},
	],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	logger.debug("Handling CallToolRequest", {
		tool: request.params.name,
		args: request.params.arguments,
	})

	try {
		const { name, arguments: args } = validParams.assert(request.params)

		switch (name) {
			case "read-query": {
				logger.info("Executing read query", { query: args.query })
				const results = database.query(args.query)
				logger.debug("Read query results", { rows: results.length })
				return { content: [{ type: "text", text: JSON.stringify(results) }] }
			}

			case "write-query": {
				logger.info("Executing write query", { query: args.query })
				const result = database.run(args.query)
				logger.debug("Write query results", { affected: result.changes })
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ affected_rows: result.changes }),
						},
					],
				}
			}

			case "create-table": {
				logger.info("Creating table", { query: args.query })
				database.run(args.query)
				logger.debug("Table created successfully")
				return {
					content: [{ type: "text", text: "Table created successfully" }],
				}
			}

			case "list-tables": {
				logger.debug("Listing tables")
				const results = database.query('SELECT name FROM sqlite_master WHERE type="table"')
				logger.debug("Tables found", { count: results.length })
				return { content: [{ type: "text", text: JSON.stringify(results) }] }
			}

			case "describe-table": {
				logger.debug("Describing table", { table: args.table_name })
				const results = database.query(`PRAGMA table_info(${args.table_name})`)
				logger.debug("Table schema", { columns: results.length })
				return { content: [{ type: "text", text: JSON.stringify(results) }] }
			}

			case "append-insight": {
				logger.info("Adding new insight", { insight: args.insight })
				insights.push(args.insight)
				await server.sendResourceUpdated({ uri: "memo://insights" })
				logger.debug("Insight added successfully", { total: insights.length })
				return { content: [{ type: "text", text: "Insight added" }] }
			}

			// Quest operations
			case "create-quest": {
				logger.info("Creating quest", { quest: args.quest })
				try {
					database.quests.createQuest(args.quest)
					logger.debug("Quest created successfully")
					return { content: [{ type: "text", text: "Quest created successfully" }] }
				} catch (error) {
					logger.error("Failed to create quest", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error creating quest: ${(error as Error).message}` }] }
				}
			}

			case "get-quest": {
				logger.debug("Getting quest", { id: args.id })
				try {
					const quest = database.quests.getQuest(args.id)
					logger.debug("Quest retrieved", { found: !!quest })
					return { content: [{ type: "text", text: JSON.stringify(quest) }] }
				} catch (error) {
					logger.error("Failed to get quest", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error getting quest: ${(error as Error).message}` }] }
				}
			}

			case "update-quest": {
				logger.info("Updating quest", { quest: args.quest })
				try {
					database.quests.updateQuest(args.quest)
					logger.debug("Quest updated successfully")
					return { content: [{ type: "text", text: "Quest updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update quest", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error updating quest: ${(error as Error).message}` }] }
				}
			}

			case "delete-quest": {
				logger.info("Deleting quest", { id: args.id })
				try {
					database.quests.deleteQuest(args.id)
					logger.debug("Quest deleted successfully")
					return { content: [{ type: "text", text: "Quest deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete quest", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error deleting quest: ${(error as Error).message}` }] }
				}
			}

			// NPC operations
			case "create-npc": {
				logger.info("Creating NPC", { npc: args.npc })
				try {
					database.npcs.createNPC(args.npc)
					logger.debug("NPC created successfully")
					return { content: [{ type: "text", text: "NPC created successfully" }] }
				} catch (error) {
					logger.error("Failed to create NPC", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error creating NPC: ${(error as Error).message}` }] }
				}
			}

			case "get-npc": {
				logger.debug("Getting NPC", { id: args.id })
				try {
					const npc = database.npcs.getNPC(args.id)
					logger.debug("NPC retrieved", { found: !!npc })
					return { content: [{ type: "text", text: JSON.stringify(npc) }] }
				} catch (error) {
					logger.error("Failed to get NPC", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error getting NPC: ${(error as Error).message}` }] }
				}
			}

			case "update-npc": {
				logger.info("Updating NPC", { npc: args.npc })
				try {
					database.npcs.updateNPC(args.npc)
					logger.debug("NPC updated successfully")
					return { content: [{ type: "text", text: "NPC updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update NPC", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error updating NPC: ${(error as Error).message}` }] }
				}
			}

			case "delete-npc": {
				logger.info("Deleting NPC", { id: args.id })
				try {
					database.npcs.deleteNPC(args.id)
					logger.debug("NPC deleted successfully")
					return { content: [{ type: "text", text: "NPC deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete NPC", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error deleting NPC: ${(error as Error).message}` }] }
				}
			}

			// Faction operations
			case "create-faction": {
				logger.info("Creating faction", { faction: args.faction, id: args.id })
				try {
					database.factions.createFaction(args.id, args.faction)
					logger.debug("Faction created successfully")
					return { content: [{ type: "text", text: "Faction created successfully" }] }
				} catch (error) {
					logger.error("Failed to create faction", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error creating faction: ${(error as Error).message}` }] }
				}
			}

			case "get-faction": {
				logger.debug("Getting faction", { id: args.id })
				try {
					const faction = database.factions.getFaction(args.id)
					logger.debug("Faction retrieved", { found: !!faction })
					return { content: [{ type: "text", text: JSON.stringify(faction) }] }
				} catch (error) {
					logger.error("Failed to get faction", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error getting faction: ${(error as Error).message}` }] }
				}
			}

			case "update-faction": {
				logger.info("Updating faction", { faction: args.faction, id: args.id })
				try {
					database.factions.updateFaction(args.id, args.faction)
					logger.debug("Faction updated successfully")
					return { content: [{ type: "text", text: "Faction updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update faction", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error updating faction: ${(error as Error).message}` }] }
				}
			}

			case "delete-faction": {
				logger.info("Deleting faction", { id: args.id })
				try {
					database.factions.deleteFaction(args.id)
					logger.debug("Faction deleted successfully")
					return { content: [{ type: "text", text: "Faction deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete faction", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error deleting faction: ${(error as Error).message}` }] }
				}
			}

			// Location operations
			case "create-location": {
				logger.info("Creating location", { location: args.location, id: args.id })
				try {
					database.locations.createLocation(args.id, args.location)
					logger.debug("Location created successfully")
					return { content: [{ type: "text", text: "Location created successfully" }] }
				} catch (error) {
					logger.error("Failed to create location", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error creating location: ${(error as Error).message}` }] }
				}
			}

			case "get-location": {
				logger.debug("Getting location", { id: args.id })
				try {
					const location = database.locations.getLocation(args.id)
					logger.debug("Location retrieved", { found: !!location })
					return { content: [{ type: "text", text: JSON.stringify(location) }] }
				} catch (error) {
					logger.error("Failed to get location", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error getting location: ${(error as Error).message}` }] }
				}
			}

			case "update-location": {
				logger.info("Updating location", { location: args.location, id: args.id })
				try {
					database.locations.updateLocation(args.id, args.location)
					logger.debug("Location updated successfully")
					return { content: [{ type: "text", text: "Location updated successfully" }] }
				} catch (error) {
					logger.error("Failed to update location", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error updating location: ${(error as Error).message}` }] }
				}
			}

			case "delete-location": {
				logger.info("Deleting location", { id: args.id })
				try {
					database.locations.deleteLocation(args.id)
					logger.debug("Location deleted successfully")
					return { content: [{ type: "text", text: "Location deleted successfully" }] }
				} catch (error) {
					logger.error("Failed to delete location", { error: (error as Error).message })
					return { content: [{ type: "text", text: `Error deleting location: ${(error as Error).message}` }] }
				}
			}
		}
	} catch (err) {
		if (err instanceof Error) {
			logger.error("Tool execution error", {
				error: err.message,
				stack: err.stack,
			})
		} else if (err instanceof type.errors) {
			logger.error("Validation error", {
				summary: err.summary,
				details: err.issues,
			})
		}
		throw err
	}
})

async function startServer() {
	logger.info("Initializing server...")
	const transport = new StdioServerTransport()

	try {
		logger.info("Connecting to transport...")
		await server.connect(transport)
		logger.info("Server started successfully")
	} catch (err) {
		logger.fatal("Failed to start server", {
			error: err instanceof Error ? err.message : String(err),
			stack: err instanceof Error ? err.stack : undefined,
		})
		process.exit(1)
	}
}

startServer().catch(console.error)
