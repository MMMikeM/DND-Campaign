import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod"
import {
	npcs,
	npcDescriptions,
	npcPersonalityTraits,
	npcRelationships,
	npcInventory,
	npcDialogue,
} from "./npc.schema.js"
import { z } from "zod"
import {
	areaNpcSchema,
	districtNpcSchema,
	insertAreaNpcSchema,
	insertDistrictNpcSchema,
} from "../relations.zod"
import { npcLocations, npcFactions, npcQuests } from "../relations.schema.js"

const schemas = {
	select: {
		npcs: createSelectSchema(npcs),
		npcDescriptions: createSelectSchema(npcDescriptions),
		npcPersonalityTraits: createSelectSchema(npcPersonalityTraits),
		npcRelationships: createSelectSchema(npcRelationships),
		npcInventory: createSelectSchema(npcInventory),
		npcLocations: createSelectSchema(npcLocations),
		npcFactions: createSelectSchema(npcFactions),
		npcQuests: createSelectSchema(npcQuests),
		npcDialogue: createSelectSchema(npcDialogue),
	},
	insert: {
		npcs: createInsertSchema(npcs),
		npcDescriptions: createInsertSchema(npcDescriptions),
		npcPersonalityTraits: createInsertSchema(npcPersonalityTraits),
		npcRelationships: createInsertSchema(npcRelationships),
		npcInventory: createInsertSchema(npcInventory),
		npcLocations: createInsertSchema(npcLocations),
		npcFactions: createInsertSchema(npcFactions),
		npcQuests: createInsertSchema(npcQuests),
		npcDialogue: createInsertSchema(npcDialogue),
	},
	update: {
		npcs: createUpdateSchema(npcs),
		npcDescriptions: createUpdateSchema(npcDescriptions),
		npcPersonalityTraits: createUpdateSchema(npcPersonalityTraits),
		npcRelationships: createUpdateSchema(npcRelationships),
		npcInventory: createUpdateSchema(npcInventory),
		npcLocations: createUpdateSchema(npcLocations),
		npcFactions: createUpdateSchema(npcFactions),
		npcQuests: createUpdateSchema(npcQuests),
		npcDialogue: createUpdateSchema(npcDialogue),
	},
}

const { select, insert, update } = schemas

// Define a typed NPC schema using Zod
export const NpcSchema = select.npcs
	.extend({
		descriptions: z.array(select.npcDescriptions.omit({ npcId: true })),
		personalityTraits: z.array(select.npcPersonalityTraits.omit({ npcId: true })),
		relationships: z.array(select.npcRelationships.omit({ npcId: true })),
		inventory: z.array(select.npcInventory.omit({ npcId: true })),
		locations: z.array(select.npcLocations.omit({ npcId: true })),
		factions: z.array(select.npcFactions.omit({ npcId: true })),
		quests: z.array(select.npcQuests.omit({ npcId: true })),
		dialogue: z.array(select.npcDialogue.omit({ npcId: true })),
		// Include the area and district relations from imported schemas
		areas: z.array(areaNpcSchema.omit({ npcId: true })),
		districts: z.array(districtNpcSchema.omit({ npcId: true })),
	})
	.strict()

export const newNpcSchema = insert.npcs
	.omit({ id: true })
	.extend({
		descriptions: z.array(insert.npcDescriptions.omit({ id: true, npcId: true })).optional(),
		personalityTraits: z
			.array(insert.npcPersonalityTraits.omit({ id: true, npcId: true }))
			.optional(),
		relationships: z.array(insert.npcRelationships.omit({ id: true, npcId: true })).optional(),
		inventory: z.array(insert.npcInventory.omit({ id: true, npcId: true })).optional(),
		locations: z.array(insert.npcLocations.omit({ id: true, npcId: true })).optional(),
		factions: z.array(insert.npcFactions.omit({ id: true, npcId: true })).optional(),
		quests: z.array(insert.npcQuests.omit({ id: true, npcId: true })).optional(),
		dialogue: z.array(insert.npcDialogue.omit({ id: true, npcId: true })).optional(),
		// Include the area and district relations
		areas: z.array(insertAreaNpcSchema.omit({ npcId: true })).optional(),
		districts: z.array(insertDistrictNpcSchema.omit({ npcId: true })).optional(),
	})
	.strict()

export const updateNpcSchema = update.npcs
	.extend({
		descriptions: z.array(insert.npcDescriptions.omit({ id: true, npcId: true })).optional(),
		personalityTraits: z
			.array(insert.npcPersonalityTraits.omit({ id: true, npcId: true }))
			.optional(),
		relationships: z.array(insert.npcRelationships.omit({ id: true, npcId: true })).optional(),
		inventory: z.array(insert.npcInventory.omit({ id: true, npcId: true })).optional(),
		locations: z.array(insert.npcLocations.omit({ id: true, npcId: true })).optional(),
		factions: z.array(insert.npcFactions.omit({ id: true, npcId: true })).optional(),
		quests: z.array(insert.npcQuests.omit({ id: true, npcId: true })).optional(),
		dialogue: z.array(insert.npcDialogue.omit({ id: true, npcId: true })).optional(),
		// Include the area and district relations
		areas: z.array(insertAreaNpcSchema.omit({ npcId: true })).optional(),
		districts: z.array(insertDistrictNpcSchema.omit({ npcId: true })).optional(),
	})
	.strict()

export const getNpcSchema = z
	.number()
	.refine((id) => id > 0, {
		message: "NPC ID must be greater than 0",
	})
	.describe("Get an NPC by ID")

// Define types based on the Zod schemas
export type Npc = z.infer<typeof NpcSchema>
export type NewNpc = z.infer<typeof newNpcSchema>
export type UpdateNpc = z.infer<typeof updateNpcSchema>
