// quests/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { consequences, narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { foreshadowingSeeds } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { destinationQuestRoles } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { regions, sites } from "../regions/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
import { questStages } from "./stages/tables"
import { questHooks, questParticipantInvolvement, questRelationships, quests } from "./tables"

export const questsRelations = relations(quests, ({ many, one }) => ({
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
		relationName: "regionQuests",
	}),
	dependencies: many(questRelationships, {
		relationName: "questDependencies",
	}),
	dependents: many(questRelationships, {
		relationName: "questDependents",
	}),
	stages: many(questStages, { relationName: "questStages" }),

	hooks: many(questHooks, { relationName: "questHooks" }),
	participantInvolvement: many(questParticipantInvolvement, { relationName: "questParticipants" }),
	destinationContributions: many(destinationQuestRoles, { relationName: "questDestinationRoles" }),

	consequences: many(consequences, {
		relationName: "consequencesByQuest",
	}),
	triggeredEvents: many(narrativeEvents, {
		relationName: "questEvents",
	}),
	foreshadowingSeeds: many(foreshadowingSeeds, { relationName: "questForeshadowingSeeds" }),
	itemRelationships: many(itemRelationships, { relationName: "questItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "questWorldConceptLinks" }),

	embedding: one(embeddings, {
		fields: [quests.embeddingId],
		references: [embeddings.id],
	}),
}))

export const questRelationshipsRelations = relations(questRelationships, ({ one }) => ({
	sourceQuest: one(quests, {
		fields: [questRelationships.questId],
		references: [quests.id],
		relationName: "questDependencies",
	}),
	targetQuest: one(quests, {
		fields: [questRelationships.relatedQuestId],
		references: [quests.id],
		relationName: "questDependents",
	}),
}))

export const questHooksRelations = relations(questHooks, ({ one }) => ({
	quest: one(quests, {
		fields: [questHooks.questId],
		references: [quests.id],
		relationName: "questHooks",
	}),
	site: one(sites, {
		fields: [questHooks.siteId],
		references: [sites.id],
		relationName: "siteQuestHooks",
	}),
	faction: one(factions, {
		fields: [questHooks.factionId],
		references: [factions.id],
		relationName: "factionQuestHooks",
	}),
	deliveryNpc: one(npcs, {
		fields: [questHooks.deliveryNpcId],
		references: [npcs.id],
		relationName: "npcQuestHooks",
	}),
}))

export const questParticipantInvolvementRelations = relations(questParticipantInvolvement, ({ one }) => ({
	quest: one(quests, {
		fields: [questParticipantInvolvement.questId],
		references: [quests.id],
		relationName: "questParticipants",
	}),
	npc: one(npcs, {
		fields: [questParticipantInvolvement.npcId],
		references: [npcs.id],
		relationName: "npcQuestParticipation",
	}),
	faction: one(factions, {
		fields: [questParticipantInvolvement.factionId],
		references: [factions.id],
		relationName: "factionQuestParticipation",
	}),
}))
