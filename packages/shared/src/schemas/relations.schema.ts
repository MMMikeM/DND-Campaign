// relations.schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { factions } from "./faction.schema"
import { locations } from "./location.schema"
import { npcs } from "./npc.schema"
import { quests } from "./quest.schema"

// Define the npc location connection table
const npcLocations = sqliteTable("npc_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	locationId: integer("location_id").notNull(),
	context: text("context"),
})

// Define the npc faction connection table
const npcFactions = sqliteTable("npc_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	factionId: integer("faction_id").notNull(),
	role: text("role"),
	status: text("status"),
})

// Define the npc quest connection table
const npcQuests = sqliteTable("npc_quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	questId: integer("quest_id").notNull(),
	role: text("role"),
})

// LOCATIONS - FACTIONS relationships (for faction control/presence)
const locationFactions = sqliteTable("location_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id),
	influence: text("influence"), // Optional influence level
	description: text("description"), // Optional details about faction presence
})

// DISTRICT - NPCs relationships
const districtNpcs = sqliteTable("district_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	districtId: integer("district_id").notNull(),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id),
	role: text("role"),
})

// AREA - NPCs relationships
const areaNpcs = sqliteTable("area_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	areaId: integer("area_id").notNull(),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id),
	activity: text("activity"),
})

// QUESTS - NPCs relationships
const questNpcs = sqliteTable("quest_associated_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id),
	role: text("role"), // Optional role in the quest
	importance: text("importance"),
})

// QUESTS - LOCATIONS relationships
const questLocations = sqliteTable("quest_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id),
	description: text("description"), // Optional description of why this location is part of the quest
	stage: integer("stage"), // Optional stage of the quest this location is relevant for
})

// QUESTS - FACTIONS relationships
const questFaction = sqliteTable("quest_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id),
	role: text("role"), // e.g., "quest giver", "antagonist", "ally"
	interest: text("interest"), // Optional description of faction's interest in the quest
})

export const relations = {
	areaNpcs,
	districtNpcs,
	factionLocations: locationFactions,
	factionNpcs: npcFactions,
	npcActivities: areaNpcs,
	npcAreas: areaNpcs,
	npcDistricts: districtNpcs,
	npcFactions,
	npcLocations,
	npcQuests,
	questFactions: questFaction,
	questLocations,
	questNpcs,
}
