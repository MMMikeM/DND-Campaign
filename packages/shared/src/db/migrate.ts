import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { initializeDatabase } from "./index.js"

// Run migrations
async function main() {
	console.log("Running migrations...")
	const db = initializeDatabase("./drizzle.db")

	try {
		await migrate(db, { migrationsFolder: "./drizzle" })
		console.log("Migrations completed successfully!")
	} catch (error) {
		console.error("Migration failed:", error)
		process.exit(1)
	} finally {
		db.$client.close()
		close()
	}
}

main()
