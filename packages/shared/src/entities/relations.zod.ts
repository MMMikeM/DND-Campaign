import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod"
import type { z } from "zod"
import {
	areaNpcs,
	districtNpcs,
	locationFactions,
	locationNpcs,
	npcFactions,
	npcLocations,
	questFactions,
	questLocations,
	questNpcs,
} from "./relations.schema"

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
