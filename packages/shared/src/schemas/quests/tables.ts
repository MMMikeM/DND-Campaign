// quests/tables.ts
import { boolean, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { impactSeverity, trustLevel } from "../common"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { regions, sites } from "../regions/tables"

const questTypes = ["main", "side", "faction", "character", "generic"] as const
const urgencies = ["background", "developing", "urgent", "critical"] as const
const visibilities = ["hidden", "rumored", "known", "featured"] as const
const dependencyTypes = ["prerequisite", "sequel", "parallel", "alternative", "hidden_connection"] as const
const twistTypes = ["reversal", "revelation", "betrayal", "complication"] as const
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

// Quest-owned association enums
const npcRoles = ["quest_giver", "ally", "antagonist", "guide", "bystander", "target", "victim", "resource"] as const
const importanceLevels = ["minor", "supporting", "major", "critical"] as const
const factionRoles = ["quest_giver", "antagonist", "ally", "target", "beneficiary", "obstacle", "resource"] as const
const introductionTypes = ["rumor", "npc_interaction", "location_discovery"] as const
const presentationStyles = ["subtle", "clear", "urgent", "mysterious"] as const

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
	embeddingId: nullableFk("embedding_id", embeddings.id),
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

	stage_importance: oneOf("importance", ["minor_step", "standard", "major_point", "climax_point"] as const).default(
		"standard",
	),

	embeddingId: nullableFk("embedding_id", embeddings.id),
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

		// Optional explicit Try/Fail support
		failure_leads_to_retry: boolean("failure_leads_to_retry").default(false),
		failure_lesson_learned: string("failure_lesson_learned"),
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
		severity: oneOf("severity", impactSeverity),
		visibility: oneOf("visibility", outcomeVisibility),
		delayFactor: oneOf("delay_factor", outcomeDelay),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.outcomeType, t.decisionId)],
)

// Quest-owned association tables (moved from associations/)
export const questNpcRoles = pgTable(
	"quest_npc_roles",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		npcId: cascadeFk("npc_id", npcs.id),
		role: oneOf("role", npcRoles),
		importance: oneOf("importance", importanceLevels),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
		dramaticMoments: list("dramatic_moments"),
		hiddenAspects: list("hidden_aspects"),
	},
	(t) => [unique().on(t.questId, t.npcId, t.role)],
)

export const questFactionInvolvement = pgTable(
	"quest_faction_involvement",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		factionId: cascadeFk("faction_id", factions.id),
		role: oneOf("role", factionRoles),
		interest: list("interest"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.questId, t.factionId)],
)

export const questIntroductions = pgTable(
	"quest_introductions",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		stageId: cascadeFk("stage_id", questStages.id),

		// Location context
		siteId: nullableFk("site_id", sites.id),
		factionId: nullableFk("faction_id", factions.id),

		// Introduction details
		source: string("source"),
		introductionType: oneOf("introduction_type", introductionTypes),
		presentationStyle: oneOf("presentation_style", presentationStyles),

		// Content
		description: list("description"),
		hookContent: list("hook_content"),
		discoveryConditions: list("discovery_conditions"),

		// NPC delivery (consolidated from questHookNpcs)
		deliveryNpcId: nullableFk("delivery_npc_id", npcs.id),
		npcRelationship: string("npc_relationship"),
		trustRequired: oneOf("trust_required", trustLevel),
		dialogueHint: string("dialogue_hint"),

		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.questId, t.stageId, t.siteId, t.factionId)],
)

export const enums = {
	conditionTypes,
	decisionTypes,
	dependencyTypes,
	impactSeverity,
	importance,
	outcomeDelay,
	outcomeSeverity: impactSeverity,
	outcomeTypes,
	outcomeVisibility,
	questTypes,
	twistTypes,
	unlockConditionTypes,
	urgencies,
	visibilities,
	// Quest-owned association enums
	npcRoles,
	importanceLevels,
	factionRoles,
	introductionTypes,
	presentationStyles,
	trustLevels: trustLevel,
}
