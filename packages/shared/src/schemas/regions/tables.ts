// regions/tables.ts

import { sql } from "drizzle-orm"
import { boolean, check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { bytea, cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const {
	areaTypes,
	atmosphereTypes,
	difficultyLevels,
	dangerLevels,
	imageFormats,
	linkTypes,
	objectiveTypes,
	regionTypes,
	secretTypes,
	siteFunctions,
	siteTypes,
} = enums

export const regions = pgTable("regions", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),

	dangerLevel: oneOf("danger_level", dangerLevels),
	type: oneOf("type", regionTypes),

	// New fields from schema updates plan
	atmosphereType: oneOf("atmosphere_type", atmosphereTypes),
	revelationLayersSummary: list("revelation_layers_summary"),

	economy: string("economy"),
	history: string("history"),
	population: string("population"),

	culturalNotes: list("cultural_notes"),
	hazards: list("hazards"),
	pointsOfInterest: list("points_of_interest"),
	rumors: list("rumors"),
	secrets: list("secrets"),
	security: list("defenses"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const areas = pgTable("areas", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	regionId: cascadeFk("region_id", regions.id),
	name: string("name").unique(),
	type: oneOf("type", areaTypes),
	dangerLevel: oneOf("danger_level", dangerLevels),

	// New fields from schema updates plan
	atmosphereType: oneOf("atmosphere_type", atmosphereTypes),
	revelationLayersSummary: list("revelation_layers_summary"),

	leadership: string("leadership"),
	population: string("population"),
	primaryActivity: string("primary_activity"),

	culturalNotes: list("cultural_notes"),
	hazards: list("hazards"),
	pointsOfInterest: list("points_of_interest"),
	rumors: list("rumors"),
	defenses: list("defenses"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const sites = pgTable("sites", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	areaId: cascadeFk("area_id", () => areas.id),
	type: oneOf("site_type", siteTypes),

	// New field from schema updates plan
	intendedSiteFunction: oneOf("intended_site_function", siteFunctions),

	name: string("name").unique(),
	terrain: string("terrain"),
	climate: string("climate"),
	mood: string("mood"),
	environment: string("environment"),

	creatures: list("creatures"),
	features: list("features"),
	treasures: list("treasures"),
	lightingDescription: list("lighting_description"),

	soundscape: list("soundscape"),
	smells: list("smells"),
	weather: list("weather"),
	descriptors: list("descriptors"),

	// Battlemap Tactical Analysis
	coverOptions: list("cover_options"),
	elevationFeatures: list("elevation_features"),
	movementRoutes: list("movement_routes"),
	difficultTerrain: list("difficult_terrain"),
	chokePoints: list("choke_points"),
	sightLines: list("sight_lines"),
	tacticalPositions: list("tactical_positions"),
	interactiveElements: list("interactive_elements"),
	environmentalHazards: list("environmental_hazards"),

	// Battlemap Image Storage
	battlemapImage: bytea("battlemap_image"),
	imageFormat: oneOf("image_format", imageFormats),
	imageSize: integer("image_size"),
	imageWidth: integer("image_width"),
	imageHeight: integer("image_height"),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const siteLinks = pgTable(
	"site_links",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		siteId: cascadeFk("site_id", sites.id),
		otherSiteId: nullableFk("other_site_id", sites.id),

		linkType: oneOf("link_type", linkTypes),
	},
	(t) => [
		unique().on(t.siteId, t.otherSiteId, t.linkType),
		check("chk_no_self_site_link", sql`COALESCE(${t.siteId} != ${t.otherSiteId}, TRUE)`),
	],
)

export const siteEncounters = pgTable(
	"site_encounters",
	{
		id: pk(),
		name: string("name"),
		siteId: cascadeFk("site_id", sites.id),

		encounterVibe: list("encounter_vibe"),
		creativePrompts: list("creative_prompts"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		objectiveType: oneOf("objective_type", objectiveTypes),
		objectiveDetails: nullableString("objective_details"),
		hasTimer: boolean("has_timer").notNull().default(false),
		timerValue: integer("timer_value"),
		timerUnit: nullableString("timer_unit"),
		timerConsequence: nullableString("timer_consequence"),

		coreEnemyGroups: list("core_enemy_groups"),
		synergyDescription: nullableString("synergy_description"),

		encounterCategory: oneOf("encounter_category", ["combat", "puzzle", "trap", "social", "exploration_hazard"]),
		recommendedProficiencyBonus: integer("recommended_proficiency_bonus"),

		specialVariations: list("special_variations"),
		nonCombatOptions: list("non_combat_options"),

		encounterSpecificEnvironmentNotes: nullableString("encounter_specific_environment_notes"),
		interactiveElements: list("interactive_elements"),

		treasureOrRewards: list("treasure_or_rewards"),

		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [
		unique().on(t.siteId, t.name),
		check(
			"chk_timer_details_if_has_timer",
			sql`NOT ${t.hasTimer} OR (${t.timerValue} IS NOT NULL AND ${t.timerUnit} IS NOT NULL)`,
		),
		check(
			"chk_no_timer_details_if_no_timer",
			sql`${t.hasTimer} OR (${t.timerValue} IS NULL AND ${t.timerUnit} IS NULL AND ${t.timerConsequence} IS NULL)`,
		),
		check(
			"chk_objective_details_for_non_deathmatch",
			sql`${t.objectiveType} = 'DEATHMATCH' OR ${t.objectiveDetails} IS NOT NULL`,
		),
		check(
			"chk_proficiency_bonus_range",
			sql`${t.recommendedProficiencyBonus} IS NULL OR (${t.recommendedProficiencyBonus} >= 2 AND ${t.recommendedProficiencyBonus} <= 6)`, // Added IS NULL check if it's nullable
		),
	],
)

export const siteSecrets = pgTable("site_secrets", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	siteId: cascadeFk("site_id", sites.id),
	secretType: oneOf("secret_type", secretTypes),
	difficultyToDiscover: oneOf("difficulty", difficultyLevels),
	discoveryMethod: list("discovery_method"),
	consequences: list("consequences"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})
