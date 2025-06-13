import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelationships } from "../items/tables"
import { narrativeDestinationParticipants } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcStageInvolvement } from "../quests/stages/tables"
import { questHooks, questStages } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConceptLinks } from "../world-concepts/tables"
import { npcFactionMemberships, npcRelationships, npcSiteAssociations, npcs } from "./tables"

export const npcsRelations = relations(npcs, ({ many }) => ({
	outgoingRelationships: many(npcRelationships, { relationName: "sourceNpc" }),
	incomingRelationships: many(npcRelationships, { relationName: "targetNpc" }),

	factionMemberships: many(npcFactionMemberships),
	siteAssociations: many(npcSiteAssociations),

	// Relations from other schemas that reference this NPC
	conflictParticipation: many(conflictParticipants),
	affectedByConsequences: many(consequences),
	foreshadowingSource: many(foreshadowing, { relationName: "foreshadowingFromNpc" }),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForNpc" }),
	itemHistory: many(itemNotableHistory),
	itemRelationships: many(itemRelationships),
	destinationInvolvement: many(narrativeDestinationParticipants),
	questHooks: many(questHooks),
	questStageDeliveries: many(questStages),
	stageInvolvement: many(npcStageInvolvement),
	worldConceptLinks: many(worldConceptLinks),
}))

export const npcRelationshipsRelations = relations(npcRelationships, ({ one }) => ({
	sourceNpc: one(npcs, {
		fields: [npcRelationships.sourceNpcId],
		references: [npcs.id],
		relationName: "sourceNpc",
	}),
	targetNpc: one(npcs, {
		fields: [npcRelationships.targetNpcId],
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
