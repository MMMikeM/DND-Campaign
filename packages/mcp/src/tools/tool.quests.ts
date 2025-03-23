import { quests, questStages, questDecisions, relatedQuests } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import {
	createEntityHandler,
	createEntityActionDescription,
	jsonArray,
	type ToolDefinition,
} from "./tool.utils"

/**
 * Tool names for quest-related operations
 */
export type QuestToolNames =
	| "get_all_quests"
	| "get_quest_by_id"
	| "manage_quest"
	| "manage_quest_decision"
	| "manage_quest_relationship"
	| "manage_quest_stage"

export const schemas = {
	questIdSchema: z.object({ id: z.number() }),
	getAllQuestsSchema: z.object({}),

	questmanageSchema: createInsertSchema(quests, {
		id: z.number().optional(),
		objectives: jsonArray,
		rewards: jsonArray,
		prerequisites: jsonArray,
		hooks: jsonArray,
		clues: jsonArray,
		description: jsonArray,
	}),

	questStagemanageSchema: createInsertSchema(questStages, {
		id: z.number().optional(),
		objectives: jsonArray,
		description: jsonArray,
		completionPaths: jsonArray,
		encounters: jsonArray,
		locations: jsonArray,
	}),

	questDecisionmanageSchema: createInsertSchema(questDecisions, {
		id: z.number().optional(),
		description: jsonArray,
		options: jsonArray,
		consequences: jsonArray,
	}),

	questRelationshipmanageSchema: createInsertSchema(relatedQuests, {
		id: z.number().optional(),
		description: jsonArray,
	}),
}

export const questToolDefinitions: Record<QuestToolNames, ToolDefinition> = {
	manage_quest: {
		description: createEntityActionDescription("a quest"),
		inputSchema: zodToMCP(schemas.questmanageSchema, {
			id: "The ID of the quest to update (omit to create new)",
			name: "The name or title of the quest",
			type: "The type of quest (main, side, faction, character, exploration, generic)",
			difficulty: "How challenging this quest is (easy, medium, hard, very hard)",
			description: "Detailed description of the quest's narrative and purpose",
			objectives: "The main objectives players need to accomplish",
			rewards: "Rewards for completing the quest",
			prerequisites: "Requirements or conditions to start this quest",
			hooks: "Ways to introduce this quest to players",
			clues: "Clues that help progress the quest",
			timeframe: "Time constraints or schedule for the quest",
		}),
		handler: createEntityHandler(quests, schemas.questmanageSchema, "quest"),
	},

	manage_quest_stage: {
		description: createEntityActionDescription("a quest stage"),
		inputSchema: zodToMCP(schemas.questStagemanageSchema, {
			id: "The ID of the quest stage to update (omit to create new)",
			questId: "The ID of the parent quest this stage belongs to",
			stage: "The numerical order of this stage in the quest sequence",
			title: "The title or name of this quest stage",
			description: "Detailed description of what happens in this stage",
			objectives: "Specific objectives to complete in this stage",
			completionPaths: "Different ways players can complete this stage",
			encounters: "Encounters that occur during this stage",
			locations: "Locations relevant to this quest stage",
		}),
		handler: createEntityHandler(questStages, schemas.questStagemanageSchema, "quest stage"),
	},

	manage_quest_decision: {
		description: createEntityActionDescription("a quest decision point"),
		inputSchema: zodToMCP(schemas.questDecisionmanageSchema, {
			id: "The ID of the decision point to update (omit to create new)",
			questStageId: "The ID of the quest stage where this decision occurs",
			description: "The situation requiring a decision",
			options: "Available choices players can make",
			consequences: "Outcomes and consequences of each choice",
		}),
		handler: createEntityHandler(
			questDecisions,
			schemas.questDecisionmanageSchema,
			"quest decision",
		),
	},

	manage_quest_relationship: {
		description: createEntityActionDescription("a quest relationship"),
		inputSchema: zodToMCP(schemas.questRelationshipmanageSchema, {
			id: "The ID of the relationship to update (omit to create new)",
			questId: "The ID of the primary quest in this relationship",
			relatedQuestId: "The ID of the secondary quest in this relationship",
			relationshipType: "How these quests are related to each other",
			description: "Detailed description of the connection between quests",
			isRequired: "Whether completing the related quest is required for this quest",
		}),
		handler: createEntityHandler(
			relatedQuests,
			schemas.questRelationshipmanageSchema,
			"quest relationship",
		),
	},

	get_quest_by_id: {
		description:
			"Get detailed information about a specific quest by ID, including all related entities",
		inputSchema: zodToMCP(schemas.questIdSchema, {
			id: "The unique ID of the quest to retrieve",
		}),
		handler: async (args) => {
			const parsed = schemas.questIdSchema.parse(args)
			logger.info("Getting quest by ID", { parsed })
			return (
				(await db.query.quests.findFirst({
					where: eq(quests.id, parsed.id),
					with: {
						clues: true,
						factions: true,
						locations: true,
						npcs: true,
						relatedQuests: true,
						relatedToQuests: true,
						stages: true,
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
		inputSchema: zodToMCP(schemas.getAllQuestsSchema, {
			// Empty object with no fields to describe
		}),
		handler: async () => {
			logger.info("Getting all quests")
			return await db.query.quests.findMany()
		},
	},
}
