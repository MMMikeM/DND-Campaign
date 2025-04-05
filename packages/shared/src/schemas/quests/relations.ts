// quests/relations.ts
import { relations } from "drizzle-orm"
import {
	quests,
	questDependencies, // Corrected import
	decisionOutcomes, // Corrected import
	questStages,
	stageDecisions,
	questTwists,
	questUnlockConditions,
} from "./tables.js"
import { locations, regions } from "../regions/tables.js"
import { npcQuestRoles, factionQuestInvolvement, clues, items, factionRegionalPower } from "../associations/tables.js" // Corrected imports

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

	// Corrected quest relations usage
	outgoingRelations: many(questDependencies, {
		// Corrected usage
		relationName: "sourceQuests",
	}),
	incomingRelations: many(questDependencies, {
		// Corrected usage
		relationName: "targetQuests",
	}),

	unlockConditions: many(questUnlockConditions, {
		relationName: "questUnlockConditions",
	}),

	// Associations with other entities (Corrected usage)
	npcs: many(npcQuestRoles, { relationName: "questNpcs" }),
	factions: many(factionQuestInvolvement, { relationName: "questFactions" }),
	items: many(items, { relationName: "questItems" }),
	influence: many(factionRegionalPower, { relationName: "questInfluence" }),
}))

// Renamed relation and corrected internal usage
export const questDependenciesRelations = relations(questDependencies, ({ one, many }) => ({
	// The source quest in the relationship
	sourceQuest: one(quests, {
		fields: [questDependencies.questId],
		references: [quests.id],
		relationName: "sourceQuests",
	}),
	// The target quest in the relationship
	targetQuest: one(quests, {
		fields: [questDependencies.relatedQuestId],
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
	incomingConsequences: many(decisionOutcomes, { relationName: "affectedStage" }), // Corrected usage
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
	consequences: many(decisionOutcomes, { relationName: "decisionConsequences" }), // Corrected usage
}))

// Renamed relation and corrected internal usage
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
