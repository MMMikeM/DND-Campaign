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

	factionMemberships: many(npcFactionMemberships, { relationName: "npcFactionMemberships" }),
	siteAssociations: many(npcSiteAssociations, { relationName: "npcSiteAssociations" }),

	// Relations from other schemas that reference this NPC
	conflictParticipation: many(conflictParticipants, { relationName: "npcConflicts" }),
	affectedByConsequences: many(consequences, { relationName: "consequencesAffectingNpc" }),
	targetOfForeshadowing: many(foreshadowing, { relationName: "foreshadowedNpc" }),
	sourceOfForeshadowing: many(foreshadowing, { relationName: "npcForeshadowingSeeds" }),
	itemHistory: many(itemNotableHistory, { relationName: "npcItemHistory" }),
	itemRelationships: many(itemRelationships, { relationName: "npcItemRelationships" }),
	destinationInvolvement: many(narrativeDestinationParticipants, { relationName: "npcDestinationInvolvement" }),
	questHooks: many(questHooks, { relationName: "npcQuestHooks" }),
	questStageDeliveries: many(questStages, { relationName: "npcQuestStageDeliveries" }),
	stageInvolvement: many(npcStageInvolvement, { relationName: "npcStageInvolvement" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "npcWorldConceptLinks" }),
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
		relationName: "npcFactionMemberships",
	}),
	faction: one(factions, {
		fields: [npcFactionMemberships.factionId],
		references: [factions.id],
		relationName: "factionMembers",
	}),
}))

export const npcSiteAssociationsRelations = relations(npcSiteAssociations, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcSiteAssociations.npcId],
		references: [npcs.id],
		relationName: "npcSiteAssociations",
	}),
	site: one(sites, {
		fields: [npcSiteAssociations.siteId],
		references: [sites.id],
		relationName: "siteNpcs",
	}),
}))
