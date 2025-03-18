import type { RunResult } from "better-sqlite3";
/**
 * SQLiteDatabase class for the MCP server
 */
export declare class SQLiteDatabase {
    private db;
    private sqlite;
    private mcpAdapter;
    private operations;
    constructor(dbPath: string);
    query<T = unknown>(queryString: string, params?: unknown[]): T[];
    run(queryString: string, params?: unknown[]): RunResult | null;
    appendInsight(category: string, insight: string): void;
    get quests(): import("@tome-keeper/shared").BaseQuestOperations;
    get npcs(): import("@tome-keeper/shared").BaseNPCOperations;
    get factions(): import("@tome-keeper/shared").BaseFactionOperations;
    get locations(): import("@tome-keeper/shared").BaseLocationOperations;
    mcp_dnd_list_tables(): string[];
    mcp_dnd_describe_table(tableName: string): Record<string, any>;
    mcp_dnd_append_insight(category: string, insight: string): void;
}
