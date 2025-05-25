// quests/relations.ts
import { relations } from "drizzle-orm"
import { conflictProgression } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { narrativeEvents, worldStateChanges } from "../events/tables"
import { factions } from "../factions/tables"
import { discoverableElements, investigations } from "../investigation/tables"
import { items } from "../items/tables"
import { destinationContribution } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { regions, sites } from "../regions/tables"
import {
	decisionOutcomes,
	questDependencies,
	questFactionInvolvement,
	questIntroductions,
	questNpcRoles,
	questStages,
	quests,
	questUnlockConditions,
	stageDecisions,
} from "./tables"

export const questsRelations = relations(quests, ({ many, one }) => ({
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
		relationName: "regionQuests",
	}),
	dependencies: many(questDependencies, {
		relationName: "questDependencies",
	}),
	dependents: many(questDependencies, {
		relationName: "questDependents",
	}),
	stages: many(questStages, { relationName: "questStages" }),
	unlockConditions: many(questUnlockConditions, { relationName: "questUnlockConditions" }),
	factionInvolvement: many(questFactionInvolvement, { relationName: "questFactionInvolvement" }),
	npcRoles: many(questNpcRoles, { relationName: "questNpcRoles" }),
	introductions: many(questIntroductions, { relationName: "questIntroductions" }),
	items: many(items, { relationName: "questItems" }),
	conflictProgression: many(conflictProgression, { relationName: "questConflictImpacts" }),
	destinationContributions: many(destinationContribution, { relationName: "questDestinationContributions" }),

	worldChanges: many(worldStateChanges, {
		relationName: "worldChangesByQuest",
	}),
	triggeredEvents: many(narrativeEvents, {
		relationName: "relatedQuestEvents",
	}),
	investigations: many(investigations, { relationName: "questInvestigations" }),
	embedding: one(embeddings, {
		fields: [quests.embeddingId],
		references: [embeddings.id],
	}),
}))

export const questDependenciesRelations = relations(questDependencies, ({ one }) => ({
	sourceQuest: one(quests, {
		fields: [questDependencies.questId],
		references: [quests.id],
		relationName: "questDependencies",
	}),
	targetQuest: one(quests, {
		fields: [questDependencies.relatedQuestId],
		references: [quests.id],
		relationName: "questDependents",
	}),
}))

export const questUnlockConditionsRelations = relations(questUnlockConditions, ({ one }) => ({
	quest: one(quests, {
		fields: [questUnlockConditions.questId],
		references: [quests.id],
		relationName: "questUnlockConditions",
	}),
}))

export const questStagesRelations = relations(questStages, ({ one, many }) => ({
	quest: one(quests, {
		fields: [questStages.questId],
		references: [quests.id],
		relationName: "questStages",
	}),
	site: one(sites, {
		fields: [questStages.siteId],
		references: [sites.id],
		relationName: "siteQuestStages",
	}),
	decisionsFrom: many(stageDecisions, {
		relationName: "decisionsFromStage",
	}),
	decisionsTo: many(stageDecisions, {
		relationName: "decisionsToStage",
	}),
	items: many(items, { relationName: "stageItems" }),

	narrativeEvents: many(narrativeEvents, {
		relationName: "stageEvents",
	}),
	discoverableElements: many(discoverableElements, { relationName: "stageDiscoverableElements" }),
	embedding: one(embeddings, {
		fields: [questStages.embeddingId],
		references: [embeddings.id],
	}),
}))

export const stageDecisionsRelations = relations(stageDecisions, ({ one, many }) => ({
	quest: one(quests, {
		fields: [stageDecisions.questId],
		references: [quests.id],
		relationName: "questDecisions",
	}),
	fromStage: one(questStages, {
		fields: [stageDecisions.fromStageId],
		references: [questStages.id],
		relationName: "decisionsFromStage",
	}),
	toStage: one(questStages, {
		fields: [stageDecisions.toStageId],
		references: [questStages.id],
		relationName: "decisionsToStage",
	}),
	outcomes: many(decisionOutcomes, { relationName: "decisionOutcomes" }),
	triggeredEvents: many(narrativeEvents, {
		relationName: "decisionTriggeredEvents",
	}),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesByDecision" }),
}))

export const decisionOutcomesRelations = relations(decisionOutcomes, ({ one }) => ({
	decision: one(stageDecisions, {
		fields: [decisionOutcomes.decisionId],
		references: [stageDecisions.id],
		relationName: "decisionOutcomes",
	}),
	affectedStage: one(questStages, {
		fields: [decisionOutcomes.affectedStageId],
		references: [questStages.id],
		relationName: "affectedStage",
	}),
}))

// Quest-owned association relations
export const questNpcRolesRelations = relations(questNpcRoles, ({ one }) => ({
	quest: one(quests, {
		fields: [questNpcRoles.questId],
		references: [quests.id],
		relationName: "questNpcRoles",
	}),
	npc: one(npcs, {
		fields: [questNpcRoles.npcId],
		references: [npcs.id],
		relationName: "npcQuests",
	}),
}))

export const questFactionInvolvementRelations = relations(questFactionInvolvement, ({ one }) => ({
	quest: one(quests, {
		fields: [questFactionInvolvement.questId],
		references: [quests.id],
		relationName: "questFactionInvolvement",
	}),
	faction: one(factions, {
		fields: [questFactionInvolvement.factionId],
		references: [factions.id],
		relationName: "factionQuests",
	}),
}))

export const questIntroductionsRelations = relations(questIntroductions, ({ one }) => ({
	quest: one(quests, {
		fields: [questIntroductions.questId],
		references: [quests.id],
		relationName: "questIntroductions",
	}),
	stage: one(questStages, {
		fields: [questIntroductions.stageId],
		references: [questStages.id],
		relationName: "stageIntroductions",
	}),
	site: one(sites, {
		fields: [questIntroductions.siteId],
		references: [sites.id],
		relationName: "siteQuestIntroductions",
	}),
	faction: one(factions, {
		fields: [questIntroductions.factionId],
		references: [factions.id],
		relationName: "factionQuestIntroductions",
	}),
	deliveryNpc: one(npcs, {
		fields: [questIntroductions.deliveryNpcId],
		references: [npcs.id],
		relationName: "npcQuestIntroductions",
	}),
}))
