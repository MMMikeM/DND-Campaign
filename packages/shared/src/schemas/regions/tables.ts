// regions/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { dangerLevels } from "../shared-enums"
import * as sitesModule from "./sites/tables"

const { enums: sitesEnums, siteEncounters, siteLinks, siteSecrets, sites } = sitesModule

export { siteEncounters, siteLinks, siteSecrets, sites }

const connectionTypes = ["allied", "hostile", "trade", "cultural", "historical", "vassal", "contested"] as const
const routeTypes = ["road", "river", "mountain_pass", "sea_route", "portal", "wilderness"] as const
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

const atmosphereTypes = [
	"safe_haven_rest",
	"oppressive_tense",
	"mysterious_intriguing",
	"mundane_stable",
	"wild_dangerous_challenging",
	"wonder_awe",
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

		// Merged from regionConnectionDetails
		routeType: oneOf("route_type", routeTypes),
		travelDifficulty: oneOf("travel_difficulty", travelDifficulties),
		travelTime: string("travel_time"),
		controllingFactionId: nullableFk("controlling_faction_id", () => factions.id),
		travelHazards: list("travel_hazards"),
		pointsOfInterest: list("points_of_interest"),
	},
	(t) => [unique().on(t.regionId, t.otherRegionId)],
)

export const enums = {
	...sitesEnums,
	areaTypes,
	atmosphereTypes,
	connectionTypes,
	dangerLevels,
	regionTypes,
	routeTypes,
	travelDifficulties,
}
