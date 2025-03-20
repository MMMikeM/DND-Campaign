import { initializeDatabase } from "@tome-keeper/shared"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "../../../../dnddb.sqlite")

// Initialize database connection
export const db = initializeDatabase(dbPath)

// Export type for use in components
export type { DrizzleDb } from "@tome-keeper/shared"
