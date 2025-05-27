// conflict/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { factions } from "../factions/tables"
import { foreshadowingSeeds } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { regions } from "../regions/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
import { conflictParticipants, majorConflicts } from "./tables"

export const majorConflictsRelations = relations(majorConflicts, ({ one, many }) => ({
	primaryRegion: one(regions, {
		fields: [majorConflicts.primaryRegionId],
		references: [regions.id],
		relationName: "regionConflicts",
	}),
	participants: many(conflictParticipants, { relationName: "conflictParticipants" }),
	consequences: many(consequences, { relationName: "consequencesByConflict" }),
	affectedByConsequences: many(consequences, { relationName: "consequencesAffectingConflict" }),
	narrativeDestinations: many(narrativeDestinations, { relationName: "conflictNarrativeDestinations" }),
	foreshadowingSeeds: many(foreshadowingSeeds, { relationName: "foreshadowedConflict" }),
	itemRelationships: many(itemRelationships, { relationName: "conflictItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "conflictWorldConceptLinks" }),

	embedding: one(embeddings, {
		fields: [majorConflicts.embeddingId],
		references: [embeddings.id],
	}),
}))

export const conflictParticipantsRelations = relations(conflictParticipants, ({ one }) => ({
	conflict: one(majorConflicts, {
		fields: [conflictParticipants.conflictId],
		references: [majorConflicts.id],
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
