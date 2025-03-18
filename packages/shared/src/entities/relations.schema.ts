// relations.schema.ts
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { factions } from "./factions/faction.schema.js"
import { locations } from "./locations/location.schema.js"
import { npcs } from "./npcs/npc.schema.js"
import { quests } from "./quests/quest.schema.js"

// NPCs - FACTIONS relationships
export const npcFactions = sqliteTable(
	"npc_factions",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id),
		role: text("role").notNull(),
		standing: text("standing"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.npcId, table.factionId] }),
	}),
)

// NPCs - LOCATIONS relationships
export const npcLocations = sqliteTable(
	"npc_locations",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id),
		description: text("description").notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.npcId, table.locationId] }),
	}),
)

// LOCATIONS - NPCs relationships (for NPCs found specifically in a location)
export const locationNpcs = sqliteTable(
	"location_npcs",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.locationId, table.npcId] }),
	}),
)

// LOCATIONS - FACTIONS relationships (for faction control/presence)
export const locationFactions = sqliteTable(
	"location_factions",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id),
		influence: text("influence"), // Optional influence level
		description: text("description"), // Optional details about faction presence
	},
	(table) => ({
		pk: primaryKey({ columns: [table.locationId, table.factionId] }),
	}),
)

// DISTRICT - NPCs relationships
export const districtNpcs = sqliteTable(
	"district_npcs",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		districtId: integer("district_id").notNull(),
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.locationId, table.districtId, table.npcId] }),
	}),
)

// AREA - NPCs relationships
export const areaNpcs = sqliteTable(
	"area_npcs",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaId: integer("area_id").notNull(),
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.locationId, table.areaId, table.npcId] }),
	}),
)

// QUESTS - NPCs relationships
export const questNpcs = sqliteTable(
	"quest_associated_npcs",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id),
		role: text("role"), // Optional role in the quest
	},
	(table) => ({
		pk: primaryKey({ columns: [table.questId, table.npcId] }),
	}),
)

// QUESTS - LOCATIONS relationships
export const questLocations = sqliteTable(
	"quest_locations",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id),
		description: text("description"), // Optional description of why this location is part of the quest
	},
	(table) => ({
		pk: primaryKey({ columns: [table.questId, table.locationId] }),
	}),
)

// QUESTS - FACTIONS relationships
export const questFactions = sqliteTable(
	"quest_factions",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id),
		role: text("role"), // e.g., "quest giver", "antagonist", "ally"
	},
	(table) => ({
		pk: primaryKey({ columns: [table.questId, table.factionId] }),
	}),
)

// Schema definitions
export const npcFactionSchema = createSelectSchema(npcFactions)
export const insertNpcFactionSchema = createInsertSchema(npcFactions)
export const npcLocationSchema = createSelectSchema(npcLocations)
export const insertNpcLocationSchema = createInsertSchema(npcLocations)
export const locationNpcSchema = createSelectSchema(locationNpcs)
export const insertLocationNpcSchema = createInsertSchema(locationNpcs)
export const locationFactionSchema = createSelectSchema(locationFactions)
export const insertLocationFactionSchema = createInsertSchema(locationFactions)
export const districtNpcSchema = createSelectSchema(districtNpcs)
export const insertDistrictNpcSchema = createInsertSchema(districtNpcs)
export const areaNpcSchema = createSelectSchema(areaNpcs)
export const insertAreaNpcSchema = createInsertSchema(areaNpcs)
export const questNpcSchema = createSelectSchema(questNpcs)
export const insertQuestNpcSchema = createInsertSchema(questNpcs)
export const questLocationSchema = createSelectSchema(questLocations)
export const insertQuestLocationSchema = createInsertSchema(questLocations)
export const questFactionSchema = createSelectSchema(questFactions)
export const insertQuestFactionSchema = createInsertSchema(questFactions)

// Types
export type NpcFaction = z.infer<typeof npcFactionSchema>
export type NewNpcFaction = z.infer<typeof insertNpcFactionSchema>
export type NpcLocation = z.infer<typeof npcLocationSchema>
export type NewNpcLocation = z.infer<typeof insertNpcLocationSchema>
export type LocationNpc = z.infer<typeof locationNpcSchema>
export type NewLocationNpc = z.infer<typeof insertLocationNpcSchema>
export type LocationFaction = z.infer<typeof locationFactionSchema>
export type NewLocationFaction = z.infer<typeof insertLocationFactionSchema>
export type DistrictNpc = z.infer<typeof districtNpcSchema>
export type NewDistrictNpc = z.infer<typeof insertDistrictNpcSchema>
export type AreaNpc = z.infer<typeof areaNpcSchema>
export type NewAreaNpc = z.infer<typeof insertAreaNpcSchema>
export type QuestNpc = z.infer<typeof questNpcSchema>
export type NewQuestNpc = z.infer<typeof insertQuestNpcSchema>
export type QuestLocation = z.infer<typeof questLocationSchema>
export type NewQuestLocation = z.infer<typeof insertQuestLocationSchema>
export type QuestFaction = z.infer<typeof questFactionSchema>
export type NewQuestFaction = z.infer<typeof insertQuestFactionSchema>
