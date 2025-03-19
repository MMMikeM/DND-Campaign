import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod"
import {
	quests,
	questStages,
	questObjectives,
	questCompletionPaths,
	questDecisionPoints,
	questDecisionChoices,
	questTwists,
	questRewards,
	questFollowUps,
	questRelated,
} from "./quest.schema.js"
import { z } from "zod"
import {
	questNpcSchema,
	questLocationSchema,
	questFactionSchema,
	insertQuestNpcSchema,
	insertQuestLocationSchema,
	insertQuestFactionSchema,
} from "../relations.zod"
import { questFactions, questLocations, questNpcs } from "../relations.schema.js"
const questSchemas = {
	select: {
		quests: createSelectSchema(quests),
		questStages: createSelectSchema(questStages),
		questObjectives: createSelectSchema(questObjectives),
		questCompletionPaths: createSelectSchema(questCompletionPaths),
		questDecisionPoints: createSelectSchema(questDecisionPoints),
		questDecisionChoices: createSelectSchema(questDecisionChoices),
		questTwists: createSelectSchema(questTwists),
		questRewards: createSelectSchema(questRewards),
		questFollowUps: createSelectSchema(questFollowUps),
		questRelated: createSelectSchema(questRelated),
		questNpcs: createSelectSchema(questNpcs),
		questLocations: createSelectSchema(questLocations),
		questFactions: createSelectSchema(questFactions),
	},
	insert: {
		quests: createInsertSchema(quests),
		questStages: createInsertSchema(questStages),
		questObjectives: createInsertSchema(questObjectives),
		questCompletionPaths: createInsertSchema(questCompletionPaths),
		questDecisionPoints: createInsertSchema(questDecisionPoints),
		questDecisionChoices: createInsertSchema(questDecisionChoices),
		questTwists: createInsertSchema(questTwists),
		questRewards: createInsertSchema(questRewards),
		questFollowUps: createInsertSchema(questFollowUps),
		questRelated: createInsertSchema(questRelated),
		questNpcs: createInsertSchema(questNpcs),
		questLocations: createSelectSchema(questLocations),
		questFactions: createInsertSchema(questFactions),
	},
	update: {
		quests: createUpdateSchema(quests),
		questStages: createUpdateSchema(questStages),
		questObjectives: createUpdateSchema(questObjectives),
		questCompletionPaths: createUpdateSchema(questCompletionPaths),
		questDecisionPoints: createUpdateSchema(questDecisionPoints),
		questDecisionChoices: createUpdateSchema(questDecisionChoices),
		questTwists: createUpdateSchema(questTwists),
		questRewards: createUpdateSchema(questRewards),
		questFollowUps: createUpdateSchema(questFollowUps),
		questRelated: createUpdateSchema(questRelated),
		questNpcs: createUpdateSchema(questNpcs),
		questLocations: createUpdateSchema(questLocations),
		questFactions: createUpdateSchema(questFactions),
	},
}

const { select, insert, update } = questSchemas

// Extend base schemas with stage-related data
export const StageSchema = select.questStages.extend({
	objectives: z.array(select.questObjectives.omit({ questId: true, stage: true })),
	completionPaths: z.array(select.questCompletionPaths.omit({ questId: true, stage: true })),
	decisionPoints: z.array(
		select.questDecisionPoints.omit({ questId: true, stage: true }).extend({
			choices: z.array(
				select.questDecisionChoices.omit({ questId: true, stage: true, decision: true }),
			),
		}),
	),
})

// Define the complete Quest schema with all related data
export const QuestSchema = select.quests
	.extend({
		stages: z.array(StageSchema.omit({ questId: true })),
		twists: z.array(select.questTwists.omit({ questId: true })),
		rewards: z.array(select.questRewards.omit({ questId: true })),
		follow_ups: z.array(select.questFollowUps.omit({ questId: true })),
		related_quests: z.array(select.questRelated.omit({ questId: true })),
		npcs: z.array(questNpcSchema.omit({ questId: true })),
		locations: z.array(questLocationSchema.omit({ questId: true })),
		factions: z.array(questFactionSchema.omit({ questId: true })),
	})
	.strict()

// Define stage-related insert schemas for new quests
export const NewStageSchema = insert.questStages.omit({ questId: true, id: true }).extend({
	objectives: z
		.array(insert.questObjectives.omit({ questId: true, stage: true, id: true }))
		.optional(),
	completionPaths: z
		.array(insert.questCompletionPaths.omit({ questId: true, stage: true, id: true }))
		.optional(),
	decisionPoints: z
		.array(
			insert.questDecisionPoints.omit({ questId: true, stage: true, id: true }).extend({
				choices: z
					.array(
						insert.questDecisionChoices.omit({
							questId: true,
							stage: true,
							decision: true,
							id: true,
						}),
					)
					.optional(),
			}),
		)
		.optional(),
})

// Define the schema for creating new quests
export const newQuestSchema = insert.quests
	.omit({ id: true })
	.extend({
		stages: z.array(NewStageSchema).optional(),
		twists: z.array(insert.questTwists.omit({ questId: true, id: true })).optional(),
		rewards: z.array(insert.questRewards.omit({ questId: true, id: true })).optional(),
		follow_ups: z.array(insert.questFollowUps.omit({ questId: true, id: true })).optional(),
		related_quests: z.array(insert.questRelated.omit({ questId: true, id: true })).optional(),
		npcs: z.array(insertQuestNpcSchema.omit({ questId: true })).optional(),
		locations: z.array(insertQuestLocationSchema.omit({ questId: true })).optional(),
		factions: z.array(insertQuestFactionSchema.omit({ questId: true })).optional(),
	})
	.strict()

// Define stage-related update schemas
export const UpdateStageSchema = update.questStages.extend({
	objectives: z.array(insert.questObjectives.omit({ questId: true, stage: true })).optional(),
	completionPaths: z
		.array(insert.questCompletionPaths.omit({ questId: true, stage: true }))
		.optional(),
	decisionPoints: z
		.array(
			insert.questDecisionPoints.omit({ questId: true, stage: true }).extend({
				choices: z
					.array(insert.questDecisionChoices.omit({ questId: true, stage: true, decision: true }))
					.optional(),
			}),
		)
		.optional(),
	stage: z.number(),
	title: z.string(),
})

// Define the schema for updating quests
export const updateQuestSchema = update.quests
	.extend({
		stages: z.array(UpdateStageSchema).optional(),
		twists: z.array(insert.questTwists.omit({ questId: true })).optional(),
		rewards: z.array(insert.questRewards.omit({ questId: true })).optional(),
		follow_ups: z.array(insert.questFollowUps.omit({ questId: true })).optional(),
		related_quests: z.array(insert.questRelated.omit({ questId: true })).optional(),
		npcs: z.array(insertQuestNpcSchema.omit({ questId: true })).optional(),
		locations: z.array(insertQuestLocationSchema.omit({ questId: true })).optional(),
		factions: z.array(insertQuestFactionSchema.omit({ questId: true })).optional(),
	})
	.strict()

export const getQuestSchema = z
	.number()
	.refine((id) => id > 0, {
		message: "Quest ID must be greater than 0",
	})
	.describe("Get a quest by ID")

// Define types based on the Zod schemas
export type Stage = z.infer<typeof StageSchema>
export type NewStage = z.infer<typeof NewStageSchema>
export type UpdateStage = z.infer<typeof UpdateStageSchema>
export type Quest = z.infer<typeof QuestSchema>
export type NewQuest = z.infer<typeof newQuestSchema>
export type UpdateQuest = z.infer<typeof updateQuestSchema>
