import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { getDb, initializeDatabase } from "./index.js"

// Run migrations
async function main() {
	console.log("Running migrations...")
	const { db } = getDb()

	try {
		await migrate(db, { migrationsFolder: "./drizzle" })
		console.log("Migrations completed successfully!")
	} catch (error) {
		console.error("Migration failed:", error)
		process.exit(1)
	} finally {
		close()
	}
}

main()
