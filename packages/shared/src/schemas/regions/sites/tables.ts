import { sql } from "drizzle-orm"
import { check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { bytea, cascadeFk, list, nullableFk, oneOf, pk, string } from "../../../db/utils"
import { embeddings } from "../../embeddings/tables"
import { dangerLevels } from "../../shared-enums"
import { areas } from "../tables"

const difficultyLevels = ["easy", "medium", "hard"] as const
const encounterTypes = ["combat", "social", "puzzle", "trap", "environmental"] as const
const imageFormats = ["png", "jpg", "webp"] as const
const linkTypes = ["adjacent", "road", "tunnel", "portal", "historical", "visible", "path", "conceptual"] as const
const secretTypes = ["historical", "hidden area", "concealed item", "true purpose", "connection"] as const
const siteFunctions = [
	"rest_stop_recovery",
	"challenge_hub_obstacle",
	"information_node_lore",
	"thematic_showcase_mood",
	"social_interaction_nexus",
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

export const enums = {
	difficultyLevels,
	encounterTypes,
	imageFormats,
	linkTypes,
	secretTypes,
	siteFunctions,
	siteTypes,
}
