import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { questHooks, questParticipants } from "../quests/tables"
import { npcStageInvolvement, questStages } from "../stages/tables"
import { npcDetails, npcFactionMemberships, npcRelations, npcs } from "./tables"

export const npcsRelations = relations(npcs, ({ one, many }) => ({
	outgoingRelations: many(npcRelations, { relationName: "sourceNpc" }),
	incomingRelations: many(npcRelations, { relationName: "targetNpc" }),

	factionMemberships: one(npcFactionMemberships, {
		fields: [npcs.id],
		references: [npcFactionMemberships.npcId],
	}),

	conflictParticipation: many(conflictParticipants),
	affectingConsequences: many(consequences, { relationName: "ConsequenceAffectedNpc" }),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceNpc" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetNpc" }),
	itemRelations: many(itemConnections),
	questHooks: many(questHooks),
	questStageDeliveries: many(questStages),
	questParticipants: many(questParticipants),
	stageInvolvement: many(npcStageInvolvement),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetNpc" }),

	details: one(npcDetails, {
		fields: [npcs.id],
		references: [npcDetails.npcId],
	}),
}))

export const npcDetailsRelations = relations(npcDetails, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcDetails.npcId],
		references: [npcs.id],
	}),
}))

export const npcRelationshipsRelations = relations(npcRelations, ({ one }) => ({
	sourceNpc: one(npcs, {
		fields: [npcRelations.sourceNpcId],
		references: [npcs.id],
		relationName: "sourceNpc",
	}),
	targetNpc: one(npcs, {
		fields: [npcRelations.targetNpcId],
		references: [npcs.id],
		relationName: "targetNpc",
	}),
}))

export const npcFactionMembershipsRelations = relations(npcFactionMemberships, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcFactionMemberships.npcId],
		references: [npcs.id],
	}),
	faction: one(factions, {
		fields: [npcFactionMemberships.factionId],
		references: [factions.id],
	}),
}))
