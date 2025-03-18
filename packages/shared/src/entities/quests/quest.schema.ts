import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"
import {
	insertQuestFactionSchema,
	insertQuestLocationSchema,
	insertQuestNpcSchema,
	questFactionSchema,
	questLocationSchema,
	questNpcSchema,
} from "../relations.schema.js"

// Define the main quests table
export const quests = sqliteTable("quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	type: text("type").notNull(),
	difficulty: text("difficulty").notNull(),
	description: text("description").notNull(),
	adaptable: integer("adaptable", { mode: "boolean" }).default(true),
})

// Define the quest stages table
export const questStages = sqliteTable("quest_stages", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	stage: integer("stage").notNull(),
	title: text("title").notNull(),
})

// Define the quest objectives table
export const questObjectives = sqliteTable("quest_objectives", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	stage: integer("stage").notNull(),
	objective: text("objective").notNull(),
})

// Define the quest completion paths table
export const questCompletionPaths = sqliteTable("quest_completion_paths", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	stage: integer("stage").notNull(),
	pathName: text("path_name").notNull(),
	description: text("description").notNull(),
	challenges: text("challenges").notNull(),
	outcomes: text("outcomes").notNull(),
})

// Define the quest decision points table
export const questDecisionPoints = sqliteTable("quest_decision_points", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	stage: integer("stage").notNull(),
	decision: text("decision").notNull(),
})

// Define the quest decision choices table
export const questDecisionChoices = sqliteTable("quest_decision_choices", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	stage: integer("stage").notNull(),
	decision: text("decision").notNull(),
	choice: text("choice").notNull(),
	consequences: text("consequences").notNull(),
})

// Define the quest twists table
export const questTwists = sqliteTable("quest_twists", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	twist: text("twist").notNull(),
})

// Define the quest rewards table
export const questRewards = sqliteTable("quest_rewards", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	rewardPath: text("reward_path").notNull(),
	reward: text("reward").notNull(),
})

// Define the quest follow-ups table
export const questFollowUps = sqliteTable("quest_follow_ups", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	path: text("path").notNull(),
	followUpId: integer("follow_up_id")
		.notNull()
		.references(() => quests.id),
})

// Define the related quests table
export const questRelated = sqliteTable("quest_related", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	relatedId: integer("related_id")
		.notNull()
		.references(() => quests.id),
})

// Define quest NPC, location, and faction relations
export const questNpcs = sqliteTable("quest_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	npcId: integer("npc_id").notNull(),
	role: text("role"),
})

export const questLocations = sqliteTable("quest_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	locationId: integer("location_id").notNull(),
	context: text("context"),
})

export const questFactions = sqliteTable("quest_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }),
	factionId: integer("faction_id").notNull(),
	involvement: text("involvement"),
})

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
