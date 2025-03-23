import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { jsonArray } from "../db/utils.js"

// Key enums
const questTypes = ["main", "side", "faction", "character", "exploration", "generic"] as const
const questDifficulties = ["easy", "medium", "hard", "very hard"] as const

// Simplified quest schema - focusing on documentation rather than state tracking
export const quests = sqliteTable("quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	type: text("type", { enum: questTypes }).notNull(),
	difficulty: text("difficulty", { enum: questDifficulties }).notNull(),
	description: jsonArray("description").notNull(),
	objectives: jsonArray("objectives"), // Main objectives as JSON
	rewards: jsonArray("rewards"), // Rewards as JSON
	prerequisites: jsonArray("prerequisites"), // Dependencies on other quests
	hooks: jsonArray("hooks"), // How this quest connects to others
	clues: jsonArray("clues"), // Discoverable hints
	timeframe: text("timeframe"), // Optional text describing time constraints
})

export const questStages = sqliteTable("quest_stages", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "cascade" }), // Keep cascade as stages should be deleted with their quest
	stage: integer("stage").notNull(),
	title: text("title").notNull(),
	description: jsonArray("description").notNull(),
	objectives: jsonArray("objectives"), // Stage-specific objectives
	completionPaths: jsonArray("completion_paths"), // Ways to complete this stage
	encounters: jsonArray("encounters"), // Potential encounters in this stage
	locations: jsonArray("locations"), // Key locations for this stage
})

// Consolidated decision structure
export const questDecisions = sqliteTable("quest_decisions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questStageId: integer("quest_stage_id")
		.notNull()
		.references(() => questStages.id, { onDelete: "cascade" }), // Keep cascade as decisions are tied to stages
	description: jsonArray("description").notNull(),
	options: jsonArray("options").notNull(), // Available choices with direct next stage references
	consequences: jsonArray("consequences"), // Narrative outcomes of each choice
})

export const relatedQuests = sqliteTable("related_quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	questId: integer("quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "set null" }),
	relatedQuestId: integer("related_quest_id")
		.notNull()
		.references(() => quests.id, { onDelete: "set null" }), // If the related quest is deleted, set to NULL but keep the relationship record
	relationshipType: text("relationship_type").notNull(),
	description: jsonArray("description"), // Optional description of the relationship
	isRequired: integer("is_required", { mode: "boolean" }).default(false), // Whether this relation is a hard prerequisite
})
