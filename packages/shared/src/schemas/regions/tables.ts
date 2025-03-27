// regions/tables.ts
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { cascadeFk, oneOf, nullableFk, string, list, pk } from "../../db/utils.js"

const regionTypes = [
	// Settlements
	"city",
	"town",
	"village",
	"outpost",
	"hamlet",

	// Natural Environments
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

	// Constructed or Modified Environments
	"fortress",
	"ruins",
	"farmland",
	"mine",

	// Underground/Enclosed Areas
	"cave",
	"dungeon",
	"underground",
	"cavern",

	// Special Regions
	"planar",
	"enchanted",
	"blighted",
	"haunted",
	"elemental",
] as const

const locationTypes = [
	// Urban Structures
	"building",
	"fortress",
	"castle",
	"tower",
	"temple",
	"market",
	"town square",
	"port",
	"graveyard",
	"arena",
	"warehouse",
	"slum",
	"farm",

	// Natural Formations
	"cave",
	"clearing",
	"beach",
	"river crossing",
	"waterfall",
	"mountain pass",
	"cliff",
	"oasis",
	"field",
	"grove",

	// Ruins & Historical Sites
	"ruins",
	"cemetery",
	"mine",

	// Transitional Spaces
	"road",
	"bridge",
	"camp",
	"crossroads",
	"trail",
] as const

const dangerLevels = ["safe", "low", "moderate", "high", "deadly"] as const
const encounterTypes = ["combat", "social", "puzzle", "trap", "environmental"] as const

// Main regions table
export const regions = sqliteTable("regions", {
	id: pk(),
	name: text("name").unique(),
	// enums
	dangerLevel: oneOf("danger_level", dangerLevels),
	type: oneOf("type", regionTypes),
	// text
	economy: string("economy"),
	history: string("history"),
	population: string("population"),
	// list
	culturalNotes: list("cultural_notes"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	hazards: list("hazards"),
	pointsOfInterest: list("points_of_interest"),
	rumors: list("rumors"),
	secrets: list("secrets"),
	security: list("defenses"),
})

export const regionRelations = sqliteTable("region_relations", {
	id: pk(),
	regionId: cascadeFk("region_id", regions.id),
	otherRegionId: nullableFk("other_region_id", regions.id),
	relationType: string("relation_type"),

	description: list("description"),
	creativePrompts: list("creative_prompts"),
})

// Specific locations within regions
export const locations = sqliteTable("locations", {
	id: pk(),
	regionId: nullableFk("region_id", regions.id),
	locationType: oneOf("location_type", locationTypes),

	name: string("name").unique(),
	terrain: string("terrain"),
	climate: string("climate"),
	// lists
	creativePrompts: list("creative_prompts"),
	creatures: list("creatures"),
	description: list("description"),
	environment: text("environment"),
	features: list("features"),
	treasures: list("treasures"),
})

// Relationships between locations
export const locationRelations = sqliteTable("location_relations", {
	id: pk(),
	locationId: cascadeFk("location_id", locations.id),
	otherLocationId: nullableFk("other_location_id", locations.id),

	description: list("description"),
	creativePrompts: list("creative_prompts"),
	relationType: string("relation_type"),
})

export const locationAtmosphere = sqliteTable("location_atmosphere", {
	id: pk(),
	locationId: cascadeFk("location_id", locations.id),

	timeContext: oneOf("time_context", ["always", "day", "night", "dawn", "dusk", "seasonal"]),
	lightingLevel: oneOf("lighting_level", ["pitch black", "dim", "shadowy", "well-lit", "bright", "blinding"]),
	mood: oneOf("mood", ["peaceful", "tense", "eerie", "vibrant", "desolate", "chaotic", "oppressive"]),

	soundscape: list("soundscape"),
	smells: list("smells"),
	weather: list("weather"),
	descriptors: list("descriptors"), // Evocative adjectives for quick reference
})

// Encounters within locations
export const locationEncounters = sqliteTable("location_encounters", {
	id: pk(),
	name: string("name").unique(),
	locationId: cascadeFk("location_id", locations.id),

	encounterType: oneOf("encounter_type", encounterTypes),
	dangerLevel: oneOf("danger_level", dangerLevels), // corrected to dangerLevel
	difficulty: oneOf("difficulty", ["easy", "medium", "hard"]), // changed to oneOf

	description: list("description"),
	creativePrompts: list("creative_prompts"),
	creatures: list("creatures"),
	treasure: list("treasure"),
})

export const locationSecrets = sqliteTable("location_secrets", {
	id: pk(),
	locationId: cascadeFk("location_id", locations.id),

	secretType: oneOf("secret_type", [
		"historical",
		"hidden area",
		"concealed item",
		"true purpose",
		"connection",
	]),
	difficultyToDiscover: oneOf("difficulty", [
		"obvious",
		"simple",
		"moderate",
		"challenging",
		"nearly impossible",
	]),

	discoveryMethod: list("discovery_method"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	consequences: list("consequences"),
})
