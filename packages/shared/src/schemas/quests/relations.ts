// quests/relations.ts
import { relations } from "drizzle-orm"
import {
	quests,
	questRelations,
	decisionConsequences,
	questPrerequisites,
	questStages,
	stageDecisions,
	questTwists,
} from "./tables.js"
import { locations, regions } from "../regions/tables.js"
import { questNpcs, factionQuests, clues, items } from "../associations/tables.js"

export const questsRelations = relations(quests, ({ many, one }) => ({
	// Parent region
	region: one(regions, {
		fields: [quests.regionId],
		references: [regions.id],
		relationName: "regionQuests",
	}),

	// Quest components
	stages: many(questStages, { relationName: "questStages" }),
	stageDecisions: many(stageDecisions, { relationName: "stageDecisions" }),
	twists: many(questTwists, { relationName: "questTwists" }),

	// Improved naming for quest relations
	requires: many(questRelations, { relationName: "questRequires" }),
	requiredBy: many(questRelations, { relationName: "questRequiredBy" }),

	// Associations with other entities
	npcs: many(questNpcs, { relationName: "questNpcs" }),
	factions: many(factionQuests, { relationName: "questFactions" }),
	items: many(items, { relationName: "questItems" }),
}))

export const questRelationsRelations = relations(questRelations, ({ one, many }) => ({
	// Source quest (the one that requires the target)
	sourceQuest: one(quests, {
		fields: [questRelations.questId],
		references: [quests.id],
		relationName: "questRequires",
	}),
	// Target quest (the one that is required by the source)
	targetQuest: one(quests, {
		fields: [questRelations.relatedQuestId],
		references: [quests.id],
		relationName: "questRequiredBy",
	}),
	// Additional dependency details
	prerequisites: many(questPrerequisites, { relationName: "relationPrerequisites" }),
}))

export const questPrerequisitesRelations = relations(questPrerequisites, ({ one }) => ({
	relation: one(questRelations, {
		fields: [questPrerequisites.relationId],
		references: [questRelations.id],
		relationName: "relationPrerequisites",
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
