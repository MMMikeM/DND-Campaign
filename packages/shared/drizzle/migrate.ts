import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import * as path from "path"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Get the database path from environment variables
const dbPath = process.env.DB_PATH || path.join(process.cwd(), "db.sqlite")

// Create a new database connection
const sqlite = new Database(dbPath)
const db = drizzle(sqlite)

// Run migrations
async function main() {
	console.log("Running migrations...")
	await migrate(db, { migrationsFolder: path.join(__dirname, "migrations") })
	console.log("Migrations completed successfully!")
}

main()
	.catch((error) => {
		console.error("Migration failed:", error)
		process.exit(1)
	})
	.finally(() => {
		sqlite.close()
	})
