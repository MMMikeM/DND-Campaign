import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

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
