// quests/tables/ts
import { sqliteTable, integer, unique } from "drizzle-orm/sqlite-core"
import { cascadeFk, nullableFk, list, oneOf, pk, string } from "../../db/utils"
import { locations, regions } from "../regions/tables"

const questTypes = ["main", "side", "faction", "character", "generic"] as const

export const quests = sqliteTable("quests", {
	id: pk(),
	name: string("name").unique(),
	regionId: nullableFk("region_id", regions.id),
	type: oneOf("type", questTypes),
	urgency: oneOf("urgency", ["background", "developing", "urgent", "critical"]),
	visibility: oneOf("visibility", ["hidden", "rumored", "known", "featured"]),
	mood: string("mood"),

	description: list("description"),
	creativePrompts: list("creative_prompts"),
	failureOutcomes: list("failure_outcomes"),
	successOutcomes: list("success_outcomes"),
	objectives: list("objectives"),
	rewards: list("rewards"),
	themes: list("themes"),
	inspirations: list("inspirations"),
})

// Primary relationship table between quests
export const questRelations = sqliteTable(
	"quest_relations",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		relatedQuestId: nullableFk("related_quest_id", quests.id),
		relationType: oneOf("relation_type", [
			"prerequisite",
			"sequel",
			"parallel",
			"alternative",
			"hidden_connection",
		]),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.questId, t.relatedQuestId)],
)

export const questUnlockConditions = sqliteTable("quest_unlock_conditions", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id), // Changed from relationId
	conditionType: oneOf("condition_type", [
		"item_possession",
		"party_member",
		"prior_decision",
		"faction_reputation",
		"character_attribute",
		"skill_threshold",
		"quest_outcome",
	]),
	conditionDetails: string("condition_details"),
	importance: oneOf("importance", ["critical", "recommended", "optional"]),
})

export const questTwists = sqliteTable("quest_twists", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id),
	twist_type: oneOf("twist_type", ["reversal", "revelation", "betrayal", "complication"]),
	impact: oneOf("impact", ["minor", "moderate", "major"]),
	narrative_placement: oneOf("narrative_placement", ["early", "middle", "climax", "denouement"]),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
})

export const questStages = sqliteTable("quest_stages", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id),
	locationId: nullableFk("location_id", locations.id),
	stage: integer("stage").notNull(),
	name: string("name").unique(),
	dramatic_question: string("dramatic_question"),

	description: list("description"),
	creativePrompts: list("creative_prompts"),
	objectives: list("objectives"),
	completionPaths: list("completion_paths"),
	encounters: list("encounters"),
	dramatic_moments: list("dramatic_moments"),
	sensory_elements: list("sensory_elements"),
})

// Stage decisions now directly connect stages together
export const stageDecisions = sqliteTable(
	"stage_decisions",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		fromStageId: cascadeFk("from_stage_id", questStages.id),
		toStageId: nullableFk("to_stage_id", questStages.id),
		conditionType: oneOf("condition_type", [
			"choice",
			"skill_check",
			"item",
			"npc_relation",
			"faction",
			"time",
			"combat",
			"custom_event",
		]),
		decision_type: oneOf("decision_type", [
			"moral_choice",
			"tactical_decision",
			"resource_allocation",
			"trust_test",
			"sacrifice_opportunity",
			"identity_question",
		]),

		name: string("name"),
		conditionValue: string("condition_value"),

		successDescription: list("success_description"),
		failureDescription: list("failure_description"),
		narrativeTransition: list("narrative_transition"),
		potential_player_reactions: list("potential_player_reactions"),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
		options: list("options"),
	},
	(t) => [unique().on(t.questId, t.fromStageId, t.toStageId)],
)

// Consequences are now linked to decisions instead of stages
export const decisionConsequences = sqliteTable(
	"decision_consequences",
	{
		id: pk(),
		decisionId: cascadeFk("decision_id", stageDecisions.id), // The decision that triggers this consequence
		affectedStageId: nullableFk("affected_stage_id", questStages.id), // Which stage this consequence affects (can be different from toStageId)
		consequence_type: oneOf("consequence_type", [
			"character_reaction",
			"world_state_change",
			"relationship_change",
			"quest_availability",
			"item_acquisition",
			"reputation_change",
		]),
		severity: oneOf("severity", ["minor", "moderate", "major"]),
		visibility: oneOf("visibility", ["obvious", "subtle", "hidden"]),
		// Consequence attributes
		delay_factor: string("delay_factor"), // "immediate", "next session", "later in campaign"

		// Consequence details
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.consequence_type, t.decisionId)],
)
