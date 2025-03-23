import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { jsonArray } from "../db/utils.js"
import { relations } from "drizzle-orm"

// Just a few key enums
const races = [
	"human",
	"elf",
	"dwarf",
	"halfling",
	"gnome",
	"half-elf",
	"half-orc",
	"tiefling",
	"dragonborn",
	"other",
] as const
const genders = ["male", "female", "non-humanoid"] as const

// Define the main npcs table
export const npcs = sqliteTable("npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	race: text("race", { enum: races }).notNull(),
	gender: text("gender", { enum: genders }).notNull(),
	occupation: text("occupation").notNull(),
	role: text("role"),
	quirk: text("quirk"),
	background: jsonArray("background").notNull(),
	motivation: jsonArray("motivation").notNull(),
	secrets: jsonArray("secret").notNull(),
	descriptions: jsonArray("descriptions"),
	personalityTraits: jsonArray("personality_traits"),
	items: jsonArray("items"), // Use JSON array for most NPCs' items
	knowledge: jsonArray("knowledge"), // Use JSON array for NPC knowledge
	dialogue: jsonArray("dialogue"), // Use JSON array for NPC dialogue
})

export const npcRelationships = sqliteTable("npc_relationships", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }), // Keep cascade as relationship is directly tied to this NPC
	relatedNpcId: integer("related_npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "set null" }), // If the related NPC is deleted, set this to NULL
	relationshipType: text("relationship_type").notNull(),
	description: jsonArray("description").notNull(),
})
