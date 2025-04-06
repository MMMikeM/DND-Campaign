import { pgTable, unique, integer } from "drizzle-orm/pg-core"
import { cascadeFk, nullableFk, list, oneOf, pk, string, embeddingVector } from "../../db/utils"
import { regions, sites } from "../regions/tables"

const questTypes = ["main", "side", "faction", "character", "generic"] as const
const urgencies = ["background", "developing", "urgent", "critical"] as const
const visibilities = ["hidden", "rumored", "known", "featured"] as const
const dependencyTypes = ["prerequisite", "sequel", "parallel", "alternative", "hidden_connection"] as const
const twistTypes = ["reversal", "revelation", "betrayal", "complication"] as const
const impactSeverity = ["minor", "moderate", "major"] as const
const narrativePlacements = ["early", "middle", "climax", "denouement"] as const
const outcomeSeverity = ["minor", "moderate", "major"] as const
const outcomeVisibility = ["obvious", "subtle", "hidden"] as const
const outcomeDelay = ["immediate", "next_session", "specific_trigger", "later_in_campaign"] as const
const importance = ["critical", "recommended", "optional"] as const
const unlockConditionTypes = [
	"item_possession",
	"party_member",
	"prior_decision",
	"faction_reputation",
	"character_attribute",
	"skill_threshold",
	"quest_outcome",
] as const
const decisionTypes = [
	"moral_choice",
	"tactical_decision",
	"resource_allocation",
	"trust_test",
	"sacrifice_opportunity",
	"identity_question",
] as const
const conditionTypes = [
	"choice",
	"skill_check",
	"item",
	"npc_relation",
	"faction",
	"time",
	"combat",
	"custom_event",
] as const
const outcomeTypes = [
	"character_reaction",
	"world_state_change",
	"relationship_change",
	"quest_availability",
	"item_acquisition",
	"reputation_change",
] as const

export const quests = pgTable("quests", {
	id: pk(),
	name: string("name").unique(),
	regionId: nullableFk("region_id", regions.id),
	type: oneOf("type", questTypes),
	urgency: oneOf("urgency", urgencies),
	visibility: oneOf("visibility", visibilities),
	mood: string("mood"),

	description: list("description"),
	creativePrompts: list("creative_prompts"),
	failureOutcomes: list("failure_outcomes"),
	successOutcomes: list("success_outcomes"),
	objectives: list("objectives"),
	rewards: list("rewards"),
	themes: list("themes"),
	inspirations: list("inspirations"),
	embedding: embeddingVector("embedding"),
})

export const questDependencies = pgTable(
	"quest_dependencies",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		relatedQuestId: nullableFk("related_quest_id", quests.id),
		dependencyType: oneOf("dependency_type", dependencyTypes),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.questId, t.relatedQuestId)],
)

export const questUnlockConditions = pgTable("quest_unlock_conditions", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id),
	conditionType: oneOf("condition_type", unlockConditionTypes),
	conditionDetails: string("condition_details"),
	importance: oneOf("importance", importance),
})

export const questTwists = pgTable("quest_twists", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id),
	twistType: oneOf("twist_type", twistTypes),
	impact: oneOf("impact", impactSeverity),
	narrativePlacement: oneOf("narrative_placement", narrativePlacements),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
})

export const questStages = pgTable("quest_stages", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id),
	siteId: nullableFk("site_id", sites.id),
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
	embedding: embeddingVector("embedding"),
})

export const stageDecisions = pgTable(
	"stage_decisions",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		fromStageId: cascadeFk("from_stage_id", questStages.id),
		toStageId: nullableFk("to_stage_id", questStages.id),
		conditionType: oneOf("condition_type", conditionTypes),
		decisionType: oneOf("decision_type", decisionTypes),
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

export const decisionOutcomes = pgTable(
	"decision_outcomes",
	{
		id: pk(),
		decisionId: cascadeFk("decision_id", stageDecisions.id),
		affectedStageId: nullableFk("affected_stage_id", questStages.id),
		outcomeType: oneOf("outcome_type", outcomeTypes),
		severity: oneOf("severity", outcomeSeverity),
		visibility: oneOf("visibility", outcomeVisibility),
		delayFactor: oneOf("delay_factor", outcomeDelay),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.outcomeType, t.decisionId)],
)

export const enums = {
	conditionTypes,
	decisionTypes,
	dependencyTypes,
	impactSeverity,
	importance,
	narrativePlacements,
	outcomeDelay,
	outcomeSeverity,
	outcomeTypes,
	outcomeVisibility,
	questTypes,
	twistTypes,
	unlockConditionTypes,
	urgencies,
	visibilities,
}
