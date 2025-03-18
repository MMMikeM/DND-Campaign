import { v4 as uuidv4 } from "uuid"
import { DrizzleDb } from "./database.js"
import { DatabaseOperations, MCPOperations } from "../types/operations.js"
import { LocationSchema, NpcSchema, FactionSchema, QuestSchema } from "../entities/index.js"
import { sql } from "drizzle-orm"

/**
 * MCP Server API adapter for D&D campaign management
 * Maps the MCP tool functions to our internal operations
 */
export class McpAdapter {
	private db: DrizzleDb
	private quests: DatabaseOperations["quests"]
	private npcs: DatabaseOperations["npcs"]
	private factions: DatabaseOperations["factions"]
	private locations: DatabaseOperations["locations"]
	private transactions: (callback: () => void) => void

	constructor(db: DrizzleDb, operations: MCPOperations) {
		this.db = db
		this.quests = operations.quests
		this.npcs = operations.npcs
		this.factions = operations.factions
		this.locations = operations.locations

		// Convert the transactions interface to a function that executes a callback in a transaction
		this.transactions = (callback: () => void) => {
			try {
				callback()
				operations.transactions.commit()
			} catch (error) {
				operations.transactions.rollback()
				throw error
			}
		}
	}

	// Quest operations

	mcp_dnd_create_quest(questData: any): string {
		const id = questData.id || uuidv4()
		const data = { ...questData, id }

		// Validate quest data with Zod
		try {
			const validatedData = QuestSchema.parse(data)
			this.quests.create(id, validatedData)
			return id
		} catch (error) {
			console.error("Quest validation error:", error)
			throw new Error(
				`Invalid quest data: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	mcp_dnd_get_quest(id: string): any {
		return this.quests.get(id)
	}

	mcp_dnd_update_quest(id: string, questData: any): void {
		const data = { ...questData, id }

		// Validate quest data with Zod
		try {
			const validatedData = QuestSchema.parse(data)
			this.quests.update(id, validatedData)
		} catch (error) {
			console.error("Quest validation error:", error)
			throw new Error(
				`Invalid quest data: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	mcp_dnd_delete_quest(id: string): void {
		this.quests.delete(id)
	}

	// NPC

	mcp_dnd_create_npc(npcData: any): string {
		const id = npcData.id || uuidv4()
		const data = { ...npcData, id }

		// Validate NPC data with Zod
		try {
			const validatedData = NpcSchema.parse(data)
			this.npcs.create(id, validatedData)
			return id
		} catch (error) {
			console.error("NPC validation error:", error)
			throw new Error(`Invalid NPC data: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	mcp_dnd_get_npc(id: string): any {
		return this.npcs.get(id)
	}

	mcp_dnd_update_npc(id: string, npcData: any): void {
		const data = { ...npcData, id }

		// Validate NPC data with Zod
		try {
			const validatedData = NpcSchema.parse(data)
			this.npcs.update(id, validatedData)
		} catch (error) {
			console.error("NPC validation error:", error)
			throw new Error(`Invalid NPC data: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	mcp_dnd_delete_npc(id: string): void {
		this.npcs.delete(id)
	}

	// Faction

	mcp_dnd_create_faction(factionData: any): string {
		const id = factionData.id || uuidv4()
		const data = { ...factionData, id }

		// Validate faction data with Zod
		try {
			const validatedData = FactionSchema.parse(data)
			this.factions.create(id, validatedData)
			return id
		} catch (error) {
			console.error("Faction validation error:", error)
			throw new Error(
				`Invalid faction data: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	mcp_dnd_get_faction(id: string): any {
		return this.factions.get(id)
	}

	mcp_dnd_update_faction(id: string, factionData: any): void {
		const data = { ...factionData, id }

		// Validate faction data with Zod
		try {
			const validatedData = FactionSchema.parse(data)
			this.factions.update(id, validatedData)
		} catch (error) {
			console.error("Faction validation error:", error)
			throw new Error(
				`Invalid faction data: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	mcp_dnd_delete_faction(id: string): void {
		this.factions.delete(id)
	}

	// Location

	mcp_dnd_create_location(locationData: any): string {
		const id = locationData.id || uuidv4()
		const data = { ...locationData, id }

		// Validate location data with Zod
		try {
			const validatedData = LocationSchema.parse(data)
			this.locations.create(id, validatedData)
			return id
		} catch (error) {
			console.error("Location validation error:", error)
			throw new Error(
				`Invalid location data: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	mcp_dnd_get_location(id: string): any {
		return this.locations.get(id)
	}

	mcp_dnd_update_location(id: string, locationData: any): void {
		const data = { ...locationData, id }

		// Validate location data with Zod
		try {
			const validatedData = LocationSchema.parse(data)
			this.locations.update(id, validatedData)
		} catch (error) {
			console.error("Location validation error:", error)
			throw new Error(
				`Invalid location data: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	mcp_dnd_delete_location(id: string): void {
		this.locations.delete(id)
	}

	// Database schema information methods

	mcp_dnd_list_tables(): string[] {
		// Use Drizzle's sql template tag for raw SQL
		const result = this.db.all(sql`SELECT name FROM sqlite_master WHERE type='table'`) as any[]
		return result.map((row) => String(row.name))
	}

	mcp_dnd_describe_table(tableName: string): Record<string, any> {
		// Use Drizzle's sql template tag for raw SQL
		return this.db.all(sql`PRAGMA table_info(${tableName})`) as any[]
	}

	// Added insights table helper
	mcp_dnd_init_insights_table(): void {
		this.transactions(() => {
			this.db.run(sql`
				CREATE TABLE IF NOT EXISTS insights (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					category TEXT NOT NULL,
					content TEXT NOT NULL,
					timestamp TEXT NOT NULL
				)
			`)
		})
	}

	mcp_dnd_append_insight(category: string, insight: string): void {
		this.transactions(() => {
			this.db.run(sql`
				INSERT INTO insights (category, content, timestamp) 
				VALUES (${category}, ${insight}, ${new Date().toISOString()})
			`)
		})
	}
}
