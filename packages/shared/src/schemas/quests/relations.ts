import { relations } from "drizzle-orm"
import {
	quests,
	questDependencies,
	decisionOutcomes,
	questStages,
	stageDecisions,
	questTwists,
	questUnlockConditions,
} from "./tables.js"
import { embeddings } from "../embeddings/tables.js"
import { regions, sites } from "../regions/tables.js"
import { npcQuestRoles, factionQuestInvolvement, clues, items } from "../associations/tables.js"

export const questsRelations = relations(quests, ({ many, one }) => ({
	outgoingRelations: many(questDependencies, { relationName: "sourceQuests" }),
	incomingRelations: many(questDependencies, { relationName: "targetQuests" }),
	npcs: many(npcQuestRoles, { relationName: "questNpcs" }),
	items: many(items, { relationName: "questItems" }),
	stages: many(questStages, { relationName: "questStages" }),
	twists: many(questTwists, { relationName: "questTwists" }),
	factions: many(factionQuestInvolvement, { relationName: "questFactions" }),
	unlockConditions: many(questUnlockConditions, { relationName: "questUnlockConditions" }),

	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
		relationName: "regionQuests",
	}),
	embedding: one(embeddings, {
		fields: [quests.embeddingId],
		references: [embeddings.id],
	}),
}))

export const questDependenciesRelations = relations(questDependencies, ({ one, many }) => ({
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

	unlockConditions: many(questUnlockConditions, {
		relationName: "relationConditions",
	}),
}))

export const questUnlockConditionsRelations = relations(questUnlockConditions, ({ one }) => ({
	quest: one(quests, {
		fields: [questUnlockConditions.questId],
		references: [quests.id],
		relationName: "questUnlockConditions",
	}),
}))

export const questTwistsRelations = relations(questTwists, ({ one }) => ({
	quest: one(quests, {
		fields: [questTwists.questId],
		references: [quests.id],
		relationName: "questTwists",
	}),
}))

export const questStagesRelations = relations(questStages, ({ one, many }) => ({
	outgoingDecisions: many(stageDecisions, { relationName: "fromStage" }),
	incomingDecisions: many(stageDecisions, { relationName: "toStage" }),
	incomingConsequences: many(decisionOutcomes, { relationName: "affectedStage" }),
	clues: many(clues, { relationName: "stageClues" }),

	quest: one(quests, {
		fields: [questStages.questId],
		references: [quests.id],
		relationName: "questStages",
	}),

	site: one(sites, {
		fields: [questStages.siteId],
		references: [sites.id],
		relationName: "stageSite",
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
		relationName: "questDecisions",
	}),
	fromStage: one(questStages, {
		fields: [stageDecisions.fromStageId],
		references: [questStages.id],
		relationName: "fromStage",
	}),
	toStage: one(questStages, {
		fields: [stageDecisions.toStageId],
		references: [questStages.id],
		relationName: "toStage",
	}),
	consequences: many(decisionOutcomes, { relationName: "decisionConsequences" }),
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
