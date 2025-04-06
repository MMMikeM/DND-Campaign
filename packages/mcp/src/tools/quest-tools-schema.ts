import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { optionalId } from "./tool.utils"
import { QuestTools } from "./quest-tools"

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

export const schemas = {
	get_all_quests: z.object({}).describe("Get all quests"),
	get_quest_by_id: z.object({ id: z.number().describe("Get a specific quest by ID") }),
	get_quest_stages: z.object({ id: z.number().describe("Get all stages for a specific quest") }),
	manage_quests: createInsertSchema(quests, {
		id: optionalId.describe("The ID of the quest to update (omit to create new)"),
		description: (s) => s.describe("Core narrative elements, background context, and storyline in point form"),
		creativePrompts: (s) =>
			s.describe("Ideas for plot developments, player involvement opportunities, and adaptation suggestions"),
		failureOutcomes: (s) =>
			s.describe("Consequences, world changes, and follow-up events if players fail to complete the quest"),
		successOutcomes: (s) =>
			s.describe("Results, rewards, and world changes that occur when players successfully complete the quest"),
		objectives: (s) => s.describe("Specific tasks, goals, and achievements players must accomplish to progress"),
		rewards: (s) => s.describe("Items, currency, information, reputation, and other benefits for quest completion"),
		themes: (s) => s.describe("Underlying motifs, concepts, and emotional elements explored in this narrative"),
		inspirations: (s) =>
			s.describe("Reference materials, tropes, or existing stories that influenced this quest design"),
		regionId: (s) =>
			s.optional().describe("The ID of the region where this quest primarily takes place (references regions.id)"),
		name: (s) => s.describe("The title or identifier for this quest that may be revealed to players"),
		mood: (s) => s.describe("The emotional tone and atmosphere this quest is designed to evoke"),
		type: (s) =>
			s.describe("The quest's significance to the overall campaign (main, side, faction, character, generic)"),
		urgency: (s) => s.describe("Time pressure associated with the quest (background, developing, urgent, critical)"),
		visibility: (s) =>
			s.describe("How well-known this quest is to players and the world (hidden, rumored, known, featured)"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A mission, storyline, or adventure with objectives for players to accomplish"),

	manage_quest_dependencies: createInsertSchema(questDependencies, {
		id: optionalId.describe("The ID of the relationship to update (omit to create new)"),
		description: (s) => s.describe("How these quests interconnect narratively and mechanically in point form"),
		creativePrompts: (s) => s.describe("Ideas for emphasizing connections and transitions between these quests"),
		questId: (s) => s.describe("The ID of the primary quest in this relationship (references quests.id)"),
		relatedQuestId: (s) =>
			s.optional().describe("The ID of the secondary quest in this relationship (references quests.id)"),
		dependencyType: (s) =>
			s.describe("How these quests connect (prerequisite, sequel, parallel, alternative, hidden_connection)"),
	})
		.strict()
		.describe("A narrative or mechanical connection between two quests"),

	manage_quest_unlock_conditions: createInsertSchema(questUnlockConditions, {
		id: optionalId.describe("The ID of the unlock condition to update (omit to create new)"),
		questId: (s) => s.describe("The ID of the quest this condition applies to (references quests.id)"),
		conditionDetails: (s) => s.describe("Specific requirements, thresholds, or criteria that must be met"),
		conditionType: (s) =>
			s.describe(
				"Category of prerequisite (item_possession, party_member, prior_decision, faction_reputation, character_attribute, skill_threshold, quest_outcome)",
			),
		importance: (s) => s.describe("Whether this condition is essential or optional (critical, recommended, optional)"),
	})
		.strict()
		.describe("Requirements that must be met before a quest becomes available to players"),

	manage_quest_stages: createInsertSchema(questStages, {
		id: optionalId.describe("The ID of the quest stage to update (omit to create new)"),
		description: (s) =>
			s.describe("Key events, NPCs, and plot developments that occur during this segment in point form"),
		creativePrompts: (s) =>
			s.describe("Ideas for running this stage effectively or adapting it to different player approaches"),
		objectives: (s) => s.describe("Specific goals or tasks players need to complete in this stage"),
		completionPaths: (s) => s.describe("Different methods or approaches players might use to finish this stage"),
		encounters: (s) => s.describe("Specific challenges, combats, or social interactions that occur in this stage"),
		dramatic_moments: (s) => s.describe("Key emotional or high-tension scenes that define this stage of the quest"),
		sensory_elements: (s) => s.describe("Descriptive details for sight, sound, smell, etc. to enhance immersion"),
		questId: (s) => s.describe("The ID of the parent quest this stage belongs to (references quests.id)"),
		stage: (s) => s.describe("The numerical order or sequence position of this stage within the quest"),
		locationId: (s) =>
			s.optional().describe("The ID of the location where this stage takes place (references locations.id)"),
		dramatic_question: (s) => s.describe("The central conflict, mystery, or tension that drives this stage forward"),
		name: (s) => s.describe("The title or identifier for this specific segment of the quest"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A discrete segment or chapter within a larger quest"),

	manage_stage_decisions: createInsertSchema(stageDecisions, {
		id: optionalId.describe("The ID of the decision point to update (omit to create new)"),
		successDescription: (s) => s.describe("What happens when players succeed at the check or take the intended path"),
		failureDescription: (s) => s.describe("Consequences when players fail a check or choose a different path"),
		narrativeTransition: (s) => s.describe("How the story progresses based on this decision point"),
		potential_player_reactions: (s) =>
			s.describe("Likely player responses, questions, or emotional reactions to this moment"),
		description: (s) => s.describe("The choice, challenge, or dilemma presented to players in point form"),
		creativePrompts: (s) =>
			s.describe("Ideas for presenting this decision dramatically or adapting to unexpected choices"),
		options: (s) => s.describe("The explicit choices or paths available to players at this juncture"),
		name: (s) => s.describe("An identifier or title for this pivotal moment"),
		decision_type: (s) =>
			s.describe(
				"The nature of the choice (moral_choice, tactical_decision, resource_allocation, trust_test, sacrifice_opportunity, identity_question)",
			),
		questId: (s) => s.describe("The ID of the quest this decision belongs to (references quests.id)"),
		fromStageId: (s) => s.describe("The ID of the stage where this decision occurs (references questStages.id)"),
		toStageId: (s) =>
			s.optional().describe("The ID of the stage this decision leads to if taken (references questStages.id)"),
		conditionType: (s) =>
			s.describe(
				"What triggers or resolves this decision (choice, skill_check, item, npc_relation, faction, time, combat, custom_event)",
			),
		conditionValue: (s) => s.describe("Specific parameters, DCs, or requirements for this condition"),
	})
		.strict()
		.describe("A choice, challenge, or branching point within a quest stage"),

	manage_decision_outcomes: createInsertSchema(decisionOutcomes, {
		id: optionalId.describe("The ID of the consequence to update (omit to create new)"),
		description: (s) =>
			s.describe("Detailed explanation of how this consequence manifests in the game world in point form"),
		creativePrompts: (s) => s.describe("Ideas for representing this consequence meaningfully to players"),
		outcomeType: (s) =>
			s.describe(
				"The nature of the effect (character_reaction, world_state_change, relationship_change, quest_availability, item_acquisition, reputation_change)",
			),
		delayFactor: (s) =>
			s.describe("When this consequence occurs (immediate, next session, specific trigger, later in campaign)"),
		affectedStageId: (s) =>
			s.optional().describe("The ID of a quest stage impacted by this consequence (references questStages.id)"),
		decisionId: (s) =>
			s.describe("The ID of the decision that triggers this consequence (references stageDecisions.id)"),
		severity: (s) => s.describe("The magnitude of the impact (minor, moderate, major)"),
		visibility: (s) => s.describe("How apparent this consequence is to players (obvious, subtle, hidden)"),
	})
		.strict()
		.describe("A lasting effect or outcome resulting from a player decision"),

	manage_quest_twists: createInsertSchema(questTwists, {
		id: optionalId.describe("The ID of the twist to update (omit to create new)"),
		description: (s) => s.describe("The revelation, surprise, or unexpected development in detail in point form"),
		creativePrompts: (s) => s.describe("Ideas for foreshadowing, revealing, or maximizing the impact of this twist"),
		questId: (s) => s.describe("The ID of the quest this twist belongs to (references quests.id)"),
		impact: (s) => s.describe("How significantly this changes the quest narrative (minor, moderate, major)"),
		narrative_placement: (s) => s.describe("When in the quest this twist occurs (early, middle, climax, denouement)"),
		twist_type: (s) => s.describe("The nature of the surprise (reversal, revelation, betrayal, complication)"),
	})
		.strict()
		.describe("An unexpected development, revelation, or subversion within a quest"),
} satisfies Record<QuestTools, z.ZodSchema<unknown>>
