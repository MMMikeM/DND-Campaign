// relations.schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { factions } from "./faction.schema.js"
import { locations } from "./location.schema.js"
import { npcs } from "./npc.schema.js"
import { quests } from "./quest.schema.js"
import { jsonArray } from "../db/utils.js"

// Define the npc location connection table
export const npcLocations = sqliteTable("npc_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "set null" }), // If NPC is deleted, remove their location associations
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "set null" }), // If location is deleted, keep NPC but set location to NULL
	context: jsonArray("context"),
})

// Define the npc faction connection table
export const npcFactions = sqliteTable("npc_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "set null" }), // If NPC is deleted, remove their faction associations
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "set null" }), // If faction is deleted, keep NPC but set faction to NULL
	role: text("role").notNull(),
	status: text("status", { enum: ["leader", "member", "associate", "former"] }).notNull(),
})

// Define the npc quest connection table
export const npcQuests = sqliteTable("npc_quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "set null" }), // If NPC is deleted, remove their quest associations
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "set null" }), // If quest is deleted, keep NPC but set quest to NULL
	role: text("role").notNull(),
	notes: jsonArray("notes"),
})

// LOCATIONS - FACTIONS relationships (for faction control/presence)
export const locationFactions = sqliteTable("location_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "set null" }), // If location is deleted, remove its faction associations
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "set null" }), // If faction is deleted, keep location but set faction to NULL
	influence: text("influence", { enum: ["dominant", "strong", "moderate", "weak", "minimal"] }),
	description: jsonArray("description").notNull(),
})

// AREA - NPCs relationships
export const npcAreas = sqliteTable("area_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "set null" }), // If location is deleted, remove area NPC associations
	areaId: integer("area_id").notNull(),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "set null" }), // If NPC is deleted, keep area but set NPC to NULL
	activity: jsonArray("activity").notNull(),
})

// QUESTS - NPCs relationships
export const questNpcs = sqliteTable("quest_associated_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "set null" }), // If quest is deleted, remove its NPC associations
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "set null" }), // If NPC is deleted, keep quest but set NPC to NULL
	role: text("role").notNull(),
	importance: text("importance", { enum: ["minor", "supporting", "major", "critical"] }),
	notes: jsonArray("notes"),
})

// QUESTS - LOCATIONS relationships
export const questLocations = sqliteTable("quest_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "set null" }), // If quest is deleted, remove its location associations
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "set null" }), // If location is deleted, keep quest but set location to NULL
	description: jsonArray("description").notNull(),
	stage: integer("stage"),
})

// QUESTS - FACTIONS relationships
export const questFactions = sqliteTable("quest_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "set null" }), // If quest is deleted, remove its faction associations
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "set null" }), // If faction is deleted, keep quest but set faction to NULL
	role: text("role").notNull(),
	interest: jsonArray("interest"),
})

export const questClues = sqliteTable("quest_clues", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "set null" }), // If quest is deleted, remove its clues
	description: jsonArray("description").notNull(),
	locationId: integer("location_id").references(() => locations.id, { onDelete: "set null" }), // If location is deleted, keep clue but set location to NULL
	npcId: integer("npc_id").references(() => npcs.id, { onDelete: "set null" }), // If NPC is deleted, keep clue but set NPC to NULL
	discoveryCondition: jsonArray("discovery_condition"),
	pointsTo: jsonArray("points_to").notNull(),
})

export const npcSignificantItems = sqliteTable("npc_significant_items", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }), // Keep cascade as items belong to NPC
	name: text("name").notNull(),
	description: jsonArray("description").notNull(),
	type: text("type").notNull(),
	significance: text("significance").notNull(), // Why this item matters to the plot
	questId: integer("quest_id").references(() => quests.id, { onDelete: "set null" }), // If the quest is deleted, keep the item but remove the quest reference
})
