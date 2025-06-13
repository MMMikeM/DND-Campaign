import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflict/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelationships } from "../items/tables"
import { destinationParticipantInvolvement } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcStageInvolvement } from "../quests/stages/tables"
import { questHooks, questStages } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
import { npcFactions, npcRelationships, npcSites, npcs } from "./tables"

export const npcsRelations = relations(npcs, ({ many }) => ({
	outgoingRelationships: many(npcRelationships, { relationName: "sourceNpc" }),
	incomingRelationships: many(npcRelationships, { relationName: "targetNpc" }),

	relatedFactions: many(npcFactions, { relationName: "npcFactions" }),
	siteAssociations: many(npcSites, { relationName: "npcSites" }),

	// Relations from other schemas that reference this NPC
	conflictParticipation: many(conflictParticipants, { relationName: "npcConflicts" }),
	affectedByConsequences: many(consequences, { relationName: "consequencesAffectingNpc" }),
	targetOfForeshadowing: many(foreshadowing, { relationName: "foreshadowedNpc" }),
	sourceOfForeshadowing: many(foreshadowing, { relationName: "npcForeshadowingSeeds" }),
	itemHistory: many(itemNotableHistory, { relationName: "npcItemHistory" }),
	itemRelationships: many(itemRelationships, { relationName: "npcItemRelationships" }),
	destinationInvolvement: many(destinationParticipantInvolvement, { relationName: "npcDestinationInvolvement" }),
	questHooks: many(questHooks, { relationName: "npcQuestHooks" }),
	questStageDeliveries: many(questStages, { relationName: "npcQuestStageDeliveries" }),
	stageInvolvement: many(npcStageInvolvement, { relationName: "npcStageInvolvement" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "npcWorldConceptLinks" }),
}))

export const characterRelationshipsRelations = relations(npcRelationships, ({ one }) => ({
	sourceNpc: one(npcs, {
		fields: [npcRelationships.npcId],
		references: [npcs.id],
		relationName: "sourceNpc",
	}),
	targetNpc: one(npcs, {
		fields: [npcRelationships.relatedNpcId],
		references: [npcs.id],
		relationName: "targetNpc",
	}),
}))

export const npcFactionsRelations = relations(npcFactions, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcFactions.npcId],
		references: [npcs.id],
		relationName: "npcFactions",
	}),
	faction: one(factions, {
		fields: [npcFactions.factionId],
		references: [factions.id],
		relationName: "factionMembers",
	}),
}))

export const npcSitesRelations = relations(npcSites, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcSites.npcId],
		references: [npcs.id],
		relationName: "npcSites",
	}),
	site: one(sites, {
		fields: [npcSites.siteId],
		references: [sites.id],
		relationName: "siteNpcs",
	}),
}))
