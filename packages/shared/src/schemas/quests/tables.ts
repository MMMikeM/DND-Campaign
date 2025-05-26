// quests/tables.ts
import { type AnyPgColumn, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { regions, sites } from "../regions/tables"
import { trustLevels } from "../shared-enums"
import * as stageModule from "./stages/tables"

const { enums: stageEnums, questStages, stageDecisions } = stageModule

export { questStages, stageDecisions }

const questTypes = ["main", "side", "faction", "character", "generic"] as const
const urgencyLevels = ["background", "developing", "urgent", "critical"] as const
const visibilityLevels = ["hidden", "rumored", "known", "featured"] as const
const relationshipTypes = ["prerequisite", "sequel", "parallel", "alternative", "hidden_connection"] as const
const unlockImportanceLevels = ["critical", "recommended", "optional"] as const
const participantImportanceLevels = ["minor", "supporting", "major", "critical"] as const
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

	prerequisiteQuestId: integer("parent_id").references((): AnyPgColumn => quests.id),
	otherUnlockConditionsNotes: nullableString("other_unlock_conditions_notes"),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

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

export const questHooks = pgTable(
	"quest_hooks",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		siteId: nullableFk("site_id", sites.id),
		factionId: nullableFk("faction_id", factions.id),
		source: string("source"),
		hookType: oneOf("hook_type", hookTypes),
		presentationStyle: oneOf("presentation_style", presentationStyles),
		hookContent: list("hook_content"),
		discoveryConditions: list("discovery_conditions"),
		deliveryNpcId: nullableFk("delivery_npc_id", npcs.id),
		npcRelationshipToParty: string("npc_relationship_to_party"),
		trustRequired: oneOf("trust_required", trustLevels),
		dialogueHint: string("dialogue_hint"),
	},
	(t) => [unique().on(t.questId, t.source, t.hookType)],
)

export const questParticipantInvolvement = pgTable("quest_participant_involvement", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	questId: cascadeFk("quest_id", quests.id),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),
	roleInQuest: string("role_in_quest"),
	importanceInQuest: oneOf("importance_in_quest", participantImportanceLevels),
	involvementDetails: list("involvement_details"),
})

export const enums = {
	...stageEnums,
	relationshipTypes,
	factionRoles,
	hookTypes,
	unlockImportanceLevels,
	participantImportanceLevels,
	moralSpectrumFocus,
	npcRoles,
	pacingRoles,
	playerExperienceGoals,
	presentationStyles,
	questTypes,
	trustLevels,
	unlockConditionTypes,
	urgencyLevels,
	visibilityLevels,
}
