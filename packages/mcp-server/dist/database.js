import { initializeDatabase, } from "@tome-keeper/shared";
import logger from "./logger.js";
/**
 * SQLiteDatabase class for the MCP server
 */
export class SQLiteDatabase {
    constructor(dbPath) {
        logger.info("Initializing SQLite database", { path: dbPath });
        try {
            // Initialize database using the shared package
            const { db, sqlite, mcp, operations } = initializeDatabase(dbPath);
            this.db = db;
            this.sqlite = sqlite;
            this.mcpAdapter = mcp;
            this.operations = operations;
            // Initialize insights table using MCP adapter
            this.mcpAdapter.mcp_dnd_init_insights_table();
            logger.info("SQLite database initialized successfully");
        }
        catch (error) {
            logger.error("Failed to initialize SQLite database", {
                error: error.message,
            });
            throw error;
        }
    }
    query(queryString, params = []) {
        try {
            const statement = this.sqlite.prepare(queryString);
            return statement.all(...params);
        }
        catch (error) {
            logger.error("Error executing query", {
                query: queryString,
                params,
                error: error.message,
            });
            return [];
        }
    }
    run(queryString, params = []) {
        try {
            const statement = this.sqlite.prepare(queryString);
            return statement.run(...params);
        }
        catch (error) {
            logger.error("Error executing statement", {
                query: queryString,
                params,
                error: error.message,
            });
            return null;
        }
    }
    appendInsight(category, insight) {
        this.mcpAdapter.mcp_dnd_append_insight(category, insight);
    }
    // Expose operations from DatabaseOperations
    get quests() {
        return this.operations.quests;
    }
    get npcs() {
        return this.operations.npcs;
    }
    get factions() {
        return this.operations.factions;
    }
    get locations() {
        return this.operations.locations;
    }
    // MCP interface methods
    mcp_dnd_list_tables() {
        return this.mcpAdapter.mcp_dnd_list_tables();
    }
    mcp_dnd_describe_table(tableName) {
        return this.mcpAdapter.mcp_dnd_describe_table(tableName);
    }
    mcp_dnd_append_insight(category, insight) {
        return this.mcpAdapter.mcp_dnd_append_insight(category, insight);
    }
}
//# sourceMappingURL=database.js.map