import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import * as questSchema from "../entities/quests/quest.schema.js"
import * as npcSchema from "../entities/npcs/npc.schema.js"
import * as factionSchema from "../entities/factions/faction.schema.js"
import * as locationSchema from "../entities/locations/location.schema.js"
import * as relationsSchema from "../entities/relations.schema.js"
import {
	createQuestOperations,
	createNPCOperations,
	createFactionOperations,
	createLocationOperations,
} from "../entities/index.js"

// Combined schema
const schema = {
	...questSchema,
	...npcSchema,
	...factionSchema,
	...locationSchema,
	...relationsSchema,
}

/**
 * Initialize the database connection and return operation adapters
 * @param dbPath Path to the SQLite database file
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(dbPath: string) {
	// Create SQLite connection
	const sqlite = new Database(dbPath)

	// Create Drizzle ORM instance with all schemas
	const db = drizzle(sqlite, { schema })

	// Create operations object that implements DatabaseOperations
	const operations = {
		quests: createQuestOperations(db),
		npcs: createNPCOperations(db),
		factions: createFactionOperations(db),
		locations: createLocationOperations(db),
	}

	return {
		db,
		operations,
	}
}

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>

const path = process.env.DB_PATH

if (!path) {
	throw new Error("DB_PATH is not set")
}

export const getDb = () => initializeDatabase(path)
