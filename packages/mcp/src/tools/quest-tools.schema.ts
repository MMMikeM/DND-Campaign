import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	questTables: {
		quests,
		questStages,
		stageDecisions,
		questRelationships,
		questHooks,
		questParticipantInvolvement,
		enums,
	},
} = tables

type TableNames = CreateTableNames<typeof tables.questTables>

export const tableEnum = [
	"quests",
	"questStages",
	"stageDecisions",
	"questRelationships",
	"questHooks",
	"questParticipantInvolvement",
] as const satisfies TableNames

export const schemas = {
	quests: createInsertSchema(quests, {
		creativePrompts: (s) => s.describe("Ideas for plot developments and player involvement"),
		description: (s) => s.describe("Core narrative elements and storyline in point form"),
		failureOutcomes: (s) => s.describe("Consequences if players fail to complete the quest"),
		successOutcomes: (s) => s.describe("Results and world changes upon successful completion"),
		inspirations: (s) => s.describe("Reference materials that influenced this quest design"),
		objectives: (s) => s.describe("Specific tasks players must accomplish to progress"),
		rewards: (s) => s.describe("Items, reputation, and benefits for completion"),
		themes: (s) => s.describe("Underlying motifs and emotional elements explored"),
		name: (s) => s.describe("Title or identifier revealed to players"),
		regionId: optionalId.describe("ID of region where quest primarily takes place"),
		mood: (s) => s.describe("Emotional tone and atmosphere (tense, mysterious, celebratory, etc.)"),
		urgency: z.enum(enums.urgencyLevels).describe("Time pressure (background, developing, urgent, critical)"),
		visibility: z.enum(enums.visibilityLevels).describe("How known this quest is (hidden, rumored, known, featured)"),
		type: z.enum(enums.questTypes).describe("Campaign significance (main, side, faction, character, generic)"),
		moralSpectrumFocus: z.enum(enums.moralSpectrumFocus).describe("Moral complexity of the quest"),
		intendedPacingRole: z.enum(enums.pacingRoles).describe("Role in campaign pacing"),
		primaryPlayerExperienceGoal: z.enum(enums.playerExperienceGoals).describe("Primary experience goal for players"),
		prerequisiteQuestId: optionalId.describe("ID of quest that must be completed first"),
		otherUnlockConditionsNotes: (s) =>
			s.optional().describe("Additional unlock conditions not covered by prerequisite quest"),
		gmNotes: (s) => s.describe("GM-only information about this quest"),
		tags: (s) => s.describe("Tags for this quest"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Adventures with objectives, rewards, and narrative impact that drive the campaign forward"),

	questRelationships: createInsertSchema(questRelationships, {
		questId: id.describe("ID of the primary quest in this relationship"),
		relatedQuestId: optionalId.describe("ID of the secondary quest in this relationship"),
		relationshipType: z
			.enum(enums.relationshipTypes)
			.describe("Connection type (prerequisite, sequel, parallel, alternative, hidden_connection)"),
		description: (s) => s.describe("How these quests interconnect narratively in point form"),
		creativePrompts: (s) => s.describe("Ideas for emphasizing connections between quests"),
		gmNotes: (s) => s.describe("GM-only notes about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links between quests that create narrative sequences, alternative paths, or cause-effect relationships"),

	questStages: createInsertSchema(questStages, {
		questId: id.describe("ID of parent quest this stage belongs to"),
		siteId: optionalId.describe("ID of site where this stage takes place"),
		stageOrder: (s) => s.describe("Numerical order or sequence position within quest"),
		name: (s) => s.describe("Title or identifier for this quest segment"),
		dramatic_question: (s) => s.describe("Central conflict or tension driving this stage"),
		stageType: z.enum(enums.stageTypes).describe("Type of stage (revelation_point, decision_point, etc.)"),
		intendedComplexityLevel: z.enum(enums.complexityLevels).describe("Intended complexity level for this stage"),
		objectives: (s) => s.describe("Goals players need to complete in this stage"),
		completionPaths: (s) => s.describe("Different approaches players might use to advance"),
		encounters: (s) => s.describe("Challenges, combats, or social interactions in this stage"),
		dramatic_moments: (s) => s.describe("Key emotional or high-tension scenes"),
		sensory_elements: (s) => s.describe("Descriptive details for immersion (sights, sounds, smells)"),
		stageImportance: z.enum(enums.stageImportanceLevels).describe("Importance of this stage to the overall quest"),
		creativePrompts: (s) => s.describe("Ideas for running this stage or adapting to player approaches"),
		description: (s) => s.describe("Key events and plot developments in this segment in point form"),
		gmNotes: (s) => s.describe("GM-only information about this stage"),
		tags: (s) => s.describe("Tags for this stage"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Discrete chapters within quests that represent key locations, challenges, or narrative beats"),

	stageDecisions: createInsertSchema(stageDecisions, {
		questId: id.describe("ID of quest this decision belongs to"),
		fromStageId: id.describe("ID of stage where this decision occurs"),
		toStageId: optionalId.describe("ID of stage this decision leads to if taken"),
		conditionType: z
			.enum(enums.conditionTypes)
			.describe("Trigger type (choice, skill_check, item, npc_relation, faction, etc.)"),
		decisionType: z.enum(enums.decisionTypes).describe("Nature of choice (moral_choice, tactical_decision, etc.)"),
		name: (s) => s.describe("Identifier for this pivotal moment"),
		ambiguityLevel: z.enum(enums.ambiguityLevels).describe("How clear the best choice is"),
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
		.refine((data) => data.fromStageId !== data.toStageId, {
			message: "A stage decision cannot loop back to the same stage",
			path: ["toStageId"],
		}),

	questHooks: createInsertSchema(questHooks, {
		questId: id.describe("ID of quest this hook belongs to"),
		siteId: optionalId.describe("ID of site where this hook can be discovered"),
		factionId: optionalId.describe("ID of faction involved in this hook"),
		source: (s) => s.describe("Source of the hook information"),
		hookType: z.enum(enums.hookTypes).describe("Type of hook (rumor, npc_interaction, location_discovery)"),
		presentationStyle: z.enum(enums.presentationStyles).describe("How to present this hook"),
		hookContent: (s) => s.describe("Content of the hook"),
		discoveryConditions: (s) => s.describe("Conditions for discovering this hook"),
		deliveryNpcId: optionalId.describe("ID of NPC who delivers this hook"),
		npcRelationshipToParty: (s) => s.describe("Relationship of the delivery NPC to the party"),
		trustRequired: z.enum(enums.trustLevels).describe("Trust level required for this hook"),
		dialogueHint: (s) => s.describe("Dialogue hint for this hook"),
		description: (s) => s.describe("Description of this hook"),
		creativePrompts: (s) => s.describe("Ideas for presenting this hook"),
		gmNotes: (s) => s.describe("GM-only notes about this hook"),
		tags: (s) => s.describe("Tags for this hook"),
	})
		.omit({ id: true })
		.strict()
		.describe("Ways for players to discover and begin quests"),

	questParticipantInvolvement: createInsertSchema(questParticipantInvolvement, {
		questId: id.describe("ID of quest this involvement belongs to"),
		npcId: optionalId.describe("ID of NPC involved (either npcId or factionId must be provided)"),
		factionId: optionalId.describe("ID of faction involved (either npcId or factionId must be provided)"),
		roleInQuest: (s) => s.describe("Role of the participant in the quest"),
		importanceInQuest: z.enum(enums.participantImportanceLevels).describe("Importance level of this participant"),
		involvementDetails: (s) => s.describe("Details about how this participant is involved"),
		creativePrompts: (s) => s.describe("Ideas for using this participant"),
		description: (s) => s.describe("Description of the participant's involvement"),
		gmNotes: (s) => s.describe("GM-only notes about this participant"),
		tags: (s) => s.describe("Tags for this participant involvement"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how NPCs and factions are involved in quests")
		.refine((data) => (data.npcId !== undefined) !== (data.factionId !== undefined), {
			message: "Either npcId or factionId must be provided, but not both",
			path: ["npcId", "factionId"],
		}),
} as const satisfies Schema<TableNames[number]>
