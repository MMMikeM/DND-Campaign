// conflicts/relations.ts
import { relations } from "drizzle-orm"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
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
		relationName: "regionConflicts",
	}),
	participants: many(conflictParticipants, { relationName: "conflictParticipants" }),
	consequences: many(consequences, { relationName: "consequencesByConflict" }),
	affectedByConsequences: many(consequences, { relationName: "consequencesAffectingConflict" }),
	narrativeDestinations: many(narrativeDestinations, { relationName: "conflictNarrativeDestinations" }),
	foreshadowingSeeds: many(foreshadowing, { relationName: "foreshadowedConflict" }),
	itemRelationships: many(itemRelationships, { relationName: "conflictItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "conflictWorldConceptLinks" }),
}))

export const conflictParticipantsRelations = relations(conflictParticipants, ({ one }) => ({
	conflict: one(conflicts, {
		fields: [conflictParticipants.conflictId],
		references: [conflicts.id],
		relationName: "conflictParticipants",
	}),
	faction: one(factions, {
		fields: [conflictParticipants.factionId],
		references: [factions.id],
		relationName: "factionConflicts",
	}),
	npc: one(npcs, {
		fields: [conflictParticipants.npcId],
		references: [npcs.id],
		relationName: "npcConflicts",
	}),
}))
