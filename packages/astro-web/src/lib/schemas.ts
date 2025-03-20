import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { quests, npcs, factions, locations } from "@tome-keeper/shared"
import { z } from "zod"

// Generate base schemas from our Drizzle schema
export const insertQuestSchema = createInsertSchema(quests, {
	type: z.enum(["Combat", "Exploration", "Social", "Investigation", "Mystery", "Other"]),
	difficulty: z.enum(["Easy", "Medium", "Hard", "Very Hard", "Legendary"]),
})

export const selectQuestSchema = createSelectSchema(quests)

// Create a schema for updates that makes all fields optional
export const updateQuestSchema = insertQuestSchema.partial().required({
	title: true,
	description: true,
	type: true,
	difficulty: true,
})

// Type inference helpers
export type InsertQuest = z.infer<typeof insertQuestSchema>
export type SelectQuest = z.infer<typeof selectQuestSchema>
export type UpdateQuest = z.infer<typeof updateQuestSchema>

// ============== NPCs SCHEMAS ==============
export const insertNpcSchema = createInsertSchema(npcs, {
	race: z.string().min(1),
	gender: z.enum(["Male", "Female", "Non-binary", "Other"]),
})

export const selectNpcSchema = createSelectSchema(npcs)

export const updateNpcSchema = insertNpcSchema.partial().required({
	name: true,
	race: true,
	gender: true,
	occupation: true,
	background: true,
	motivation: true,
	secret: true,
	stats: true,
})

// Type inference helpers for NPCs
export type InsertNpc = z.infer<typeof insertNpcSchema>
export type SelectNpc = z.infer<typeof selectNpcSchema>
export type UpdateNpc = z.infer<typeof updateNpcSchema>

// ============== FACTIONS SCHEMAS ==============
export const insertFactionSchema = createInsertSchema(factions, {
	type: z.enum([
		"Political",
		"Religious",
		"Criminal",
		"Military",
		"Mercantile",
		"Academic",
		"Other",
	]),
	alignment: z
		.enum([
			"Lawful Good",
			"Lawful Neutral",
			"Lawful Evil",
			"Neutral Good",
			"True Neutral",
			"Neutral Evil",
			"Chaotic Good",
			"Chaotic Neutral",
			"Chaotic Evil",
		])
		.optional(),
})

export const selectFactionSchema = createSelectSchema(factions)

export const updateFactionSchema = insertFactionSchema.partial().required({
	name: true,
	type: true,
})

// Type inference helpers for factions
export type InsertFaction = z.infer<typeof insertFactionSchema>
export type SelectFaction = z.infer<typeof selectFactionSchema>
export type UpdateFaction = z.infer<typeof updateFactionSchema>

// ============== LOCATIONS SCHEMAS ==============
export const insertLocationSchema = createInsertSchema(locations, {
	type: z.enum(["City", "Town", "Village", "Dungeon", "Wilderness", "Landmark", "Other"]),
	dangerLevel: z.enum(["Safe", "Low", "Medium", "High", "Extreme"]).optional(),
})

export const selectLocationSchema = createSelectSchema(locations)

export const updateLocationSchema = insertLocationSchema.partial().required({
	name: true,
	type: true,
	description: true,
})

// Type inference helpers for locations
export type InsertLocation = z.infer<typeof insertLocationSchema>
export type SelectLocation = z.infer<typeof selectLocationSchema>
export type UpdateLocation = z.infer<typeof updateLocationSchema>
