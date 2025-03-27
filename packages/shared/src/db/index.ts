import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
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
 * @param dbPath Path to the SQLite database file
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(dbPath: string) {
	if (!dbPath) {
		throw new Error("DB path is required")
	}
	// Create SQLite connection
	const sqlite = new Database(dbPath, {
		readonly: false,
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
	return drizzle(sqlite, { schema })
}

export type DrizzleDb = ReturnType<typeof initializeDatabase>

// Use the proper type from better-sqlite3
export type RunResult = Database.RunResult
