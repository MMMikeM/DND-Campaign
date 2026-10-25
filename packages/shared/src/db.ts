import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import { relations } from "./schemas/relations"

export { selectEntityNames } from "./db/entity-names"
export { buildFullTextQuery, type FullTextHit } from "./db/search-query"

/**
 * Initialize the database connection and return operation adapters
 * @param connectionString Connection string for the PostgreSQL database
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(connectionString: string) {
	if (!connectionString) {
		throw new Error("Database connection string is required")
	}

	const client = new pg.Pool({ connectionString })
	// An idle client's error (the server restarting, a dropped connection) is emitted on the
	// pool, and an unhandled 'error' event would crash the process.
	client.on("error", (error) => console.error("Postgres pool: idle client error", error))

	return drizzle({ client, relations, logger: false })
}

export type RunResult = {
	rowCount: number | null
	rows: Record<string, unknown>[]
}
