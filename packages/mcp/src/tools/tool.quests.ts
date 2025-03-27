import { tables } from "@tome-master/shared"
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
	type CamelToSnakeCase,
} from "./tool.utils"

const {
	questTables: {
		quests,
		questStages,
		stageDecisions,
		questRelations,
		questTwists,
		decisionConsequences,
		questPrerequisites,
	},
} = tables

type TableOptions = keyof typeof tables.questTables
type TableTools = `manage_${CamelToSnakeCase<TableOptions>}`

/**
 * Tool names for quest-related operations
 */
export type QuestToolNames = TableTools | "get_all_quests" | "get_quest_by_id"

export const schemas = {
	id: z.object({ id: z.number() }),
	quests: createInsertSchema(quests, {
		id: z.number().optional(),
		description: jsonArray,
		creativePrompts: jsonArray,
		failureOutcomes: jsonArray,
		successOutcomes: jsonArray,
		objectives: jsonArray,
		prerequisites: jsonArray,
		rewards: jsonArray,
		themes: jsonArray,
		inspirations: jsonArray,
	}).strict(),
	questRelations: createInsertSchema(questRelations, {
		id: z.number().optional(),
		description: jsonArray,
		creativePrompts: jsonArray,
	}).strict(),
	questPrerequisites: createInsertSchema(questPrerequisites, {
		id: z.number().optional(),
	}).strict(),
	questStages: createInsertSchema(questStages, {
		id: z.number().optional(),
		description: jsonArray,
		creativePrompts: jsonArray,
		objectives: jsonArray,
		completionPaths: jsonArray,
		encounters: jsonArray,
		dramatic_moments: jsonArray,
		sensory_elements: jsonArray,
	}).strict(),
	stageDecisions: createInsertSchema(stageDecisions, {
		id: z.number().optional(),
		successDescription: jsonArray,
		failureDescription: jsonArray,
		narrativeTransition: jsonArray,
		potential_player_reactions: jsonArray,
		description: jsonArray,
		creativePrompts: jsonArray,
		options: jsonArray,
	}).strict(),
	decisionConsequences: createInsertSchema(decisionConsequences, {
		id: z.number().optional(),
		description: jsonArray,
		creativePrompts: jsonArray,
	}).strict(),

	questTwists: createInsertSchema(questTwists, {
		id: z.number().optional(),
		description: jsonArray,
		creativePrompts: jsonArray,
	}).strict(),
} satisfies Record<TableOptions | "id", z.ZodSchema<unknown>>

