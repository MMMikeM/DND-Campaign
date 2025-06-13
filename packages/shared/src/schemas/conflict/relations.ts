// conflict/relations.ts
import { relations } from "drizzle-orm"
import { consequences } from "../events/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { regions } from "../regions/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
import { conflictParticipants, conflicts } from "./tables"

export const majorConflictsRelations = relations(conflicts, ({ one, many }) => ({
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
