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

// Relationship types for inter-concept connections
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

// Connection types to world entities
const worldConnectionTypes = [
	"represents", // Faction represents this concept
	"originates_from", // Concept originates from this region/NPC
	"influences", // Concept influences this entity
	"conflicts_with", // Concept conflicts with this entity
	"explores", // Quest explores this concept
	"embodies", // NPC embodies this concept
	"threatens", // Concept threatens this entity
] as const

// Regional significance levels
const regionalSignificance = [
	"primary",
	"secondary",
	"historical_origin",
	"significant_influence",
	"peripheral",
] as const

// Faction relationship types
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
	description: list("description"), // Keep for compatibility, but focus on structured fields below
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	conceptType: oneOf("concept_type", conceptTypes),

	// Philosophy-aligned complexity and revelation structure
	complexityProfile: oneOf("complexity_profile", complexityProfiles),
	moralClarity: oneOf("moral_clarity", moralClarity),

	// Consolidated descriptive approach (addressing field redundancy)
	summary: string("summary"), // 1-2 sentence elevator pitch

	// Structured revelation system (core of Dynamic Realism philosophy)
	surfaceImpression: nullableString("surface_impression"), // What's immediately apparent
	livedRealityDetails: nullableString("lived_reality_details"), // Day-to-day complexity
	hiddenTruthsOrDepths: nullableString("hidden_truths_or_depths"), // Secrets/deeper understanding

	// Additional details for miscellaneous extra info
	additionalDetails: list("additional_details"),

	// Core properties
	scope: oneOf("scope", conceptScopes),
	status: oneOf("status", conceptStatuses).default("active"),

	// Temporal context
	timeframe: string("timeframe"), // "Ancient", "Recent", "Ongoing"
	startYear: integer("start_year"),
	endYear: integer("end_year"), // null if ongoing

	// Modern relevance and impact
	modernRelevance: string("modern_relevance"),
	currentChallenges: list("current_challenges"),
	modernConsequences: list("modern_consequences"),

	// Quest integration
	questHooks: list("quest_hooks"),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

// Replace string-based relationships with proper bidirectional FK relationships
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

		// Details about this specific relationship
		relationshipDetails: nullableString("relationship_details"),
		strength: oneOf("strength", ["weak", "moderate", "strong"] as const),

		// Is this relationship bidirectional or one-way?
		isBidirectional: boolean("is_bidirectional").default(false),
	},
	(t) => [
		unique().on(t.sourceConceptId, t.targetConceptId, t.relationshipType),
		check("no_self_relationship", sql`${t.sourceConceptId} != ${t.targetConceptId}`),
	],
)

// Proper FK relationships to regions (replacing primaryRegions string list)
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

		// How this concept manifests in this region
		regionalManifestation: nullableString("regional_manifestation"),
	},
	(t) => [unique().on(t.conceptId, t.regionId)],
)

// Proper FK relationships to factions (replacing relatedFactions/representativeFactions string lists)
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

		// Details of the relationship
		relationshipStrength: oneOf("relationship_strength", ["weak", "moderate", "strong"] as const),
		relationshipDetails: nullableString("relationship_details"),
	},
	(t) => [unique().on(t.conceptId, t.factionId, t.relationshipType)],
)

// Proper FK relationships to NPCs (replacing keyFigures string list)
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

		// Their role in relation to this concept
		roleInConcept: string("role_in_concept"), // "Founder", "Key opponent", "Living embodiment", "Historical figure"
		significance: oneOf("significance", ["minor", "supporting", "major", "central"] as const),

		// Context of their involvement
		involvementDetails: nullableString("involvement_details"),
	},
	(t) => [unique().on(t.conceptId, t.npcId)],
)

// Link concepts to other world entities (conflicts, quests, etc.)
export const conceptWorldConnections = pgTable("concept_world_connections", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id),

	// What this concept connects to (one will be set per record)
	conflictId: nullableFk("conflict_id", majorConflicts.id),
	questId: nullableFk("quest_id", quests.id),

	connectionType: oneOf("connection_type", worldConnectionTypes),
	connectionStrength: oneOf("connection_strength", ["weak", "moderate", "strong"] as const),
	connectionDetails: nullableString("connection_details"),
})

// Separate tables for concept-type-specific data (addressing conditional field problem)
export const culturalGroups = pgTable("cultural_groups", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id).unique(), // 1:1 with world_concepts where type = 'cultural_group'

	// Cultural group specific properties
	socialStructure: string("social_structure"),
	coreValues: list("core_values"),
	traditions: list("traditions"),
	languages: list("languages"),
	adaptationStrategies: list("adaptation_strategies"),

	// Modern cultural context
	modernChallenges: list("modern_challenges"),
	culturalEvolution: list("cultural_evolution"),
})

export const historicalPeriods = pgTable("historical_periods", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id).unique(), // 1:1 with world_concepts where type = 'historical_period'

	// Historical period specific properties
	definingCharacteristics: list("defining_characteristics"),
	majorEvents: list("major_events"),
	lastingInstitutions: list("lasting_institutions"),
	conflictingNarratives: list("conflicting_narratives"),
	historicalGrievances: list("historical_grievances"),

	// Legacy and aftermath
	endingCauses: list("ending_causes"),
	historicalLessons: list("historical_lessons"),
})

export const socialInstitutions = pgTable("social_institutions", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conceptId: cascadeFk("concept_id", worldConcepts.id).unique(), // 1:1 with world_concepts where type = 'social_institution'

	// Social institution specific properties
	purpose: string("purpose"),
	structure: string("structure"),
	membership: list("membership"),
	rules: list("rules"),
	traditions: list("traditions"),
	modernAdaptations: list("modern_adaptations"),

	// Institutional health and challenges
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
