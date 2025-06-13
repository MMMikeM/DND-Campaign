// quests/relations.ts
import { relations } from "drizzle-orm"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { destinationQuestRoles } from "../narrative-destinations/tables"
import { consequences, narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { regions, sites } from "../regions/tables"
import { worldConceptLinks } from "../world-concepts/tables"
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
	foreshadowingSeeds: many(foreshadowing, { relationName: "questForeshadowingSeeds" }),
	itemRelationships: many(itemRelationships, { relationName: "questItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "questWorldConceptLinks" }),
}))

export const questRelationshipsRelations = relations(questRelationships, ({ one }) => ({
	sourceQuest: one(quests, {
		fields: [questRelationships.sourceQuestId],
		references: [quests.id],
		relationName: "questDependencies",
	}),
	targetQuest: one(quests, {
		fields: [questRelationships.targetQuestId],
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
