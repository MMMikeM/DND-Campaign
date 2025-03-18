import { join } from "node:path"
import { SQLiteDatabase } from "../src/database/index"

// Path to the database
const dbPath = join(process.cwd(), "data.sqlite")

console.log(`Connecting to database at ${dbPath}`)

// First, connect directly to drop all tables
const directDb = new Database(dbPath, { create: true })

// Get all tables
const tables = directDb.query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"').all() as { name: string }[]

console.log(`Found ${tables.length} tables to drop`)

// Drop all tables
tables.forEach(table => {
  console.log(`Dropping table: ${table.name}`)
  directDb.run(`DROP TABLE IF EXISTS ${table.name}`)
})

directDb.close()
console.log("All tables dropped")

// Now reinitialize the database
console.log("Reinitializing database...")
const database = new SQLiteDatabase(dbPath)

console.log("Database reinitialized successfully!")
console.log("Tables created:")

// Use our database class to list the tables
const newTables = database.query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"')
for (const table of newTables) {
  console.log(`- ${table.name}`)
}

database.close()
console.log("Done!") 