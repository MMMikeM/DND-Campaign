// world-concepts/tables.ts
import { sql } from "drizzle-orm"
import { check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const {
	complexityProfiles,
	conceptLinkStrengths,
	conceptRelationshipTypes,
	conceptScopes,
	conceptStatuses,
	conceptTypes,
	moralClarity,
	currentEffectivenessLevels,
	targetEntityTypes,
} = enums

export const worldConcepts = pgTable("world_concepts", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

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
	currentEffectiveness: oneOf("current_effectiveness", currentEffectivenessLevels),
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
})

export const worldConceptRelationships = pgTable(
	"world_concept_relationships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		sourceWorldConceptId: cascadeFk("source_world_concept_id", worldConcepts.id),
		targetWorldConceptId: cascadeFk("target_world_concept_id", worldConcepts.id),
		relationshipType: oneOf("relationship_type", conceptRelationshipTypes),

		relationshipDetails: nullableString("relationship_details"),
		strength: oneOf("strength", ["weak", "moderate", "strong"] as const),
	},
	(t) => [
		unique().on(t.sourceWorldConceptId, t.targetWorldConceptId, t.relationshipType),
		check("no_self_relationship", sql`${t.sourceWorldConceptId} != ${t.targetWorldConceptId}`),
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

		worldConceptId: cascadeFk("world_concept_id", worldConcepts.id),

		targetEntityType: oneOf("target_entity_type", targetEntityTypes),
		regionId: nullableFk("region_id", regions.id),
		factionId: nullableFk("faction_id", factions.id),
		npcId: nullableFk("npc_id", npcs.id),
		conflictId: nullableFk("conflict_id", conflicts.id),
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
