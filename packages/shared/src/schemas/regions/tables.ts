import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, oneOf, nullableFk, string, list, pk, embeddingVector } from "../../db/utils.js"
import { embeddings } from "../embeddings/tables.js" // Import embeddings table

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
const connectionTypes = ["allied", "hostile", "trade", "cultural", "historical", "vassal", "contested"] as const

const dangerLevels = ["safe", "low", "moderate", "high", "deadly"] as const
const encounterTypes = ["combat", "social", "puzzle", "trap", "environmental"] as const
const linkTypes = ["adjacent", "road", "tunnel", "portal", "historical", "visible", "path", "conceptual"] as const
const difficultyLevels = ["easy", "medium", "hard"] as const
const secretTypes = ["historical", "hidden area", "concealed item", "true purpose", "connection"] as const

export const regions = pgTable("regions", {
	id: pk(),
	name: string("name").unique(),

	dangerLevel: oneOf("danger_level", dangerLevels),
	type: oneOf("type", regionTypes),

	economy: string("economy"),
	history: string("history"),
	population: string("population"),

	culturalNotes: list("cultural_notes"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	hazards: list("hazards"),
	pointsOfInterest: list("points_of_interest"),
	rumors: list("rumors"),
	secrets: list("secrets"),
	security: list("defenses"),
	embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
	// embedding: embeddingVector("embedding"), // Remove old column
})

export const areas = pgTable("areas", {
	id: pk(),
	regionId: cascadeFk("region_id", regions.id),
	name: string("name").unique(),
	type: oneOf("type", areaTypes),
	dangerLevel: oneOf("danger_level", dangerLevels),

	leadership: string("leadership"),
	population: string("population"),
	primaryActivity: string("primary_activity"),

	description: list("description"),
	culturalNotes: list("cultural_notes"),
	creativePrompts: list("creative_prompts"),
	hazards: list("hazards"),
	pointsOfInterest: list("points_of_interest"),
	rumors: list("rumors"),
	defenses: list("defenses"),
	embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
	// embedding: embeddingVector("embedding"), // Remove old column
})

export const regionConnections = pgTable(
	"region_connections",
	{
		id: pk(),
		regionId: cascadeFk("region_id", regions.id),
		otherRegionId: nullableFk("other_region_id", regions.id),
		connectionType: oneOf("connection_type", connectionTypes),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.regionId, t.otherRegionId)],
)

export const sites = pgTable("sites", {
	id: pk(),
	areaId: cascadeFk("area_id", areas.id),
	siteType: oneOf("site_type", siteTypes),

	name: string("name").unique(),
	terrain: string("terrain"),
	climate: string("climate"),
	mood: string("mood"),
	environment: string("environment"),

	creativePrompts: list("creative_prompts"),
	creatures: list("creatures"),
	description: list("description"),
	features: list("features"),
	treasures: list("treasures"),
	lightingDescription: list("lighting_description"),

	soundscape: list("soundscape"),
	smells: list("smells"),
	weather: list("weather"),
	descriptors: list("descriptors"),
	embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
	// embedding: embeddingVector("embedding"), // Remove old column
})

export const siteLinks = pgTable(
	"site_links",
	{
		id: pk(),
		siteId: cascadeFk("site_id", sites.id),
		otherSiteId: nullableFk("other_site_id", sites.id),

		description: list("description"),
		creativePrompts: list("creative_prompts"),
		linkType: oneOf("link_type", linkTypes),
	},
	(t) => [unique().on(t.siteId, t.otherSiteId)],
)

export const siteEncounters = pgTable(
	"site_encounters",
	{
		id: pk(),
		name: string("name").unique(),
		siteId: cascadeFk("site_id", sites.id),

		encounterType: oneOf("encounter_type", encounterTypes),
		dangerLevel: oneOf("danger_level", dangerLevels),
		difficulty: oneOf("difficulty", difficultyLevels),

		description: list("description"),
		creativePrompts: list("creative_prompts"),
		creatures: list("creatures"),
		treasure: list("treasure"),
		embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
		// embedding: embeddingVector("embedding"), // Remove old column
	},
	(t) => [unique().on(t.siteId, t.name)],
)

export const siteSecrets = pgTable("site_secrets", {
	id: pk(),
	siteId: cascadeFk("site_id", sites.id),
	secretType: oneOf("secret_type", secretTypes),
	difficultyToDiscover: oneOf("difficulty", difficultyLevels),
	discoveryMethod: list("discovery_method"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	consequences: list("consequences"),
	embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
	// embedding: embeddingVector("embedding"), // Remove old column
})

export const enums = {
	areaTypes,
	connectionTypes,
	dangerLevels,
	difficultyLevels,
	encounterTypes,
	linkTypes,
	regionTypes,
	secretTypes,
	siteTypes,
}
