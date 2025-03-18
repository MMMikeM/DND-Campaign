import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

// Define the main quests table
export const quests = sqliteTable("quests", {
	id: integer("id").primaryKey().notNull(),
	title: text("title").notNull(),
	type: text("type").notNull(),
	difficulty: text("difficulty").notNull(),
	description: text("description").notNull(),
	adaptable: integer("adaptable", { mode: "boolean" }).default(true),
})

// Define the quest stages table
export const questStages = sqliteTable(
	"quest_stages",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		title: text("title").notNull(),
	},
	(table) => [primaryKey({ columns: [table.questId, table.stage] })],
)

// Define the quest objectives table
export const questObjectives = sqliteTable(
	"quest_objectives",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		objective: text("objective").notNull(),
	},
	(table) => [primaryKey({ columns: [table.questId, table.stage, table.objective] })],
)

// Define the quest completion paths table
export const questCompletionPaths = sqliteTable(
	"quest_completion_paths",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		pathName: text("path_name").notNull(),
		description: text("description").notNull(),
		challenges: text("challenges").notNull(),
		outcomes: text("outcomes").notNull(),
	},
	(table) => [primaryKey({ columns: [table.questId, table.stage, table.pathName] })],
)

// Define the quest decision points table
export const questDecisionPoints = sqliteTable(
	"quest_decision_points",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		decision: text("decision").notNull(),
	},
	(table) => [primaryKey({ columns: [table.questId, table.stage, table.decision] })],
)

// Define the quest decision choices table
export const questDecisionChoices = sqliteTable(
	"quest_decision_choices",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		decision: text("decision").notNull(),
		choice: text("choice").notNull(),
		consequences: text("consequences").notNull(),
	},
	(table) => [primaryKey({ columns: [table.questId, table.stage, table.decision, table.choice] })],
)

// Define the quest twists table
export const questTwists = sqliteTable(
	"quest_twists",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		twist: text("twist").notNull(),
	},
	(table) => [primaryKey({ columns: [table.questId, table.twist] })],
)

// Define the quest rewards table
export const questRewards = sqliteTable(
	"quest_rewards",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		rewardPath: text("reward_path").notNull(),
		reward: text("reward").notNull(),
	},
	(table) => [primaryKey({ columns: [table.questId, table.rewardPath, table.reward] })],
)

// Define the quest follow-ups table
export const questFollowUps = sqliteTable(
	"quest_follow_ups",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		path: text("path").notNull(),
		followUpId: integer("follow_up_id")
			.notNull()
			.references(() => quests.id),
	},
	(table) => [primaryKey({ columns: [table.questId, table.path, table.followUpId] })],
)

// Define the related quests table
export const questRelated = sqliteTable(
	"quest_related",
	{
		questId: integer("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		relatedId: integer("related_id")
			.notNull()
			.references(() => quests.id),
	},
	(table) => [primaryKey({ columns: [table.questId, table.relatedId] })],
)

// Create Zod schemas for insert and select operations
export const insertQuestSchema = createInsertSchema(quests)
export const selectQuestSchema = createSelectSchema(quests)
export const insertQuestStageSchema = createInsertSchema(questStages)
export const selectQuestStageSchema = createSelectSchema(questStages)
export const insertQuestObjectiveSchema = createInsertSchema(questObjectives)
export const selectQuestObjectiveSchema = createSelectSchema(questObjectives)
export const insertQuestCompletionPathSchema = createInsertSchema(questCompletionPaths)
export const selectQuestCompletionPathSchema = createSelectSchema(questCompletionPaths)

// Define a typed Quest schema using Zod
export const QuestSchema = selectQuestSchema.extend({
	quest_stages: z.array(
		selectQuestStageSchema.extend({
			objectives: z.array(selectQuestObjectiveSchema.shape.objective),
			completion_paths: z.record(
				selectQuestCompletionPathSchema.pick({
					description: true,
					challenges: true,
					outcomes: true,
				}),
			),
		}),
	),
	key_decision_points: z.array(
		z.object({
			stage: z.number(),
			decision: z.string(),
			choices: z.array(
				z.object({
					choice: z.string(),
					consequences: z.string(),
				}),
			),
		}),
	),
	potential_twists: z.array(z.string()),
	rewards: z.record(z.array(z.string())),
	follow_up_quests: z.record(z.array(z.number())),
	related_quests: z.array(z.number()),
	associated_npc: z.array(z.number()),
})

// Define types based on the Zod schemas
export type Quest = z.infer<typeof QuestSchema>
export type NewQuest = z.infer<typeof insertQuestSchema>
export type QuestStage = z.infer<typeof selectQuestStageSchema>
export type NewQuestStage = z.infer<typeof insertQuestStageSchema>
