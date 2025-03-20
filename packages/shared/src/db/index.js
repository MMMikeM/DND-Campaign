// Using a default import with esModuleInterop
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../schemas";
// export const getDbPath = () =>
// 	path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../"), "dnddb.sqlite")
/**
 * Initialize the database connection and return operation adapters
 * @param dbPath Path to the SQLite database file
 * @returns Object containing adapters for database operations
 */
export function initializeDatabase(dbPath) {
    if (!dbPath) {
        throw new Error("DB path is required");
    }
    // Create SQLite connection
    const sqlite = new Database(dbPath);
    // Create Drizzle ORM instance with all schemas
    const db = drizzle(sqlite, { schema });
    return db;
}
//# sourceMappingURL=index.js.map