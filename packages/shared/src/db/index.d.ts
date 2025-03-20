import Database from "better-sqlite3";
/**
 * Initialize the database connection and return operation adapters
 * @param dbPath Path to the SQLite database file
 * @returns Object containing adapters for database operations
 */
export declare function initializeDatabase(dbPath: string): any;
export type DrizzleDb = ReturnType<typeof initializeDatabase>;
export type RunResult = Database.RunResult;