export const questToolDefinitions: Record<QuestToolNames, ToolDefinition> = {
	get_quest_by_id: {
		description: "Get detailed information about a specific quest by ID, including all related entities",
		inputSchema: zodToMCP(schemas.id, {
			id: "The unique ID of the quest to retrieve",
		}),
		handler: async (args) => {
			const parsed = schemas.id.parse(args)
			logger.info("Getting quest by ID", { parsed })
			return (
				(await db.query.quests.findFirst({
					where: eq(quests.id, parsed.id),
					with: {
						factions: true,
						npcs: true,
						stages: true,
						items: true,
						region: true,
						requiredBy: true,
						requires: true,
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
		inputSchema: zodToMCP(z.any()),
		handler: async () => {
			logger.info("Getting all quests")
			return await db.query.quests.findMany({})
		},
	},
	manage_quests: {
		description: createEntityActionDescription("a quest"),
		inputSchema: zodToMCP(schemas.quests, {
			id: "The ID of the quest to update (omit to create new)",
			name: "The name or title of the quest",
			creativePrompts: "Creative prompts to help develop the quest",
			description: "Detailed description of the quest's narrative and purpose",
			failureOutcomes: "What happens if the quest fails",
			inspirations: "Inspirations for the quest's narrative or mechanics",
			mood: "The mood or tone of the quest",
			objectives: "The main objectives players need to accomplish",
			prerequisites: "Requirements or conditions to start this quest",
			regionId: "The ID of the region where this quest takes place",
			rewards: "Rewards for completing the quest",
			successOutcomes: "What happens if the quest is completed successfully",
			themes: "Themes explored in this quest",
			type: "The type of quest (main, side, faction, character, exploration, generic)",
			urgency: "The urgency of the quest (background, developing, urgent, critical)",
			visibility: "The visibility of the quest (hidden, rumored, known, featured)",
		}),
		handler: createEntityHandler(quests, schemas.quests, "quest"),
	},
	manage_quest_stages: {
		description: createEntityActionDescription("a quest stage"),
		inputSchema: zodToMCP(schemas.questStages, {
			id: "The ID of the quest stage to update (omit to create new)",
			questId: "The ID of the parent quest this stage belongs to",
			stage: "The numerical order of this stage in the quest sequence",
			description: "Detailed description of what happens in this stage",
			objectives: "Specific objectives to complete in this stage",
			completionPaths: "Different ways players can complete this stage",
			encounters: "Encounters that occur during this stage",
			locationId: "The ID of the location where this quest stage takes place",
			creativePrompts: "Creative prompts to help develop this stage",
			dramatic_moments: "Dramatic moments that can occur in this stage",
			sensory_elements: "Sensory elements to enhance the experience of this stage",
			dramatic_question: "The main question or conflict driving this stage",
			name: "The name or title of this quest stage",
		}),
		handler: createEntityHandler(questStages, schemas.questStages, "quest stage"),
	},

	manage_stage_decisions: {
		description: createEntityActionDescription("a quest decision point"),
		inputSchema: zodToMCP(schemas.stageDecisions, {
			id: "The ID of the decision point to update (omit to create new)",
			name: "The name or title of this decision point",
			description: "The situation requiring a decision",
			options: "Available choices players can make",
			creativePrompts: "Creative prompts related to this decision point",
			potential_player_reactions: "Possible reactions from players based on their choices",
			decision_type: "The type of decision (e.g., moral, strategic, etc.)",
			questId: "The ID of the quest this link belongs to",
			fromStageId: "The ID of the starting stage in this link",
			toStageId: "The ID of the ending stage in this link",
			successDescription: "Description of what happens if the link is successful",
			failureDescription: "Description of what happens if the link fails",
			narrativeTransition: "Narrative transition that occurs due to this link",
			conditionType: "The type of condition that triggers this link",
			conditionValue: "The specific value or condition that must be met",
			dramatically_interesting: "Flag indicating if this link is dramatically interesting",
		}),
		handler: createEntityHandler(stageDecisions, schemas.stageDecisions, "quest decision"),
	},
	manage_decision_consequences: {
		description: createEntityActionDescription("a quest consequence"),
		inputSchema: zodToMCP(schemas.decisionConsequences, {
			id: "The ID of the consequence to update (omit to create new)",
			description: "Detailed description of the consequence",
			creativePrompts: "Creative prompts related to this consequence",
			consequence_type: "The type of consequence (e.g., positive, negative, neutral)",
			delay_factor: "The time factor affecting the consequence (e.g., immediate, delayed)",
			affectedStageId: "The ID of the stage affected by this consequence",
			decisionId: "The ID of the decision this consequence is linked to",
			severity: "The severity of the consequence (e.g., minor, major, catastrophic)",
			visibility: "The visibility of the consequence (e.g., hidden, known, revealed)",
		}),
		handler: createEntityHandler(decisionConsequences, schemas.decisionConsequences, "quest consequence"),
	},
	manage_quest_relations: {
		description: createEntityActionDescription("a quest relationship"),
		inputSchema: zodToMCP(schemas.questRelations, {
			id: "The ID of the relationship to update (omit to create new)",
			questId: "The ID of the primary quest in this relationship",
			relatedQuestId: "The ID of the secondary quest in this relationship",
			description: "Detailed description of the connection between quests",
			creativePrompts: "Creative prompts related to this relationship",
			relationType: "The type of relationship (e.g., prerequisite, sequel, etc.)",
		}),
		handler: createEntityHandler(questRelations, schemas.questRelations, "quest relationship"),
	},
	manage_quest_prerequisites: {
		description: createEntityActionDescription("a quest dependency"),
		inputSchema: zodToMCP(schemas.questPrerequisites, {
			id: "The ID of the dependency to update (omit to create new)",
			relationId: "The ID of the relationship this dependency belongs to",
			unlockCondition: "The condition that unlocks this dependency",
			prerequisiteType: "The type of prerequisite (e.g., item, quest, etc.)",
		}),
		handler: createEntityHandler(questPrerequisites, schemas.questPrerequisites, "quest dependency"),
	},
	manage_quest_twists: {
		description: createEntityActionDescription("a quest twist"),
		inputSchema: zodToMCP(schemas.questTwists, {
			id: "The ID of the twist to update (omit to create new)",
			questId: "The ID of the quest this twist belongs to",
			description: "Detailed description of the twist",
			creativePrompts: "Creative prompts related to this twist",
			impact: "The impact of the twist on the quest",
			narrative_placement: "The narrative placement of the twist in the quest",
			twist_type: "The type of twist (e.g., plot, character, setting)",
		}),
		handler: createEntityHandler(questTwists, schemas.questTwists, "quest twist"),
	},
}
