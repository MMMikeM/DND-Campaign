import { join } from "node:path"
import { SQLiteDatabase } from "../../shared/src/database/index"

// Path to the database
const dbPath = join(process.cwd(), "data.sqlite")

// Initialize the database
console.log(`Connecting to database at ${dbPath}`)
const database = new SQLiteDatabase(dbPath)

// Fetch a faction
const factionId = "crystal_seekers"
console.log(`Fetching faction: ${factionId}`)
const faction = database.factions.getFaction(factionId)

// Log the faction
console.log(JSON.stringify(faction, null, 2))

// Close the database connection
database.close()
console.log("Database connection closed.") 