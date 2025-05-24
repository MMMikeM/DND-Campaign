// quests/relations.ts
import { relations } from "drizzle-orm"
import { clues, factionQuestInvolvement, items, npcQuestRoles } from "../associations/tables.js"
import { conflictProgression } from "../conflict/tables"
import { embeddings } from "../embeddings/tables.js"
import { narrativeEvents } from "../events/tables"
import { narrativeForeshadowing } from "../foreshadowing/tables"
import { destinationContribution } from "../narrative/tables"
import { regions, sites } from "../regions/tables.js"
import { worldStateChanges } from "../world/tables.js"
import {
	decisionOutcomes,
	questDependencies,
	questStages,
	quests,
	questUnlockConditions,
	stageDecisions,
} from "./tables.js"

export const questsRelations = relations(quests, ({ many, one }) => ({
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
	}),
	dependencies: many(questDependencies, {
		relationName: "questDependencies",
	}),
	dependents: many(questDependencies, {
		relationName: "questDependents",
	}),
	stages: many(questStages),
	unlockConditions: many(questUnlockConditions),
	factionInvolvement: many(factionQuestInvolvement),
	npcRoles: many(npcQuestRoles),
	items: many(items),
	conflictProgression: many(conflictProgression),
	destinationContributions: many(destinationContribution),
	foreshadowing: many(narrativeForeshadowing, {
		relationName: "foreshadowsQuest",
	}),
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
	clues: many(clues),
	items: many(items),
	foreshadowing: many(narrativeForeshadowing, {
		relationName: "stageForeshadowing",
	}),
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
