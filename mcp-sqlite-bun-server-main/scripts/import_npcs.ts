#!/usr/bin/env bun
import { Database } from "bun:sqlite"
import { readFileSync } from "fs"
import { parse } from "yaml"

// Initialize database
const db = new Database("data.sqlite", { create: true })

// Drop existing tables
db.run("BEGIN TRANSACTION")
try {
	db.run("DROP TABLE IF EXISTS npc_inventory")
	db.run("DROP TABLE IF EXISTS npc_locations")
	db.run("DROP TABLE IF EXISTS npc_relationships")
	db.run("DROP TABLE IF EXISTS npc_quests")
	db.run("DROP TABLE IF EXISTS npcs")
	db.run("COMMIT")
} catch (error) {
	db.run("ROLLBACK")
	throw error
}

// Create tables
db.run("BEGIN TRANSACTION")
try {
	db.run(`CREATE TABLE npcs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        race TEXT NOT NULL,
        gender TEXT NOT NULL,
        occupation TEXT NOT NULL,
        role TEXT,
        description TEXT NOT NULL,
        quirk TEXT,
        personality TEXT NOT NULL,
        background TEXT NOT NULL,
        motivation TEXT NOT NULL,
        secret TEXT NOT NULL,
        stats TEXT NOT NULL
    )`)

	db.run(`CREATE TABLE npc_quests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        npc_id TEXT NOT NULL,
        quest_id TEXT NOT NULL,
        description TEXT NOT NULL,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
    )`)

	db.run(`CREATE TABLE npc_relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        npc_id TEXT NOT NULL,
        related_id TEXT NOT NULL,
        description TEXT NOT NULL,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
    )`)

	db.run(`CREATE TABLE npc_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        npc_id TEXT NOT NULL,
        location_id TEXT NOT NULL,
        description TEXT NOT NULL,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
    )`)

	db.run(`CREATE TABLE npc_inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        npc_id TEXT NOT NULL,
        item TEXT NOT NULL,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
    )`)

	db.run("COMMIT")
} catch (error) {
	db.run("ROLLBACK")
	throw error
}

// Define types based on the schema
interface NPC {
	id?: string
	name: string
	race: string
	gender: string
	occupation: string
	role?: string
	description: string[]
	quirk?: string
	personality: string[]
	background: string
	motivation: string
	secret: string
	stats: string
	quests?: Array<{
		id: string
		description: string
	}>
	relationships?: Array<{
		id: string
		description: string
	}>
	location?: Array<{
		id: string
		description: string
	}>
	inventory?: string[]
}

interface NPCData {
	title: string
	version: string
	description: string
	npcs: NPC[]
}

// Helper function to generate ID from name
function generateId(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "_")
}

// Read and parse YAML file
const yamlContent = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/npcs/npcs.yaml",
	"utf8",
)
const data = parse(yamlContent) as NPCData

// Begin transaction for data import
db.run("BEGIN TRANSACTION")

try {
	// Insert NPCs
	for (const npc of data.npcs) {
		console.log(`Processing NPC: ${npc.name}`)

		// Generate ID if not provided
		const npcId = npc.id || generateId(npc.name)
		console.log(`Using ID: ${npcId}`)

		// Insert main NPC data
		const npcStmt = db.prepare(`
            INSERT INTO npcs (
                id, name, race, gender, occupation, role,
                description, quirk, personality, background,
                motivation, secret, stats
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

		const npcResult = npcStmt.run(
			npcId,
			npc.name,
			npc.race,
			npc.gender,
			npc.occupation,
			npc.role || null,
			npc.description.join("\n"),
			npc.quirk || null,
			npc.personality.join("\n"),
			npc.background,
			npc.motivation,
			npc.secret,
			npc.stats,
		)

		// Verify NPC was inserted
		const verifyStmt = db.prepare("SELECT id FROM npcs WHERE id = ?")
		const npcCheck = verifyStmt.get(npcId)
		if (!npcCheck) {
			throw new Error(`Failed to insert NPC ${npc.name}`)
		}
		console.log(`Successfully inserted NPC ${npc.name}`)

		// Insert quests
		if (npc.quests) {
			const questStmt = db.prepare(
				"INSERT INTO npc_quests (npc_id, quest_id, description) VALUES (?, ?, ?)",
			)
			for (const quest of npc.quests) {
				questStmt.run(npcId, quest.id, quest.description)
			}
		}

		// Insert relationships
		if (npc.relationships) {
			const relationshipStmt = db.prepare(
				"INSERT INTO npc_relationships (npc_id, related_id, description) VALUES (?, ?, ?)",
			)
			for (const rel of npc.relationships) {
				relationshipStmt.run(npcId, rel.id, rel.description)
			}
		}

		// Insert locations
		if (npc.location) {
			const locationStmt = db.prepare(
				"INSERT INTO npc_locations (npc_id, location_id, description) VALUES (?, ?, ?)",
			)
			for (const loc of npc.location) {
				locationStmt.run(npcId, loc.id, loc.description)
			}
		}

		// Insert inventory
		if (npc.inventory) {
			const inventoryStmt = db.prepare("INSERT INTO npc_inventory (npc_id, item) VALUES (?, ?)")
			for (const item of npc.inventory) {
				inventoryStmt.run(npcId, item)
			}
		}
	}

	// Commit transaction
	db.run("COMMIT")
	console.log("Successfully imported NPC data!")
} catch (error) {
	// Rollback on error
	db.run("ROLLBACK")
	console.error("Error importing NPC data:", error)
	throw error
}
