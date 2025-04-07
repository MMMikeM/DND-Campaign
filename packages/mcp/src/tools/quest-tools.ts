import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import zodToMCP from "../zodToMcp"
import { createEntityActionDescription, createEntityHandler, createGetEntityHandler } from "./tool.utils"
import { schemas } from "./quest-tools-schema"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"

const {
	questTables: {
		quests,
		questStages,
		stageDecisions,
		questDependencies,
		questTwists,
		decisionOutcomes,
		questUnlockConditions,
	},
} = tables

export type QuestGetters = CreateEntityGetters<typeof tables.questTables>

const entityGetters: QuestGetters = {
	all_quests: () => db.query.quests.findMany({}),
	all_quest_stages: () => db.query.questStages.findMany({}),
	all_stage_decisions: () => db.query.stageDecisions.findMany({}),
	all_quest_dependencies: () => db.query.questDependencies.findMany({}),
	all_quest_twists: () => db.query.questTwists.findMany({}),
	all_decision_outcomes: () => db.query.decisionOutcomes.findMany({}),
	all_quest_unlock_conditions: () => db.query.questUnlockConditions.findMany({}),

	quest_by_id: (id: number) =>
		db.query.quests.findFirst({
			where: eq(quests.id, id),
			with: {
				influence: true,
				factions: true,
				npcs: true,
				items: true,
				stages: true,
				region: true,
				incomingRelations: { with: { sourceQuest: true } },
				outgoingRelations: { with: { targetQuest: true } },
				unlockConditions: true,
				twists: true,
			},
		}),
	quest_stage_by_id: (id: number) =>
		db.query.questStages.findFirst({
			where: eq(questStages.id, id),
			with: {
				quest: true,
				site: { with: { area: true, encounters: true, items: true, secrets: true, npcs: true } },
				outgoingDecisions: { with: { toStage: true, consequences: true } },
				incomingDecisions: { with: { fromStage: true, consequences: true } },
				incomingConsequences: { with: { affectedStage: true, decision: true } },
				clues: true,
			},
		}),
	stage_decision_by_id: (id: number) =>
		db.query.stageDecisions.findFirst({
			where: eq(stageDecisions.id, id),
			with: { quest: true, fromStage: true, toStage: true, consequences: true },
		}),
	quest_dependencie_by_id: (id: number) =>
		db.query.questDependencies.findFirst({
			where: eq(questDependencies.id, id),
			with: { sourceQuest: true, targetQuest: true, unlockConditions: true },
		}),
	quest_twist_by_id: (id: number) =>
		db.query.questTwists.findFirst({ where: eq(questTwists.id, id), with: { quest: true } }),
	decision_outcome_by_id: (id: number) =>
		db.query.decisionOutcomes.findFirst({
			where: eq(decisionOutcomes.id, id),
			with: { decision: true, affectedStage: true },
		}),
	quest_unlock_condition_by_id: (id: number) =>
		db.query.questUnlockConditions.findFirst({ where: eq(questUnlockConditions.id, id), with: { quest: true } }),
}

export type QuestTools = CreateTableTools<typeof tables.questTables> | "get_quest_entity"

export const questToolDefinitions: Record<QuestTools, ToolDefinition> = {
	get_quest_entity: {
		description: "Get Quest-related entity information by type and optional ID",
		inputSchema: zodToMCP(schemas.get_quest_entity),
		handler: createGetEntityHandler("quest", entityGetters),
	},

	manage_quests: {
		description: createEntityActionDescription("quest"),
		inputSchema: zodToMCP(schemas.manage_quests),
		handler: createEntityHandler(quests, schemas.manage_quests, "quest"),
	},
	manage_quest_stages: {
		description: createEntityActionDescription("quest stage"),
		inputSchema: zodToMCP(schemas.manage_quest_stages),
		handler: createEntityHandler(questStages, schemas.manage_quest_stages, "quest_stage"),
	},
	manage_stage_decisions: {
		description: createEntityActionDescription("stage decision"),
		inputSchema: zodToMCP(schemas.manage_stage_decisions),
		handler: createEntityHandler(stageDecisions, schemas.manage_stage_decisions, "stage_decision"),
	},
	manage_decision_outcomes: {
		description: createEntityActionDescription("decision outcome"),
		inputSchema: zodToMCP(schemas.manage_decision_outcomes),
		handler: createEntityHandler(decisionOutcomes, schemas.manage_decision_outcomes, "decision_outcome"),
	},
	manage_quest_dependencies: {
		description: createEntityActionDescription("quest dependency"),
		inputSchema: zodToMCP(schemas.manage_quest_dependencies),
		handler: createEntityHandler(questDependencies, schemas.manage_quest_dependencies, "quest_dependency"),
	},
	manage_quest_unlock_conditions: {
		description: createEntityActionDescription("quest unlock condition"),
		inputSchema: zodToMCP(schemas.manage_quest_unlock_conditions),
		handler: createEntityHandler(
			questUnlockConditions,
			schemas.manage_quest_unlock_conditions,
			"quest_unlock_condition",
		),
	},
	manage_quest_twists: {
		description: createEntityActionDescription("quest twist"),
		inputSchema: zodToMCP(schemas.manage_quest_twists),
		handler: createEntityHandler(questTwists, schemas.manage_quest_twists, "quest_twist"),
	},
}
