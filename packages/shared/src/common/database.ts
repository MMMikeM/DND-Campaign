import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { McpAdapter } from "./mcp-adapter.js"
import * as questSchema from "../entities/quests/quest.schema.js"
import * as npcSchema from "../entities/npcs/npc.schema.js"
import * as factionSchema from "../entities/factions/faction.schema.js"
import * as locationSchema from "../entities/locations/location.schema.js"
import { QuestOperations } from "../entities/quests/quest-operations.js"
import { NPCOperations } from "../entities/npcs/npc-operations.js"
import { FactionOperations } from "../entities/factions/faction-operations.js"
import { LocationOperations } from "../entities/locations/location-operations.js"
import { DatabaseOperations, MCPOperations, DatabaseTransaction } from "../types/operations.js"

// Define the return type of our initialization function
interface DatabaseAdapters {
	db: DrizzleDb
	sqlite: Database.Database
	operations: DatabaseOperations
	mcp: McpAdapter
}

/**
 * Initialize the database connection and return operation adapters
 * @param dbPath Path to the SQLite database file
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(dbPath: string): DatabaseAdapters {
	// Create SQLite connection
	const sqlite = new Database(dbPath)

	// Combined schema
	const schema = {
		...questSchema,
		...npcSchema,
		...factionSchema,
		...locationSchema,
	}

	// Create Drizzle ORM instance with all schemas
	const db = drizzle(sqlite, { schema })

	// Create entity operations directly
	const questOperations = new QuestOperations(db)
	const npcOperations = new NPCOperations(db)
	const factionOperations = new FactionOperations(db)
	const locationOperations = new LocationOperations(db)

	// Create operations object that implements DatabaseOperations
	const operations: DatabaseOperations = {
		quests: questOperations,
		npcs: npcOperations,
		factions: factionOperations,
		locations: locationOperations,
	}

	// Create a DatabaseTransaction implementation
	const databaseTransaction: DatabaseTransaction = {
		commit: () => {
			// No-op as we're using Drizzle's transaction
		},
		rollback: () => {
			// No-op as we're using Drizzle's transaction
		},
	}

	// Create the MCPOperations object
	const mcpOperations: MCPOperations = {
		...operations,
		transactions: databaseTransaction,
	}

	// Create the MCP adapter
	const mcp = new McpAdapter(db, mcpOperations)

	return {
		db,
		sqlite,
		operations,
		mcp,
	}
}

export type DrizzleDb = ReturnType<typeof drizzle>

/**
 * Shared database utilities
 */

export interface DatabaseRecord {
	id: string
	createdAt: Date
	updatedAt: Date
}

export function createTimestamps() {
	const now = new Date()
	return {
		createdAt: now,
		updatedAt: now,
	}
}

export function updateTimestamp() {
	return {
		updatedAt: new Date(),
	}
}
