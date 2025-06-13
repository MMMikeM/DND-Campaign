import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, manyOf, nullableFk, nullableOneOf, nullableString, oneOf, pk, string } from "../../db/utils"
import { areas, regions, sites } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const {
	agendaImportance,
	agendaStages,
	agendaTypes,
	alignments,
	diplomaticStatuses,
	factionSizes,
	factionTypes,
	influenceLevels,
	reachLevels,
	relationshipStrengths,
	transparencyLevels,
	wealthLevels,
} = enums

export const factions = pgTable(
	"factions",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		hqSiteId: nullableFk("primary_hq_site_id", () => sites.id),

		size: oneOf("size", factionSizes),
		wealth: oneOf("wealth", wealthLevels),
		reach: oneOf("reach", reachLevels),
		type: manyOf("type", factionTypes),
		transparencyLevel: oneOf("transparency_level", transparencyLevels),
		publicAlignment: oneOf("public_alignment", alignments),
		secretAlignment: nullableOneOf("secret_alignment", alignments),

		publicPerception: string("public_perception"),
		publicGoal: string("public_goal"),
		secretGoal: nullableString("secret_goal"),

		values: list("values"),
		history: list("history"),
		symbols: list("symbols"),
		rituals: list("rituals"),
		taboos: list("taboos"),
		aesthetics: list("aesthetics"),
		jargon: list("jargon"),
		recognitionSigns: list("recognition_signs"),
	},
	(t) => [
		check(
			"chk_faction_transparency_rules",
			sql`NOT ((${t.transparencyLevel} = 'transparent') AND (${t.secretAlignment} IS NOT NULL OR ${t.secretGoal} IS NOT NULL))`,
		),
	],
)

export const factionAgendas = pgTable(
	"faction_agendas",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),

		agendaType: oneOf("agenda_type", agendaTypes),
		currentStage: oneOf("current_stage", agendaStages),
		importance: oneOf("importance", agendaImportance),

		ultimateAim: string("ultimate_aim"),
		moralAmbiguity: string("moral_ambiguity"),

		approach: list("approach"),
		storyHooks: list("story_hooks"),
	},
	(t) => [unique().on(t.factionId, t.name)],
)

export const factionDiplomacy = pgTable(
	"faction_diplomacy",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		otherFactionId: cascadeFk("other_faction_id", factions.id),

		strength: oneOf("strength", relationshipStrengths),
		diplomaticStatus: oneOf("diplomatic_status", diplomaticStatuses),
	},
	(t) => [unique().on(t.factionId, t.otherFactionId)],
)

export const factionInfluence = pgTable(
	"faction_influence",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),

		regionId: nullableFk("region_id", () => regions.id),
		areaId: nullableFk("area_id", () => areas.id),
		siteId: nullableFk("site_id", sites.id),

		influenceLevel: oneOf("influence_level", influenceLevels),

		presenceTypes: list("presence_types"),
		presenceDetails: list("presence_details"),
		priorities: list("priorities"),
	},
	(t) => [
		check(
			"region_or_area_or_site",
			sql`(${t.regionId} IS NOT NULL AND ${t.areaId} IS NULL AND ${t.siteId} IS NULL) 
			OR  (${t.regionId} IS NULL AND ${t.areaId} IS NOT NULL AND ${t.siteId} IS NULL) 
			OR  (${t.regionId} IS NULL AND ${t.areaId} IS NULL AND ${t.siteId} IS NOT NULL)`,
		),
	],
)

const { connectionTypes, routeTypes, travelDifficulties } = enums

export const regionConnections = pgTable(
	"region_connections",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		regionId: cascadeFk("region_id", regions.id),
		otherRegionId: nullableFk("other_region_id", regions.id),
		controllingFactionId: nullableFk("controlling_faction_id", () => factions.id),

		connectionType: oneOf("connection_type", connectionTypes),
		routeType: oneOf("route_type", routeTypes),
		travelDifficulty: oneOf("travel_difficulty", travelDifficulties),

		travelTime: string("travel_time"),

		travelHazards: list("travel_hazards"),
		pointsOfInterest: list("points_of_interest"),
	},
	(t) => [
		unique().on(t.regionId, t.otherRegionId, t.connectionType),
		check("chk_no_self_region_connection", sql`COALESCE(${t.regionId} != ${t.otherRegionId}, TRUE)`),
	],
)
