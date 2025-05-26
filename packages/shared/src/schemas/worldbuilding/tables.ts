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

const worldConnectionTypes = [
	"represents",
	"originates_from",
	"influences",
	"conflicts_with",
	"explores",
	"embodies",
	"threatens",
] as const

// Regional significance levels
const regionalSignificance = [
	"primary",
	"secondary",
	"historical_origin",
	"significant_influence",
	"peripheral",
] as const

const factionRelationshipTypes = [
	"representative_of",
	"influenced_by",
	"opposed_by",
	"founded_by",
	"threatens",
	"supports",
	"related_to",
] as const

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

	scope: oneOf("scope", conceptScopes),
	status: oneOf("status", conceptStatuses).default("active"),

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

		isBidirectional: boolean("is_bidirectional").default(false),
	},
	(t) => [
		unique().on(t.sourceConceptId, t.targetConceptId, t.relationshipType),
		check("no_self_relationship", sql`${t.sourceConceptId} != ${t.targetConceptId}`),
	],
)

export const conceptRegions = pgTable(
	"concept_regions",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		conceptId: cascadeFk("concept_id", worldConcepts.id),
		regionId: cascadeFk("region_id", regions.id),
		significance: oneOf("significance", regionalSignificance),

		regionalManifestation: nullableString("regional_manifestation"),
	},
	(t) => [unique().on(t.conceptId, t.regionId)],
)

export const conceptFactions = pgTable(
	"concept_factions",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		conceptId: cascadeFk("concept_id", worldConcepts.id),
		factionId: cascadeFk("faction_id", factions.id),
		relationshipType: oneOf("relationship_type", factionRelationshipTypes),

		relationshipStrength: oneOf("relationship_strength", ["weak", "moderate", "strong"] as const),
		relationshipDetails: nullableString("relationship_details"),
	},
	(t) => [unique().on(t.conceptId, t.factionId, t.relationshipType)],
)

export const conceptKeyFigures = pgTable(
	"concept_key_figures",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		conceptId: cascadeFk("concept_id", worldConcepts.id),
		npcId: cascadeFk("npc_id", npcs.id),

		roleInConcept: string("role_in_concept"), // "Founder", "Key opponent", "Living embodiment", "Historical figure"
		significance: oneOf("significance", ["minor", "supporting", "major", "central"] as const),

		// Context of their involvement
		involvementDetails: nullableString("involvement_details"),
	},
	(t) => [unique().on(t.conceptId, t.npcId)],
)

export const conceptWorldConnections = pgTable("concept_world_connections", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id),

	conflictId: nullableFk("conflict_id", majorConflicts.id),
	questId: nullableFk("quest_id", quests.id),

	connectionType: oneOf("connection_type", worldConnectionTypes),
	connectionStrength: oneOf("connection_strength", ["weak", "moderate", "strong"] as const),
	connectionDetails: nullableString("connection_details"),
})

export const culturalGroups = pgTable("cultural_groups", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id).unique(),
	socialStructure: string("social_structure"),
	coreValues: list("core_values"),
	traditions: list("traditions"),
	languages: list("languages"),
	adaptationStrategies: list("adaptation_strategies"),

	modernChallenges: list("modern_challenges"),
	culturalEvolution: list("cultural_evolution"),
})

export const historicalPeriods = pgTable("historical_periods", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id).unique(),
	definingCharacteristics: list("defining_characteristics"),
	majorEvents: list("major_events"),
	lastingInstitutions: list("lasting_institutions"),
	conflictingNarratives: list("conflicting_narratives"),
	historicalGrievances: list("historical_grievances"),

	endingCauses: list("ending_causes"),
	historicalLessons: list("historical_lessons"),
})

export const socialInstitutions = pgTable("social_institutions", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id).unique(),

	purpose: string("purpose"),
	structure: string("structure"),
	membership: list("membership"),
	rules: list("rules"),
	traditions: list("traditions"),
	modernAdaptations: list("modern_adaptations"),

	currentEffectiveness: oneOf("current_effectiveness", [
		"failing",
		"struggling",
		"stable",
		"thriving",
		"dominant",
	] as const),
	institutionalChallenges: list("institutional_challenges"),
})

export const enums = {
	conceptTypes,
	conceptScopes,
	complexityProfiles,
	moralClarity,
	conceptStatuses,
	conceptRelationshipTypes,
	worldConnectionTypes,
	regionalSignificance,
	factionRelationshipTypes,
}
