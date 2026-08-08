import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import pgvector from "pgvector/pg"
import { relations } from "../schemas/relations"

/**
 * Initialize the database connection and return operation adapters
 * @param connectionString Connection string for the PostgreSQL database
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(connectionString: string) {
	if (!connectionString) {
		throw new Error("Database connection string is required")
	}

	const client = new pg.Pool({
		connectionString,
	})

	client.on("connect", async (client) => {
		await pgvector.registerTypes(client)
	})

	// Initialize pgvector extension if it doesn't exist
	client.query("CREATE EXTENSION IF NOT EXISTS vector;").catch((err: Error) => {
		console.warn("Vector extension initialization warning:", err.message)
	})

	return drizzle({ client, relations, logger: false })
}

// Use the proper type from pg
export type RunResult = {
	rowCount: number
	rows: Record<string, unknown>[]
}
