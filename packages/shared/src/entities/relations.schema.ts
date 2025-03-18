// relations.schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import type { z } from "zod"
import { factions } from "./factions/faction.schema.js"
import { locations } from "./locations/location.schema.js"
import { npcs } from "./npcs/npc.schema.js"
import { quests } from "./quests/quest.schema.js"

// NPCs - FACTIONS relationships
export const npcFactions = sqliteTable("npc_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id),
	role: text("role").notNull(),
	standing: text("standing"),
})

// NPCs - LOCATIONS relationships
export const npcLocations = sqliteTable("npc_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id),
	description: text("description").notNull(),
})

// LOCATIONS - NPCs relationships (for NPCs found specifically in a location)
export const locationNpcs = sqliteTable("location_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id),
	role: text("role"),
	schedule: text("schedule"),
})

// LOCATIONS - FACTIONS relationships (for faction control/presence)
export const locationFactions = sqliteTable("location_factions", {
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
export const districtNpcs = sqliteTable("district_npcs", {
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
export const areaNpcs = sqliteTable("area_npcs", {
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
export const questNpcs = sqliteTable("quest_associated_npcs", {
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
export const questLocations = sqliteTable("quest_locations", {
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
export const questFactions = sqliteTable("quest_factions", {
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

// Schema definitions - Select schemas
export const areaNpcSchema = createSelectSchema(areaNpcs)
export const districtNpcSchema = createSelectSchema(districtNpcs)
export const locationFactionSchema = createSelectSchema(locationFactions)
export const locationNpcSchema = createSelectSchema(locationNpcs)
export const npcFactionSchema = createSelectSchema(npcFactions)
export const npcLocationSchema = createSelectSchema(npcLocations)
export const questFactionSchema = createSelectSchema(questFactions)
export const questLocationSchema = createSelectSchema(questLocations)
export const questNpcSchema = createSelectSchema(questNpcs)

// Schema definitions - Insert schemas
export const insertNpcFactionSchema = createInsertSchema(npcFactions)
export const insertNpcLocationSchema = createInsertSchema(npcLocations)
export const insertLocationNpcSchema = createInsertSchema(locationNpcs)
export const insertLocationFactionSchema = createInsertSchema(locationFactions)
export const insertDistrictNpcSchema = createInsertSchema(districtNpcs)
export const insertAreaNpcSchema = createInsertSchema(areaNpcs)
export const insertQuestNpcSchema = createInsertSchema(questNpcs)
export const insertQuestLocationSchema = createInsertSchema(questLocations)
export const insertQuestFactionSchema = createInsertSchema(questFactions)

// Schema definitions - Update schemas
export const updateNpcFactionSchema = createUpdateSchema(npcFactions)
export const updateNpcLocationSchema = createUpdateSchema(npcLocations)
export const updateLocationNpcSchema = createUpdateSchema(locationNpcs)
export const updateLocationFactionSchema = createUpdateSchema(locationFactions)
export const updateDistrictNpcSchema = createUpdateSchema(districtNpcs)
export const updateAreaNpcSchema = createUpdateSchema(areaNpcs)
export const updateQuestNpcSchema = createUpdateSchema(questNpcs)
export const updateQuestLocationSchema = createUpdateSchema(questLocations)
export const updateQuestFactionSchema = createUpdateSchema(questFactions)

// Define types based on the Zod schemas - Select types
export type NpcFaction = z.infer<typeof npcFactionSchema>
export type NpcLocation = z.infer<typeof npcLocationSchema>
export type LocationNpc = z.infer<typeof locationNpcSchema>
export type LocationFaction = z.infer<typeof locationFactionSchema>
export type DistrictNpc = z.infer<typeof districtNpcSchema>
export type AreaNpc = z.infer<typeof areaNpcSchema>
export type QuestNpc = z.infer<typeof questNpcSchema>
export type QuestLocation = z.infer<typeof questLocationSchema>
export type QuestFaction = z.infer<typeof questFactionSchema>

// Define types based on the Zod schemas - Insert types
export type NewNpcFaction = z.infer<typeof insertNpcFactionSchema>
export type NewNpcLocation = z.infer<typeof insertNpcLocationSchema>
export type NewLocationNpc = z.infer<typeof insertLocationNpcSchema>
export type NewLocationFaction = z.infer<typeof insertLocationFactionSchema>
export type NewDistrictNpc = z.infer<typeof insertDistrictNpcSchema>
export type NewAreaNpc = z.infer<typeof insertAreaNpcSchema>
export type NewQuestNpc = z.infer<typeof insertQuestNpcSchema>
export type NewQuestLocation = z.infer<typeof insertQuestLocationSchema>
export type NewQuestFaction = z.infer<typeof insertQuestFactionSchema>

// Define types based on the Zod schemas - Update types
export type UpdateNpcFaction = z.infer<typeof updateNpcFactionSchema>
export type UpdateNpcLocation = z.infer<typeof updateNpcLocationSchema>
export type UpdateLocationNpc = z.infer<typeof updateLocationNpcSchema>
export type UpdateLocationFaction = z.infer<typeof updateLocationFactionSchema>
export type UpdateDistrictNpc = z.infer<typeof updateDistrictNpcSchema>
export type UpdateAreaNpc = z.infer<typeof updateAreaNpcSchema>
export type UpdateQuestNpc = z.infer<typeof updateQuestNpcSchema>
export type UpdateQuestLocation = z.infer<typeof updateQuestLocationSchema>
export type UpdateQuestFaction = z.infer<typeof updateQuestFactionSchema>
