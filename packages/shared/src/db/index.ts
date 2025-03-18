import { drizzle } from "drizzle-orm/better-sqlite3"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"
import BetterSqlite3 from "better-sqlite3"
import * as path from "node:path"
import * as dotenv from "dotenv"

// Re-export all entity schemas
export * from "../entities/quests/quest.schema.js"
export * from "../entities/npcs/npc.schema.js"
export * from "../entities/factions/faction.schema.js"
export * from "../entities/locations/location.schema.js"

// Define return type interface
export interface DatabaseConnection {
	db: BetterSQLite3Database
	sqlite: BetterSqlite3.Database
	close: () => void
}

// Initialize database connection
export function initializeDatabase(dbPath?: string): DatabaseConnection {
	// Load environment variables if not already loaded
	dotenv.config()

	// Use provided path or fall back to environment variable or default
	const finalDbPath = dbPath || process.env.DB_PATH || path.join(process.cwd(), "data.sqlite")

	// Create database connection
	const sqlite = new BetterSqlite3(finalDbPath)
	const db = drizzle(sqlite)

	return {
		db,
		sqlite,
		close: () => sqlite.close(),
	}
}

// Export database types
export type DrizzleDatabase = DatabaseConnection["db"]

// Re-export drizzle types and utilities that might be needed
export { sql } from "drizzle-orm"
export type { SQL } from "drizzle-orm"
