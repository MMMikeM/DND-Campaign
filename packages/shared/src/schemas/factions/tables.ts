// factions/tables.ts
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core"
import { list, nullableFk, cascadeFk, pk, oneOf, string } from "../../db/utils.js"
import { locations, regions } from "../regions/tables.js"
import { alignments, wealthLevels } from "../common.js"

const sizeTypes = ["tiny", "small", "medium", "large", "massive"] as const
const reachLevels = ["local", "regional", "national", "continental", "global"] as const
const relationshipStrength = [
	"weak",
	"moderate",
	"friendly",
	"strong",
	"unbreakable",
	"friction",
	"cold",
	"hostile",
	"war",
] as const
const relationshipTypes = ["ally", "enemy", "neutral"] as const

// Define the main factions table
export const factions = sqliteTable("factions", {
	id: pk(),
	// enums
	name: string("name").unique(),
	alignment: oneOf("alignment", alignments),
	size: oneOf("size", sizeTypes),
	wealth: oneOf("wealth", wealthLevels),
	reach: oneOf("reach", reachLevels),
	// text
	type: string("type"),
	publicGoal: string("public_goal"),
	publicPerception: string("public_perception"),
	// nullable
	secretGoal: text("secret_goal"),
	// list
	description: list("description").notNull(),
	values: list("values"),
	history: list("history"),
	notes: list("notes"),
	resources: list("resources"),
	recruitment: list("recruitment").notNull(),
})

export const factionRegions = sqliteTable(
	"faction_regions",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		regionId: nullableFk("region_id", regions.id),
		controlLevel: oneOf("control_level", ["contested", "influenced", "controlled", "dominated"]),
		presence: list("presence"), // How they manifest in the area
		priorities: list("priorities"), // What they care about here
	},
	(t) => [unique().on(t.factionId, t.regionId)],
)

export const factionHeadquarters = sqliteTable(
	"faction_headquarters",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		locationId: nullableFk("location_id", locations.id),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.locationId)],
)

export const factionRelationships = sqliteTable(
	"faction_relationships",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		otherFactionId: nullableFk("other_faction_id", factions.id),
		strength: oneOf("strength", relationshipStrength),
		type: oneOf("type", relationshipTypes),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.otherFactionId)],
)

export const factionOperations = sqliteTable(
	"faction_operations",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		name: string("name").unique(),
		type: oneOf("type", ["economic", "military", "diplomatic", "espionage", "public works", "research"]),
		scale: oneOf("scale", ["minor", "moderate", "major", "massive"]),
		status: oneOf("status", ["planning", "initial", "ongoing", "concluding", "completed"]),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
		objectives: list("objectives"),
		locations: list("locations"),
		involved_npcs: list("involved_npcs"),
		priority: oneOf("priority", ["low", "medium", "high"]),
	},
	(t) => [unique().on(t.factionId, t.name)],
)

export const factionCulture = sqliteTable(
	"faction_culture",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		symbols: list("symbols"),
		rituals: list("rituals"),
		taboos: list("taboos"),
		aesthetics: list("aesthetics"),
		jargon: list("jargon"), // Special terms or phrases
		recognitionSigns: list("recognition_signs"), // How members identify each other
	},
	(t) => [unique().on(t.factionId)],
)
