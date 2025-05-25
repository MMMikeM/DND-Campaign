// worldbuilding/tables.ts
import { integer, pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"

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

export const worldConcepts = pgTable("world_concepts", {
	id: pk(),
	name: string("name").unique(),

	// Enhanced type system
	conceptType: oneOf("concept_type", conceptTypes),

	// Temporal context
	timeframe: string("timeframe"), // "Ancient", "Recent", "Ongoing"
	startYear: integer("start_year"),
	endYear: integer("end_year"), // null if ongoing

	// Geographic and social scope
	scope: oneOf("scope", conceptScopes),
	primaryRegions: list("primary_regions"),

	// Core description
	summary: string("summary"),
	details: list("details"),
	modernRelevance: string("modern_relevance"),

	// Cultural group properties (when conceptType = "cultural_group")
	socialStructure: string("social_structure"),
	coreValues: list("core_values"),
	traditions: list("traditions"),
	languages: list("languages"),

	// Historical period properties (when conceptType = "historical_period")
	definingCharacteristics: list("defining_characteristics"),
	majorEvents: list("major_events"),
	keyFigures: list("key_figures"),
	lastingInstitutions: list("lasting_institutions"),
	conflictingNarratives: list("conflicting_narratives"),

	// Relationships
	relatedFactions: list("related_factions"),
	representativeFactions: list("representative_factions"),
	allies: list("allies"), // Other concept IDs
	rivals: list("rivals"), // Other concept IDs
	historicalGrievances: list("historical_grievances"),

	// Cross-references and impact
	causedBy: list("caused_by"), // Other concept IDs that led to this
	ledTo: list("led_to"), // Other concept IDs this caused
	questHooks: list("quest_hooks"),

	// Modern context
	currentChallenges: list("current_challenges"),
	adaptationStrategies: list("adaptation_strategies"),
	modernConsequences: list("modern_consequences"),

	creativePrompts: list("creative_prompts"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const enums = {
	conceptTypes,
	conceptScopes,
}
