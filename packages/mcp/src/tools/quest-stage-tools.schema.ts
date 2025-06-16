import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const { questStages, questStageDecisions, npcStageInvolvement, enums } = tables.questStageTables

const { ambiguityLevels, conditionTypes, decisionTypes, stageImportanceLevels, stageTypes, complexityLevels } = enums

type TableNames = CreateTableNames<typeof tables.questStageTables>

export const tableEnum = [	"questStages", "questStageDecisions", "npcStageInvolvement"] as const satisfies TableNames

export const schemas = {

	questStages: createInsertSchema(questStages, {
		completionPaths: (s) => s.describe("Different approaches players might use to advance"),
		deliveryNpcId: optionalId.describe("ID of NPC who delivers this stage"),
		dramatic_moments: (s) => s.describe("Key emotional or high-tension scenes"),
		dramatic_question: (s) => s.describe("Central conflict or tension driving this stage"),
		encounters: (s) => s.describe("Challenges, combats, or social interactions in this stage"),
		intendedComplexityLevel: z.enum(complexityLevels).describe("Intended complexity level for this stage"),
		name: (s) => s.describe("Title or identifier for this quest segment"),
		objectives: (s) => s.describe("Goals players need to complete in this stage"),
		questId: id.describe("ID of parent quest this stage belongs to"),
		sensory_elements: (s) => s.describe("Descriptive details for immersion (sights, sounds, smells)"),
		siteId: optionalId.describe("ID of site where this stage takes place"),
		stageImportance: z.enum(stageImportanceLevels).describe("Importance of this stage to the overall quest"),
		stageOrder: (s) => s.describe("Numerical order or sequence position within quest"),
		stageType: z.enum(stageTypes).describe("Type of stage (revelation_point, decision_point, etc.)"),
		creativePrompts: (s) => s.describe("Ideas for running this stage or adapting to player approaches"),
		description: (s) => s.describe("Key events and plot developments in this segment in point form"),
		gmNotes: (s) => s.describe("GM-only information about this stage"),
		tags: (s) => s.describe("Tags for this stage"),
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
		successDescription: (s) => s.describe("What happens when players succeed or take intended path"),
		failureDescription: (s) => s.describe("Consequences when players fail or choose differently"),
		narrativeTransition: (s) => s.describe("How story progresses based on this decision"),
		potential_player_reactions: (s) => s.describe("Likely player responses to this moment"),
		options: (s) => s.describe("Explicit choices available to players"),
		failure_leads_to_retry: z.boolean().describe("Whether failure leads to a retry opportunity"),
		failure_lesson_learned: (s) =>
			s.optional().describe("Lesson learned from failure (required if failure_leads_to_retry is true)"),
		description: (s) => s.describe("The choice or dilemma presented to players in point form"),
		creativePrompts: (s) => s.describe("Ideas for presenting this dramatically or adapting to choices"),
		gmNotes: (s) => s.describe("GM-only information about this decision"),
		tags: (s) => s.describe("Tags for this decision"),
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
		involvementDetails: (s) => s.describe("Details about how this NPC is involved"),
		creativePrompts: (s) => s.describe("Ideas for using this NPC in the stage"),
		description: (s) => s.describe("Description of the NPC's involvement"),
		gmNotes: (s) => s.describe("GM-only notes about this NPC involvement"),
		tags: (s) => s.describe("Tags for this NPC involvement"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how NPCs are involved in quest stages"),
} as const satisfies Schema<TableNames[number]>
