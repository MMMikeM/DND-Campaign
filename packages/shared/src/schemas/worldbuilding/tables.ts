// worldbuilding/tables.ts
import { sql } from "drizzle-orm"
import { boolean, check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"

const conceptScopes = ["local", "regional", "continental", "world"] as const
const conceptTypes = [
	"cultural",
	"political",
	"religious",
	"natural",
	"mythic",
	"cultural_group",
	"historical_period",
	"social_institution",
] as const
const complexityProfiles = ["simple_clear", "layered_nuance", "deep_mystery"] as const
const moralClarity = ["clear_good_evil_spectrum", "contextual_grey", "inherently_ambiguous"] as const
const conceptStatuses = ["historical", "active", "emerging", "declining", "dormant"] as const

const conceptRelationshipTypes = [
	"allies",
	"rivals",
	"caused_by",
	"led_to",
	"influenced_by",
	"parallels",
	"opposes",
	"evolved_from",
	"prerequisite_for",
	"supports",
	"undermines",
] as const

// Suggested enum for link strength
const conceptLinkStrengths = ["tenuous", "moderate", "strong", "defining"] as const

export const worldConcepts = pgTable("world_concepts", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	conceptType: oneOf("concept_type", conceptTypes),

	complexityProfile: oneOf("complexity_profile", complexityProfiles),
	moralClarity: oneOf("moral_clarity", moralClarity),

	summary: string("summary"),

	surfaceImpression: nullableString("surface_impression"),
	livedRealityDetails: nullableString("lived_reality_details"),
	hiddenTruthsOrDepths: nullableString("hidden_truths_or_depths"),

	additionalDetails: list("additional_details"),
	socialStructure: nullableString("social_structure"),
	coreValues: list("core_values"),
	traditions: list("traditions"),
	languages: list("languages"),
	adaptationStrategies: list("adaptation_strategies"),
	definingCharacteristics: list("defining_characteristics"),
	majorEvents: list("major_events"),
	lastingInstitutions: list("lasting_institutions"),
	conflictingNarratives: list("conflicting_narratives"),
	historicalGrievances: list("historical_grievances"),
	endingCauses: list("ending_causes"),
	historicalLessons: list("historical_lessons"),
	purpose: nullableString("purpose"),
	structure: nullableString("structure"),
	membership: list("membership"),
	rules: list("rules"),
	modernAdaptations: list("modern_adaptations"),
	currentEffectiveness: oneOf("current_effectiveness", [
		"failing",
		"struggling",
		"stable",
		"thriving",
		"dominant",
	] as const),
	institutionalChallenges: list("institutional_challenges"),
	culturalEvolution: list("cultural_evolution"),

	scope: oneOf("scope", conceptScopes),
	status: oneOf("status", conceptStatuses),

	timeframe: string("timeframe"),
	startYear: integer("start_year"),
	endYear: integer("end_year"),

	modernRelevance: string("modern_relevance"),
	currentChallenges: list("current_challenges"),
	modernConsequences: list("modern_consequences"),

	questHooks: list("quest_hooks"),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const conceptRelationships = pgTable(
	"concept_relationships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		sourceConceptId: cascadeFk("source_concept_id", worldConcepts.id),
		targetConceptId: cascadeFk("target_concept_id", worldConcepts.id),
		relationshipType: oneOf("relationship_type", conceptRelationshipTypes),

		relationshipDetails: nullableString("relationship_details"),
		strength: oneOf("strength", ["weak", "moderate", "strong"] as const),
		isBidirectional: boolean("is_bidirectional"),
	},
	(t) => [
		unique().on(t.sourceConceptId, t.targetConceptId, t.relationshipType),
		check("no_self_relationship", sql`${t.sourceConceptId} != ${t.targetConceptId}`),
	],
)

export const worldConceptLinks = pgTable(
	"world_concept_links",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		conceptId: cascadeFk("concept_id", worldConcepts.id),

		regionId: nullableFk("region_id", regions.id),
		factionId: nullableFk("faction_id", factions.id),
		npcId: nullableFk("npc_id", npcs.id),
		conflictId: nullableFk("conflict_id", majorConflicts.id),
		questId: nullableFk("quest_id", quests.id),

		linkRoleOrTypeText: string("link_role_or_type_text"),
		linkStrength: oneOf("link_strength", conceptLinkStrengths),
		linkDetailsText: string("link_details_text"),
	},
	(t) => [
		check(
			"chk_world_concept_link_has_target",
			sql`
			${t.regionId} IS NOT NULL OR
			${t.factionId} IS NOT NULL OR
			${t.npcId} IS NOT NULL OR
			${t.conflictId} IS NOT NULL OR
			${t.questId} IS NOT NULL
		`,
		),
	],
)

export const enums = {
	conceptTypes,
	conceptScopes,
	complexityProfiles,
	moralClarity,
	conceptStatuses,
	conceptRelationshipTypes,
	conceptLinkStrengths, // Added new enum to exports
}
