// conflicts/relations.ts
import { relations } from "drizzle-orm"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { regions } from "../regions/tables"
import { conflictParticipants, conflicts } from "./tables"

export const conflictsRelations = relations(conflicts, ({ one, many }) => ({
	region: one(regions, {
		fields: [conflicts.regionId],
		references: [regions.id],
	}),
	participants: many(conflictParticipants),
	triggeredConsequences: many(consequences, { relationName: "ConsequenceTriggerConflict" }),
	affectingConsequences: many(consequences, { relationName: "ConsequenceAffectedConflict" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetConflict" }),
	itemConnections: many(itemConnections),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetConflict" }),
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
