// conflicts/relations.ts
import { relations } from "drizzle-orm"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { regions } from "../regions/tables"
import { worldConceptLinks } from "../world-concepts/tables"
import { conflictParticipants, conflicts } from "./tables"

export const conflictsRelations = relations(conflicts, ({ one, many }) => ({
	primaryRegion: one(regions, {
		fields: [conflicts.regionId],
		references: [regions.id],
	}),
	participants: many(conflictParticipants),
	consequences: many(consequences),
	affectedByConsequences: many(consequences),
	narrativeDestinations: many(narrativeDestinations),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForConflict" }),
	itemRelations: many(itemRelations),
	worldConceptLinks: many(worldConceptLinks),
}))

export const conflictParticipantsRelations = relations(conflictParticipants, ({ one }) => ({
	conflict: one(conflicts, {
		fields: [conflictParticipants.conflictId],
		references: [conflicts.id],
	}),
	faction: one(factions, {
		fields: [conflictParticipants.factionId],
		references: [factions.id],
	}),
	npc: one(npcs, {
		fields: [conflictParticipants.npcId],
		references: [npcs.id],
	}),
}))
