// conflict/relations.ts
import { relations } from "drizzle-orm"
import { factions } from "../factions/tables.js"
import { quests } from "../quests/tables.js"
import { regions } from "../regions/tables.js"
import { worldStateChanges } from "../world/tables.js"
import { conflictParticipants, conflictProgression, majorConflicts } from "./tables.js"

export const majorConflictsRelations = relations(majorConflicts, ({ one, many }) => ({
	primaryRegion: one(regions, {
		fields: [majorConflicts.primaryRegionId],
		references: [regions.id],
		relationName: "regionConflicts",
	}),
	participants: many(conflictParticipants, { relationName: "conflictParticipants" }),
	progression: many(conflictProgression, { relationName: "conflictProgression" }),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesByConflict" }),
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
}))

export const conflictProgressionRelations = relations(conflictProgression, ({ one }) => ({
	conflict: one(majorConflicts, {
		fields: [conflictProgression.conflictId],
		references: [majorConflicts.id],
		relationName: "conflictProgression",
	}),
	quest: one(quests, {
		fields: [conflictProgression.questId],
		references: [quests.id],
		relationName: "questConflictImpacts",
	}),
}))
