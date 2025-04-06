import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
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
import * as conflictRelations from "../schemas/conflict/relations"
import * as conflictTables from "../schemas/conflict/tables"
import * as worldRelations from "../schemas/world/relations"
import * as worldTables from "../schemas/world/tables"
import * as foreshadowingRelations from "../schemas/foreshadowing/relations"
import * as foreshadowingTables from "../schemas/foreshadowing/tables"
import * as narrativeRelations from "../schemas/narrative/relations"
import * as narrativeTables from "../schemas/narrative/tables"

export const relations = {
	assocationRelations,
	factionRelations,
	npcRelations,
	questRelations,
	regionRelations,
	conflictRelations,
	worldRelations,
	foreshadowingRelations,
	narrativeRelations,
}

export const tables = {
	assocationTables,
	factionTables,
	npcTables,
	questTables,
	regionTables,
	conflictTables,
	worldTables,
	foreshadowingTables,
	narrativeTables,
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
		...assocationRelations,
		...assocationTables,
		...conflictRelations,
		...conflictTables,
		...factionRelations,
		...factionTables,
		...foreshadowingRelations,
		...foreshadowingTables,
		...narrativeRelations,
		...narrativeTables,
		...npcRelations,
		...npcTables,
		...questRelations,
		...questTables,
		...regionRelations,
		...regionTables,
		...worldRelations,
		...worldTables,
	}

	// Create Drizzle ORM instance with all schemas
	return drizzle(pool, { schema, logger: false })
}

export type DrizzleDb = ReturnType<typeof initializeDatabase>

// Use the proper type from pg
export type RunResult = {
	rowCount: number
	rows: Record<string, unknown>[]
}
