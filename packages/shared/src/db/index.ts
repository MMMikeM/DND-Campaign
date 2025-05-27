import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import pgvector from "pgvector/pg"
import { relations, tables } from "../schemas"

export { sql } from "drizzle-orm"
export { relations, tables } from "../schemas"

/**
 * Initialize the database connection and return operation adapters
 * @param connectionString Connection string for the PostgreSQL database
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(connectionString: string) {
	if (!connectionString) {
		throw new Error("Database connection string is required")
	}

	const pool = new pg.Pool({
		connectionString,
	})

	pool.on("connect", async (client) => {
		await pgvector.registerTypes(client)
	})

	// Initialize pgvector extension if it doesn't exist
	pool.query("CREATE EXTENSION IF NOT EXISTS vector;").catch((err: Error) => {
		console.warn("Vector extension initialization warning:", err.message)
	})

	const schema = {
		...tables.conflictTables,
		...tables.factionTables,
		...tables.narrativeTables,
		...tables.npcTables,
		...tables.questTables,
		...tables.regionTables,
		...tables.embeddingTables,
		...tables.eventTables,
		...tables.itemTables,
		...tables.worldbuildingTables,
		...relations.conflictRelations,
		...relations.factionRelations,
		...relations.narrativeRelations,
		...relations.npcRelations,
		...relations.questRelations,
		...relations.regionRelations,
		...relations.eventRelations,
		...relations.itemRelations,
		...relations.worldbuildingRelations,
	}

	// Create Drizzle ORM instance with all schemas
	return drizzle(pool, { schema, logger: false })
}

// Use the proper type from pg
export type RunResult = {
	rowCount: number
	rows: Record<string, unknown>[]
}
