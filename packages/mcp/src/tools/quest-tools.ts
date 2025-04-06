import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import {
	createEntityActionDescription,
	createEntityHandler,
	type CamelToSnakeCase,
	type ToolDefinition,
} from "./tool.utils"
import { schemas } from "./quest-tools-schema"

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

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.questTables>}`
export type QuestTools = TableTools | "get_all_quests" | "get_quest_by_id" | "get_quest_stages"

export const questToolDefinitions: Record<QuestTools, ToolDefinition> = {
	get_quest_stages: {
		description: "Get all stages for a specific quest",
		inputSchema: zodToMCP(schemas.get_quest_stages),
		handler: async (args) => {
			const parsed = schemas.get_quest_stages.parse(args)
			logger.info("Getting quest stages by ID", { parsed })
			return await db.query.questStages.findMany({ where: eq(questStages.questId, parsed) })
		},
	},
	get_quest_by_id: {
		description: "Get detailed information about a specific quest by ID, including all related entities",
		inputSchema: zodToMCP(schemas.get_quest_by_id),
		handler: async (args) => {
			const parsed = schemas.get_quest_by_id.parse(args)
			logger.info("Getting quest by ID", { parsed })
			return (
				(await db.query.quests.findFirst({
					where: eq(quests.id, parsed),
					with: {
						factions: true,
						npcs: true,
						items: true,
						stages: {
							with: { outgoingDecisions: true, incomingDecisions: true, incomingConsequences: true },
						},
						region: true,
						incomingRelations: { with: { sourceQuest: true } },
						outgoingRelations: { with: { targetQuest: true } },
						unlockConditions: true,
						twists: true,
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "Quest not found" }],
				}
			)
		},
	},

	get_all_quests: {
		description: "Get all quests in the campaign",
		inputSchema: zodToMCP(z.object({})),
		handler: async () => {
			logger.info("Getting all quests")
			return await db.query.quests.findMany({})
		},
	},
	manage_quests: {
		description: createEntityActionDescription("a quest"),
		inputSchema: zodToMCP(schemas.manage_quests),
		handler: createEntityHandler(quests, schemas.manage_quests, "quest"),
	},
	manage_quest_stages: {
		description: createEntityActionDescription("a quest stage"),
		inputSchema: zodToMCP(schemas.manage_quest_stages),
		handler: createEntityHandler(questStages, schemas.manage_quest_stages, "quest stage"),
	},

	manage_stage_decisions: {
		description: createEntityActionDescription("a quest decision point"),
		inputSchema: zodToMCP(schemas.manage_stage_decisions),
		handler: createEntityHandler(stageDecisions, schemas.manage_stage_decisions, "quest decision"),
	},
	manage_decision_outcomes: {
		description: createEntityActionDescription("a quest consequence"),
		inputSchema: zodToMCP(schemas.manage_decision_outcomes),
		handler: createEntityHandler(decisionOutcomes, schemas.manage_decision_outcomes, "quest consequence"),
	},
	manage_quest_dependencies: {
		description: createEntityActionDescription("a quest relationship"),
		inputSchema: zodToMCP(schemas.manage_quest_dependencies),
		handler: createEntityHandler(questDependencies, schemas.manage_quest_dependencies, "quest relationship"),
	},
	manage_quest_unlock_conditions: {
		description: createEntityActionDescription("a quest unlock condition"),
		inputSchema: zodToMCP(schemas.manage_quest_unlock_conditions),
		handler: createEntityHandler(
			questUnlockConditions,
			schemas.manage_quest_unlock_conditions,
			"quest unlock condition",
		),
	},
	manage_quest_twists: {
		description: createEntityActionDescription("a quest twist"),
		inputSchema: zodToMCP(schemas.manage_quest_twists),
		handler: createEntityHandler(questTwists, schemas.manage_quest_twists, "quest twist"),
	},
}
