// quests/relations.ts
import { relations } from "drizzle-orm"
import { conflictProgression } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { narrativeEvents, worldStateChanges } from "../events/tables"
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
	stages: many(questStages),
	unlockConditions: many(questUnlockConditions),
	factionInvolvement: many(questFactionInvolvement),
	npcRoles: many(questNpcRoles),
	introductions: many(questIntroductions),
	items: many(items),
	conflictProgression: many(conflictProgression),
	destinationContributions: many(destinationContribution),

	worldChanges: many(worldStateChanges, {
		relationName: "worldChangesByQuest",
	}),
	triggeredEvents: many(narrativeEvents, {
		relationName: "relatedQuestEvents",
	}),
	embedding: one(embeddings, {
		fields: [quests.embeddingId],
		references: [embeddings.id],
	}),
}))

export const questDependenciesRelations = relations(questDependencies, ({ one }) => ({
	sourceQuest: one(quests, {
		fields: [questDependencies.questId],
		references: [quests.id],
		relationName: "sourceQuests",
	}),
	targetQuest: one(quests, {
		fields: [questDependencies.relatedQuestId],
		references: [quests.id],
		relationName: "targetQuests",
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
	}),
	site: one(sites, {
		fields: [questStages.siteId],
		references: [sites.id],
	}),
	decisionsFrom: many(stageDecisions, {
		relationName: "decisionsFromStage",
	}),
	decisionsTo: many(stageDecisions, {
		relationName: "decisionsToStage",
	}),
	items: many(items),

	narrativeEvents: many(narrativeEvents, {
		relationName: "stageEvents",
	}),
	embedding: one(embeddings, {
		fields: [questStages.embeddingId],
		references: [embeddings.id],
	}),
}))

export const stageDecisionsRelations = relations(stageDecisions, ({ one, many }) => ({
	quest: one(quests, {
		fields: [stageDecisions.questId],
		references: [quests.id],
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
	outcomes: many(decisionOutcomes),
	triggeredEvents: many(narrativeEvents, {
		relationName: "decisionTriggeredEvents",
	}),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesByDecision" }),
}))

export const decisionOutcomesRelations = relations(decisionOutcomes, ({ one }) => ({
	decision: one(stageDecisions, {
		fields: [decisionOutcomes.decisionId],
		references: [stageDecisions.id],
		relationName: "decisionConsequences",
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
		relationName: "questNpcs",
	}),
}))

export const questFactionInvolvementRelations = relations(questFactionInvolvement, ({ one }) => ({
	quest: one(quests, {
		fields: [questFactionInvolvement.questId],
		references: [quests.id],
		relationName: "questFactions",
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
	deliveryNpc: one(npcs, {
		fields: [questIntroductions.deliveryNpcId],
		references: [npcs.id],
		relationName: "npcQuestIntroductions",
	}),
}))
