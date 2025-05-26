// quests/tables.ts
import { boolean, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { regions, sites } from "../regions/tables"
import { trustLevels } from "../shared-enums"

const questTypes = ["main", "side", "faction", "character", "generic"] as const
const urgencyLevels = ["background", "developing", "urgent", "critical"] as const
const visibilityLevels = ["hidden", "rumored", "known", "featured"] as const
const relationshipTypes = ["prerequisite", "sequel", "parallel", "alternative", "hidden_connection"] as const
const unlockImportanceLevels = ["critical", "recommended", "optional"] as const
const participantImportanceLevels = ["minor", "supporting", "major", "critical"] as const
const stageImportanceLevels = ["minor_step", "standard", "major_point", "climax_point"] as const
const hookTypes = ["rumor", "npc_interaction", "location_discovery"] as const
const presentationStyles = ["subtle", "clear", "urgent", "mysterious"] as const
const npcRoles = ["quest_giver", "ally", "antagonist", "guide", "bystander", "target", "victim", "resource"] as const
const factionRoles = ["quest_giver", "antagonist", "ally", "target", "beneficiary", "obstacle", "resource"] as const
const moralSpectrumFocus = ["clear_right_wrong", "contextual_dilemma", "true_ambiguity"] as const
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

const pacingRoles = [
	"tension_builder",
	"release_valve",
	"investigative_slow_burn",
	"action_peak",
	"character_development_focus",
] as const

const playerExperienceGoals = [
	"heroism_clarity",
	"challenging_dilemma",
	"mystery_solving",
	"exploration_discovery",
	"social_intrigue",
	"emotional_impact",
] as const

const stageTypes = [
	"revelation_point",
	"decision_point",
	"consequence_point",
	"character_point",
	"simple_challenge_point",
	"rest_interaction_point",
	"setup_foreshadowing",
] as const

const complexityLevels = ["low_complexity_breather", "medium_complexity_standard", "high_complexity_peak"] as const
const ambiguityLevels = [
	"clear_best_option_obvious_tradeoff",
	"balanced_valid_options",
	"truly_ambiguous_no_clear_right",
] as const

export const quests = pgTable("quests", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	regionId: nullableFk("region_id", regions.id),
	type: oneOf("type", questTypes),
	urgency: oneOf("urgency", urgencyLevels),
	visibility: oneOf("visibility", visibilityLevels),
	mood: string("mood"),

	moralSpectrumFocus: oneOf("moral_spectrum_focus", moralSpectrumFocus),
	intendedPacingRole: oneOf("intended_pacing_role", pacingRoles),
	primaryPlayerExperienceGoal: oneOf("primary_player_experience_goal", playerExperienceGoals),

	failureOutcomes: list("failure_outcomes"),
	successOutcomes: list("success_outcomes"),
	objectives: list("objectives"),
	rewards: list("rewards"),
	themes: list("themes"),
	inspirations: list("inspirations"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

// Renamed for semantic clarity
export const questRelationships = pgTable(
	"quest_relationships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		relatedQuestId: nullableFk("related_quest_id", quests.id),
		relationshipType: oneOf("relationship_type", relationshipTypes),
	},
	(t) => [unique().on(t.questId, t.relatedQuestId)],
)

export const questUnlockConditions = pgTable("quest_unlock_conditions", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	questId: cascadeFk("quest_id", quests.id),
	conditionType: oneOf("condition_type", unlockConditionTypes),
	conditionDetails: string("condition_details"),
	importance: oneOf("importance", unlockImportanceLevels),
})

export const questNpcInvolvement = pgTable(
	"quest_npc_involvement",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		npcId: cascadeFk("npc_id", npcs.id),
		role: oneOf("role", npcRoles),
		importance: oneOf("importance", participantImportanceLevels),
		dramaticMoments: list("dramatic_moments"),
		hiddenAspects: list("hidden_aspects"),
	},
	(t) => [unique().on(t.questId, t.npcId, t.role)],
)

export const questFactionInvolvement = pgTable(
	"quest_faction_involvement",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		factionId: cascadeFk("faction_id", factions.id),
		role: oneOf("role", factionRoles),
		involvementReasons: list("involvement_reasons"),
	},
	(t) => [unique().on(t.questId, t.factionId)],
)

export const questHooks = pgTable(
	"quest_hooks",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),

		// Where the hook appears
		siteId: nullableFk("site_id", sites.id),
		factionId: nullableFk("faction_id", factions.id),

		// Hook details
		source: string("source"), // "tavern gossip", "notice board", etc.
		hookType: oneOf("hook_type", hookTypes),
		presentationStyle: oneOf("presentation_style", presentationStyles),

		// Content
		hookContent: list("hook_content"),
		discoveryConditions: list("discovery_conditions"),

		// NPC delivery (if applicable)
		deliveryNpcId: nullableFk("delivery_npc_id", npcs.id),
		// Clarified field name
		npcRelationshipToParty: string("npc_relationship_to_party"),
		trustRequired: oneOf("trust_required", trustLevels),
		dialogueHint: string("dialogue_hint"),
	},
	// Fixed: More flexible unique constraint allows multiple hooks from same faction/site
	(t) => [unique().on(t.questId, t.source, t.hookType)],
)

export const questStages = pgTable("quest_stages", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	questId: cascadeFk("quest_id", quests.id),
	siteId: nullableFk("site_id", sites.id),
	// Renamed for clarity about branching vs linear progression
	stageOrder: integer("stage_order").notNull(), // Typical sequence, not strict linear progression
	name: string("name").unique(),
	dramatic_question: string("dramatic_question"),

	stageType: oneOf("stage_type", stageTypes),
	intendedComplexityLevel: oneOf("intended_complexity_level", complexityLevels),

	objectives: list("objectives"),
	completionPaths: list("completion_paths"),
	encounters: list("encounters"),
	dramatic_moments: list("dramatic_moments"),
	sensory_elements: list("sensory_elements"),

	stageImportance: oneOf("stage_importance", stageImportanceLevels).default("standard"),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const stageDecisions = pgTable(
	"stage_decisions",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		fromStageId: cascadeFk("from_stage_id", questStages.id),
		toStageId: nullableFk("to_stage_id", questStages.id),
		conditionType: oneOf("condition_type", conditionTypes),
		decisionType: oneOf("decision_type", decisionTypes),
		name: string("name"),

		ambiguityLevel: oneOf("ambiguity_level", ambiguityLevels),
		conditionValue: string("condition_value"),
		successDescription: list("success_description"),
		failureDescription: list("failure_description"),
		narrativeTransition: list("narrative_transition"),
		potential_player_reactions: list("potential_player_reactions"),
		options: list("options"),

		// Try/Fail support
		failure_leads_to_retry: boolean("failure_leads_to_retry").default(false),
		failure_lesson_learned: string("failure_lesson_learned"),
	},
	(t) => [unique().on(t.questId, t.fromStageId, t.toStageId)],
)

export const enums = {
	ambiguityLevels,
	complexityLevels,
	conditionTypes,
	decisionTypes,
	relationshipTypes,
	factionRoles,
	hookTypes,
	unlockImportanceLevels,
	participantImportanceLevels,
	stageImportanceLevels,
	moralSpectrumFocus,
	npcRoles,
	pacingRoles,
	playerExperienceGoals,
	presentationStyles,
	questTypes,
	stageTypes,
	trustLevels,
	unlockConditionTypes,
	urgencyLevels,
	visibilityLevels,
}
