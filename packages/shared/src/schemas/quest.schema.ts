import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { json } from "../db/utils"

type CompletionPaths = {
	stage: number
	pathName: string
	description: string
	challenges: string
	outcomes: string
}

type DecisionChoices = {
	stage: number
	decision: string
	choice: string
	consequences: string
}
// Define the main quests table
export const quests = sqliteTable("quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	type: text("type").notNull(),
	difficulty: text("difficulty").notNull(),
	description: text("description").notNull(),
	adaptable: integer("adaptable", { mode: "boolean" }).default(true),

	// JSON columns for one-to-many relations
	stages: json<{ stage: number; title: string }[]>("stages"),
	objectives: json<{ stage: number; objective: string }[]>("objectives"),
	completionPaths: json<CompletionPaths[]>("completion_paths"),
	decisionPoints: json<{ stage: number; decision: string }[]>("decision_points"),
	decisionChoices: json<DecisionChoices[]>("decision_choices"),
	twists: json<string[]>("twists"),
	rewards: json<{ rewardPath: string; reward: string }[]>("rewards"),
})
