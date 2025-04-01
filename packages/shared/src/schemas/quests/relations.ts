// quests/relations.ts
import { relations } from "drizzle-orm"
import {
	quests,
	questRelations,
	decisionConsequences,
	questStages,
	stageDecisions,
	questTwists,
	questUnlockConditions,
} from "./tables.js"
import { locations, regions } from "../regions/tables.js"
import { questNpcs, factionQuests, clues, items, factionInfluence } from "../associations/tables.js"

export const questsRelations = relations(quests, ({ many, one }) => ({
	// Parent region
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
		relationName: "regionQuests",
	}),

	// Quest components
	stages: many(questStages, { relationName: "questStages" }),
	twists: many(questTwists, { relationName: "questTwists" }),

	// Improved naming for quest relations
	outgoingRelations: many(questRelations, {
		relationName: "sourceQuests",
	}),
	incomingRelations: many(questRelations, {
		relationName: "targetQuests",
	}),

	unlockConditions: many(questUnlockConditions, {
		relationName: "questUnlockConditions",
	}),

	// Associations with other entities
	npcs: many(questNpcs, { relationName: "questNpcs" }),
	factions: many(factionQuests, { relationName: "questFactions" }),
	items: many(items, { relationName: "questItems" }),
	influence: many(factionInfluence, { relationName: "questInfluence" }),
}))

export const questRelationsRelations = relations(questRelations, ({ one, many }) => ({
	// The source quest in the relationship
	sourceQuest: one(quests, {
		fields: [questRelations.questId],
		references: [quests.id],
		relationName: "sourceQuests",
	}),
	// The target quest in the relationship
	targetQuest: one(quests, {
		fields: [questRelations.relatedQuestId],
		references: [quests.id],
		relationName: "targetQuests",
	}),

	// Specific conditions for this relationship
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
	quest: one(quests, {
		fields: [questStages.questId],
		references: [quests.id],
		relationName: "questStages",
	}),
	location: one(locations, {
		fields: [questStages.locationId],
		references: [locations.id],
		relationName: "stageLocation",
	}),
	outgoingDecisions: many(stageDecisions, { relationName: "fromStage" }),
	incomingDecisions: many(stageDecisions, { relationName: "toStage" }),
	incomingConsequences: many(decisionConsequences, { relationName: "affectedStage" }),
	clues: many(clues, { relationName: "stageClues" }),
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
	consequences: many(decisionConsequences, { relationName: "decisionConsequences" }),
}))

export const decisionConsequencesRelations = relations(decisionConsequences, ({ one }) => ({
	decision: one(stageDecisions, {
		fields: [decisionConsequences.decisionId],
		references: [stageDecisions.id],
		relationName: "decisionConsequences",
	}),
	affectedStage: one(questStages, {
		fields: [decisionConsequences.affectedStageId],
		references: [questStages.id],
		relationName: "affectedStage",
	}),
}))
