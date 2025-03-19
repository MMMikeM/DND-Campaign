import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod"
import {
	factions,
	factionResources,
	factionLeadership,
	factionMembers,
	factionAllies,
	factionEnemies,
	factionQuests,
	factionNpcs,
	factionLocations,
} from "./faction.schema.js"
import { z } from "zod"

const factionSchemas = {
	select: {
		factions: createSelectSchema(factions),
		factionResources: createSelectSchema(factionResources),
		factionLeadership: createSelectSchema(factionLeadership),
		factionMembers: createSelectSchema(factionMembers),
		factionAllies: createSelectSchema(factionAllies),
		factionEnemies: createSelectSchema(factionEnemies),
		factionQuests: createSelectSchema(factionQuests),
		factionNpcs: createSelectSchema(factionNpcs),
		factionLocations: createSelectSchema(factionLocations),
	},
	insert: {
		factions: createInsertSchema(factions),
		factionResources: createInsertSchema(factionResources),
		factionLeadership: createInsertSchema(factionLeadership),
		factionMembers: createInsertSchema(factionMembers),
		factionAllies: createInsertSchema(factionAllies),
		factionEnemies: createInsertSchema(factionEnemies),
		factionQuests: createInsertSchema(factionQuests),
		factionNpcs: createInsertSchema(factionNpcs),
		factionLocations: createInsertSchema(factionLocations),
	},
	update: {
		factions: createUpdateSchema(factions),
		factionResources: createUpdateSchema(factionResources),
		factionLeadership: createUpdateSchema(factionLeadership),
		factionMembers: createUpdateSchema(factionMembers),
		factionAllies: createUpdateSchema(factionAllies),
		factionEnemies: createUpdateSchema(factionEnemies),
		factionQuests: createUpdateSchema(factionQuests),
		factionNpcs: createUpdateSchema(factionNpcs),
		factionLocations: createUpdateSchema(factionLocations),
	},
}

const { select, insert, update } = factionSchemas

// Define a typed Faction schema using Zod
export const FactionSchema = select.factions
	.extend({
		resources: z.array(select.factionResources.omit({ factionId: true })),
		leadership: z.array(select.factionLeadership.omit({ factionId: true })),
		members: z.array(select.factionMembers.omit({ factionId: true })),
		allies: z.array(select.factionAllies.omit({ factionId: true })),
		enemies: z.array(select.factionEnemies.omit({ factionId: true })),
		quests: z.array(select.factionQuests.omit({ factionId: true })),
		npcs: z.array(select.factionNpcs.omit({ factionId: true })),
		locations: z.array(select.factionLocations.omit({ factionId: true })),
	})
	.strict()

export const newFactionSchema = insert.factions
	.omit({ id: true })
	.extend({
		resources: z.array(insert.factionResources.omit({ id: true, factionId: true })).optional(),
		leadership: z.array(insert.factionLeadership.omit({ id: true, factionId: true })).optional(),
		members: z.array(insert.factionMembers.omit({ id: true, factionId: true })).optional(),
		allies: z.array(insert.factionAllies.omit({ id: true, factionId: true })).optional(),
		enemies: z.array(insert.factionEnemies.omit({ id: true, factionId: true })).optional(),
		quests: z.array(insert.factionQuests.omit({ id: true, factionId: true })).optional(),
		npcs: z.array(insert.factionNpcs.omit({ id: true, factionId: true })).optional(),
		locations: z.array(insert.factionLocations.omit({ id: true, factionId: true })).optional(),
	})
	.strict()

export const updateFactionSchema = update.factions
	.extend({
		resources: z.array(insert.factionResources.omit({ id: true, factionId: true })).optional(),
		leadership: z.array(insert.factionLeadership.omit({ id: true, factionId: true })).optional(),
		members: z.array(insert.factionMembers.omit({ id: true, factionId: true })).optional(),
		allies: z.array(insert.factionAllies.omit({ id: true, factionId: true })).optional(),
		enemies: z.array(insert.factionEnemies.omit({ id: true, factionId: true })).optional(),
		quests: z.array(insert.factionQuests.omit({ id: true, factionId: true })).optional(),
		npcs: z.array(insert.factionNpcs.omit({ id: true, factionId: true })).optional(),
		locations: z.array(insert.factionLocations.omit({ id: true, factionId: true })).optional(),
	})
	.strict()

export const getFactionSchema = z
	.number()
	.refine((id) => id > 0, {
		message: "Faction ID must be greater than 0",
	})
	.describe("Get a faction by ID")

// Define types based on the Zod schemas
export type Faction = z.infer<typeof FactionSchema>
export type NewFaction = z.infer<typeof newFactionSchema>
export type UpdateFaction = z.infer<typeof updateFactionSchema>
