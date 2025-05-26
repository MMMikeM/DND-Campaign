// regions/tables.ts
import { integer, pgTable, unique } from "drizzle-orm/pg-core"
import { bytea, cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
export const dangerLevels = ["safe", "low", "moderate", "high", "deadly"] as const

const connectionTypes = ["allied", "hostile", "trade", "cultural", "historical", "vassal", "contested"] as const
const difficultyLevels = ["easy", "medium", "hard"] as const
const encounterTypes = ["combat", "social", "puzzle", "trap", "environmental"] as const
const imageFormats = ["png", "jpg", "webp"] as const
const linkTypes = ["adjacent", "road", "tunnel", "portal", "historical", "visible", "path", "conceptual"] as const
const routeTypes = ["road", "river", "mountain_pass", "sea_route", "portal", "wilderness"] as const
const secretTypes = ["historical", "hidden area", "concealed item", "true purpose", "connection"] as const
const travelDifficulties = ["trivial", "easy", "moderate", "difficult", "treacherous"] as const

const regionTypes = [
	"coastal",
	"desert",
	"forest",
	"mountain",
	"ocean",
	"river",
	"swamp",
	"wilderness",
	"grassland",
	"jungle",
	"tundra",
	"hills",
	"valley",
	"canyon",
	"marsh",
	"lake",

	"planar",
	"enchanted",
	"blighted",
	"haunted",
	"elemental",
] as const

const areaTypes = [
	"city",
	"town",
	"village",
	"outpost",
	"hamlet",

	"ruins_complex",
	"wilderness_stretch",
	"battlefield",
	"sacred_grounds",
	"dungeon_network",
	"fortress_complex",
	"mining_district",
	"farmland_district",
] as const

const siteTypes = [
	"building",
	"fortress",
	"castle",
	"tower",
	"temple",
	"market",
	"town_square",
	"port",
	"graveyard",
	"arena",
	"warehouse",
	"slum",
	"farm",

	"cave",
	"clearing",
	"beach",
	"river_crossing",
	"waterfall",
	"mountain_pass",
	"cliff",
	"oasis",
	"field",
	"grove",

	"ruins",
	"cemetery",
	"mine",

	"road",
	"bridge",
	"camp",
	"crossroads",
	"trail",
] as const
const atmosphereTypes = [
	"safe_haven_rest",
	"oppressive_tense",
	"mysterious_intriguing",
	"mundane_stable",
	"wild_dangerous_challenging",
	"wonder_awe",
] as const
const siteFunctions = [
	"rest_stop_recovery",
	"challenge_hub_obstacle",
	"information_node_lore",
	"thematic_showcase_mood",
	"social_interaction_nexus",
] as const

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

export const regionConnections = pgTable(
	"region_connections",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		regionId: cascadeFk("region_id", regions.id),
		otherRegionId: nullableFk("other_region_id", regions.id),
		connectionType: oneOf("connection_type", connectionTypes),
	},
	(t) => [unique().on(t.regionId, t.otherRegionId)],
)

export const sites = pgTable("sites", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	areaId: cascadeFk("area_id", areas.id),
	siteType: oneOf("site_type", siteTypes),

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
	(t) => [unique().on(t.siteId, t.otherSiteId)],
)

export const siteEncounters = pgTable(
	"site_encounters",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		name: string("name").unique(),
		siteId: cascadeFk("site_id", sites.id),

		encounterType: oneOf("encounter_type", encounterTypes),
		dangerLevel: oneOf("danger_level", dangerLevels),
		difficulty: oneOf("difficulty", difficultyLevels),

		creatures: list("creatures"),
		treasure: list("treasure"),
		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [unique().on(t.siteId, t.name)],
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

// Region-owned connection details (moved from associations/)
export const regionConnectionDetails = pgTable("region_connection_details", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	connectionId: cascadeFk("connection_id", regionConnections.id).unique(),
	routeType: oneOf("route_type", routeTypes),
	travelDifficulty: oneOf("travel_difficulty", travelDifficulties),
	travelTime: string("travel_time"),
	controllingFactionId: nullableFk("controlling_faction_id", factions.id),
	travelHazards: list("travel_hazards"),
	pointsOfInterest: list("points_of_interest"),
})

export const enums = {
	areaTypes,
	atmosphereTypes,
	connectionTypes,
	dangerLevels,
	difficultyLevels,
	encounterTypes,
	imageFormats,
	linkTypes,
	regionTypes,
	routeTypes,
	secretTypes,
	siteFunctions,
	siteTypes,
	travelDifficulties,
}
