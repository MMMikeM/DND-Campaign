// regions/tables.ts

import { sql } from "drizzle-orm"
import { check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableString, oneOf, pk, string } from "../../db/utils"
import { mapGroups, mapVariants } from "../maps/tables"
import { enums } from "./enums"

export { enums }

const {
	areaTypes,
	connectionTypes,
	dangerLevels,
	difficultyLevels,
	linkTypes,
	objectiveTypes,
	regionTypes,
	routeTypes,
	secretTypes,
	siteFunctions,
	travelDifficulties,
} = enums

export const regions = pgTable("regions", {
	id: pk(),
	name: string("name").unique(),
	description: list("description"),
	tags: list("tags"),

	dangerLevel: oneOf("danger_level", dangerLevels),
	type: oneOf("type", regionTypes),

	atmosphereAndCulture: list("atmosphere_and_culture"),
	featuresAndHazards: list("features_and_hazards"),
	historyAndEconomy: list("history_and_economy"),
	loreAndSecrets: list("lore_and_secrets"),
})

export const regionConnections = pgTable(
	"region_connections",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		sourceRegionId: cascadeFk("source_region_id", regions.id),
		targetRegionId: cascadeFk("target_region_id", regions.id),

		connectionType: oneOf("connection_type", connectionTypes),
		routeType: oneOf("route_type", routeTypes),
		travelDifficulty: oneOf("travel_difficulty", travelDifficulties),

		travelTime: string("travel_time"),

		travelHazards: list("travel_hazards"),
		pointsOfInterest: list("points_of_interest"),
	},
	(t) => [
		unique().on(t.sourceRegionId, t.targetRegionId, t.connectionType),
		check("chk_no_self_region_connection", sql`${t.sourceRegionId} != ${t.targetRegionId}`),
	],
)
export const areas = pgTable("areas", {
	id: pk(),
	name: string("name").unique(),
	description: list("description"),
	tags: list("tags"),

	regionId: cascadeFk("region_id", regions.id),
	type: oneOf("type", areaTypes),

	cultureAndLeadership: list("culture_and_leadership"),
	featuresAndHazards: list("features_and_hazards"),
	loreAndSecrets: list("lore_and_secrets"),
})

export const sites = pgTable("sites", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	tags: list("tags"),

	areaId: cascadeFk("area_id", () => areas.id),

	intendedSiteFunction: oneOf("intended_site_function", siteFunctions),

	mapGroupId: cascadeFk("map_group_id", mapGroups.id).unique(),
})

export const siteLinks = pgTable(
	"site_links",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),

		tags: list("tags"),

		sourceSiteId: cascadeFk("source_site_id", sites.id),
		targetSiteId: cascadeFk("target_site_id", sites.id),

		linkType: oneOf("link_type", linkTypes),
	},
	(t) => [
		unique().on(t.sourceSiteId, t.targetSiteId, t.linkType),
		check("chk_no_self_site_link", sql`${t.sourceSiteId} != ${t.targetSiteId}`),
	],
)

export const siteEncounters = pgTable(
	"site_encounters",
	{
		id: pk(),
		name: string("name").unique(),
		siteId: cascadeFk("site_id", sites.id),
		mapVariantId: cascadeFk("map_variant_id", mapVariants.id),

		encounterVibe: list("encounter_vibe"),
		creativePrompts: list("creative_prompts"),

		tags: list("tags"),

		objectiveType: oneOf("objective_type", objectiveTypes),
		objectiveDetails: string("objective_details"),

		specialVariations: list("special_variations"),
		nonCombatOptions: list("non_combat_options"),

		encounterSpecificEnvironmentNotes: nullableString("encounter_specific_environment_notes"),
		interactiveElements: list("interactive_elements"),

		treasureOrRewards: list("treasure_or_rewards"),
	},
	(t) => [unique().on(t.siteId, t.name)],
)

export const siteSecrets = pgTable("site_secrets", {
	id: pk(),
	siteId: cascadeFk("site_id", sites.id),
	secretType: oneOf("secret_type", secretTypes),
	difficultyToDiscover: oneOf("difficulty", difficultyLevels),
	discoveryMethod: list("discovery_method"),
})
