import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import pgvector from "pgvector/pg"
import * as assocationRelations from "../schemas/associations/relations"
import * as assocationTables from "../schemas/associations/tables"
import * as factionRelations from "../schemas/factions/relations"
import * as factionTables from "../schemas/factions/tables"
import * as npcRelations from "../schemas/npc/relations"
import * as npcTables from "../schemas/npc/tables"
import * as questRelations from "../schemas/quests/relations"
import * as questTables from "../schemas/quests/tables"
import * as regionRelations from "../schemas/regions/relations"
import * as regionTables from "../schemas/regions/tables"

export const relations = {
	assocationRelations,
	factionRelations,
	npcRelations,
	questRelations,
	regionRelations,
}

export const tables = {
	assocationTables,
	factionTables,
	npcTables,
	questTables,
	regionTables,
}

// export const getDbPath = () =>
// 	path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../"), "dnddb.sqlite")

/**
 * Initialize the database connection and return operation adapters
 * @param connectionString Connection string for the PostgreSQL database
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(connectionString: string) {
	if (!connectionString) {
		throw new Error("Database connection string is required")
	}

	// Create PostgreSQL connection pool
	const pool = new Pool({ connectionString })

	pool.on("connect", async (client) => {
		await pgvector.registerTypes(client)
	})

	// Initialize pgvector extension if it doesn't exist
	pool.query("CREATE EXTENSION IF NOT EXISTS vector;").catch((err: Error) => {
		console.warn("Vector extension initialization warning:", err.message)
	})

	const schema = {
		...assocationRelations,
		...factionRelations,
		...npcRelations,
		...questRelations,
		...regionRelations,
		...assocationTables,
		...factionTables,
		...npcTables,
		...questTables,
		...regionTables,
	}

	// Create Drizzle ORM instance with all schemas
	return drizzle(pool, { schema })
}

export type DrizzleDb = ReturnType<typeof initializeDatabase>

// Use the proper type from pg
export type RunResult = {
	rowCount: number
	rows: Record<string, unknown>[]
}
