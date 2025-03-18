import {
	initializeDatabase,
	type McpAdapter,
	type DatabaseOperations,
	type DrizzleDb,
} from "@tome-keeper/shared"
import type { Database, RunResult } from "better-sqlite3"
import logger from "./logger.js"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

/**
 * SQLiteDatabase class for the MCP server
 */
export class SQLiteDatabase {
	private db: DrizzleDb
	private sqlite: Database
	private mcpAdapter: McpAdapter
	private operations: DatabaseOperations

	constructor(dbPath: string) {
		logger.info("Initializing SQLite database", { path: dbPath })

		try {
			// Initialize database using the shared package
			const { db, sqlite, mcp, operations } = initializeDatabase(dbPath)
			this.db = db
			this.sqlite = sqlite
			this.mcpAdapter = mcp
			this.operations = operations

			// Push schema to database
			migrate(this.db, { migrateOnStartup: true })

			// Initialize insights table using MCP adapter
			this.mcpAdapter.mcp_dnd_init_insights_table()

			logger.info("SQLite database initialized successfully")
		} catch (error) {
			logger.error("Failed to initialize SQLite database", {
				error: (error as Error).message,
			})
			throw error
		}
	}

	query<T = unknown>(queryString: string, params: unknown[] = []): T[] {
		try {
			const statement = this.sqlite.prepare(queryString)
			return statement.all(...params) as T[]
		} catch (error) {
			logger.error("Error executing query", {
				query: queryString,
				params,
				error: (error as Error).message,
			})
			return []
		}
	}

	run(queryString: string, params: unknown[] = []): RunResult | null {
		try {
			const statement = this.sqlite.prepare(queryString)
			return statement.run(...params)
		} catch (error) {
			logger.error("Error executing statement", {
				query: queryString,
				params,
				error: (error as Error).message,
			})
			return null
		}
	}

	appendInsight(category: string, insight: string): void {
		this.mcpAdapter.mcp_dnd_append_insight(category, insight)
	}

	// Expose operations from DatabaseOperations
	get quests() {
		return this.operations.quests
	}

	get npcs() {
		return this.operations.npcs
	}

	get factions() {
		return this.operations.factions
	}

	get locations() {
		return this.operations.locations
	}

	// MCP interface methods
	mcp_dnd_list_tables() {
		return this.mcpAdapter.mcp_dnd_list_tables()
	}

	mcp_dnd_describe_table(tableName: string) {
		return this.mcpAdapter.mcp_dnd_describe_table(tableName)
	}

	mcp_dnd_append_insight(category: string, insight: string) {
		return this.mcpAdapter.mcp_dnd_append_insight(category, insight)
	}
}
