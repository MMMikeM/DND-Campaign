import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { narrativeDestinationParticipants } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { questHooks, questParticipants } from "../quests/tables"
import { sites } from "../regions/tables"
import { npcStageInvolvement, questStages } from "../stages/tables"
import { npcFactionMemberships, npcRelations, npcSiteAssociations, npcs } from "./tables"

export const npcsRelations = relations(npcs, ({ many }) => ({
	outgoingRelations: many(npcRelations, { relationName: "sourceNpc" }),
	incomingRelations: many(npcRelations, { relationName: "targetNpc" }),

	factionMemberships: many(npcFactionMemberships),
	siteAssociations: many(npcSiteAssociations),

	// Relations from other schemas that reference this NPC
	conflictParticipation: many(conflictParticipants),
	affectingConsequences: many(consequences, { relationName: "ConsequenceAffectedNpc" }),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetNpc" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceNpc" }),
	itemHistory: many(itemNotableHistory),
	itemRelations: many(itemRelations),
	narrativeDestinationInvolvement: many(narrativeDestinationParticipants),
	questHooks: many(questHooks),
	questStageDeliveries: many(questStages),
	questParticipants: many(questParticipants),
	stageInvolvement: many(npcStageInvolvement),
	loreLinks: many(loreLinks),
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

export const npcSiteAssociationsRelations = relations(npcSiteAssociations, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcSiteAssociations.npcId],
		references: [npcs.id],
	}),
	site: one(sites, {
		fields: [npcSiteAssociations.siteId],
		references: [sites.id],
	}),
}))
