import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const { questStages, questStageDecisions, npcStageInvolvement, enums } = tables.questStageTables

const { ambiguityLevels, conditionTypes, decisionTypes, stageImportanceLevels, stageTypes, complexityLevels } = enums

type TableNames = CreateTableNames<typeof tables.questStageTables>

export const tableEnum = ["questStages", "questStageDecisions", "npcStageInvolvement"] as const satisfies TableNames

export const schemas = {
	questStages: createInsertSchema(questStages, {
		completionPaths: list.describe("Different approaches players might use to advance"),
		deliveryNpcId: optionalId.describe("ID of NPC who delivers this stage"),
		dramatic_moments: list.describe("Key emotional or high-tension scenes"),
		dramatic_question: (s) => s.describe("Central conflict or tension driving this stage"),
		encounters: list.describe("Challenges, combats, or social interactions in this stage"),
		intendedComplexityLevel: z.enum(complexityLevels).describe("Intended complexity level for this stage"),
		name: (s) => s.describe("Title or identifier for this quest segment"),
		objectives: list.describe("Goals players need to complete in this stage"),
		questId: id.describe("ID of parent quest this stage belongs to"),
		sensory_elements: list.describe("Descriptive details for immersion (sights, sounds, smells)"),
		siteId: optionalId.describe("ID of site where this stage takes place"),
		stageImportance: z.enum(stageImportanceLevels).describe("Importance of this stage to the overall quest"),
		stageOrder: (s) => s.describe("Numerical order or sequence position within quest"),
		stageType: z.enum(stageTypes).describe("Type of stage (revelation_point, decision_point, etc.)"),
		creativePrompts: list.describe("Ideas for running this stage or adapting to player approaches"),
		description: list.describe("Key events and plot developments in this segment in point form"),
		gmNotes: list.describe("GM-only information about this stage"),
		tags: list.describe("Tags for this stage"),
	})
		.omit({ id: true })
		.strict()
		.describe("Discrete chapters within quests that represent key locations, challenges, or narrative beats"),

	questStageDecisions: createInsertSchema(questStageDecisions, {
		questId: id.describe("ID of quest this decision belongs to"),
		fromQuestStageId: id.describe("ID of stage where this decision occurs"),
		toQuestStageId: optionalId.describe("ID of stage this decision leads to if taken"),
		conditionType: z
			.enum(conditionTypes)
			.describe("Trigger type (choice, skill_check, item, npc_relation, faction, etc.)"),
		decisionType: z.enum(decisionTypes).describe("Nature of choice (moral_choice, tactical_decision, etc.)"),
		name: (s) => s.describe("Identifier for this pivotal moment"),
		ambiguityLevel: z.enum(ambiguityLevels).describe("How clear the best choice is"),
		conditionValue: (s) => s.describe("Parameters, DCs, or requirements"),
		successDescription: list.describe("What happens when players succeed or take intended path"),
		failureDescription: list.describe("Consequences when players fail or choose differently"),
		narrativeTransition: list.describe("How story progresses based on this decision"),
		potential_player_reactions: list.describe("Likely player responses to this moment"),
		options: list.describe("Explicit choices available to players"),
		failure_leads_to_retry: z.boolean().describe("Whether failure leads to a retry opportunity"),
		failure_lesson_learned: (s) =>
			s.optional().describe("Lesson learned from failure (required if failure_leads_to_retry is true)"),
		description: list.describe("The choice or dilemma presented to players in point form"),
		creativePrompts: list.describe("Ideas for presenting this dramatically or adapting to choices"),
		gmNotes: list.describe("GM-only notes about this decision"),
		tags: list.describe("Tags for this decision"),
	})
		.omit({ id: true })
		.strict()
		.describe("Branching points where player choices affect the quest's direction, creating meaningful agency")
		.refine((data) => !data.failure_leads_to_retry || data.failure_lesson_learned !== undefined, {
			message: "failure_lesson_learned is required when failure_leads_to_retry is true",
			path: ["failure_lesson_learned"],
		})
		.refine((data) => data.fromQuestStageId !== data.toQuestStageId, {
			message: "A stage decision cannot loop back to the same stage",
			path: ["toQuestStageId"],
		}),

	npcStageInvolvement: createInsertSchema(npcStageInvolvement, {
		questStageId: id.describe("ID of quest stage this involvement belongs to"),
		npcId: optionalId.describe("ID of NPC involved"),
		roleInStage: (s) => s.describe("Role of the NPC in the stage"),
		involvementDetails: list.describe("Details about how this NPC is involved"),
		creativePrompts: list.describe("Ideas for using this NPC in the stage"),
		description: list.describe("Description of the NPC's involvement"),
		gmNotes: list.describe("GM-only notes about this NPC involvement"),
		tags: list.describe("Tags for this NPC involvement"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how NPCs are involved in quest stages"),
} as const satisfies Schema<TableNames[number]>
