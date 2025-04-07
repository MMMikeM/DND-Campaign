// factions/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { list, nullableFk, cascadeFk, pk, oneOf, string, nullableString, embeddingVector } from "../../db/utils.js"
import { embeddings } from "../embeddings/tables.js" // Import embeddings table
import { sites, regions } from "../regions/tables.js"
import { alignments, relationshipStrengths, wealthLevels } from "../common.js"

const sizeTypes = ["tiny", "small", "medium", "large", "massive"] as const
const reachLevels = ["local", "regional", "national", "continental", "global"] as const
const diplomaticTypes = ["ally", "enemy", "neutral", "vassal", "suzerain", "rival", "trade"] as const
const controlLevels = ["contested", "influenced", "controlled", "dominated"] as const
const factionOperationTypes = ["economic", "military", "diplomatic", "espionage", "public works", "research"] as const
const factionOperationStatuses = ["planning", "initial", "ongoing", "concluding", "completed"] as const
const factionOperationScales = ["minor", "moderate", "major", "massive"] as const
const factionPriorities = ["low", "medium", "high"] as const
const factionTypes = [
	"guild",
	"cult",
	"tribe",
	"noble_house",
	"mercantile",
	"religious",
	"military",
	"criminal",
	"political",
	"arcane",
] as const

export const factions = pgTable("factions", {
	id: pk(),
	name: string("name").unique(),
	alignment: oneOf("alignment", alignments),
	size: oneOf("size", sizeTypes),
	wealth: oneOf("wealth", wealthLevels),
	reach: oneOf("reach", reachLevels),
	type: oneOf("type", factionTypes),
	publicGoal: string("public_goal"),
	publicPerception: string("public_perception"),
	secretGoal: nullableString("secret_goal"),
	description: list("description").notNull(),
	values: list("values"),
	history: list("history"),
	notes: list("notes"),
	resources: list("resources"),
	recruitment: list("recruitment").notNull(),
	embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
	// embedding: embeddingVector("embedding"), // Remove old column
})

export const factionRegions = pgTable(
	"faction_regions",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		regionId: nullableFk("region_id", regions.id),
		controlLevel: oneOf("control_level", controlLevels),
		presence: list("presence"), // How they manifest in the area
		priorities: list("priorities"), // What they care about here
	},
	(t) => [unique().on(t.factionId, t.regionId)],
)

export const factionHeadquarters = pgTable(
	"faction_headquarters",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		siteId: cascadeFk("site_id", sites.id),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.siteId)],
)

export const factionDiplomacy = pgTable(
	"faction_diplomacy",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		otherFactionId: cascadeFk("other_faction_id", factions.id),
		strength: oneOf("strength", relationshipStrengths),
		diplomaticStatus: oneOf("diplomatic_status", diplomaticTypes),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.otherFactionId)],
)

export const factionOperations = pgTable(
	"faction_operations",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		name: string("name").unique(),
		type: oneOf("type", factionOperationTypes),
		scale: oneOf("scale", factionOperationScales),
		status: oneOf("status", factionOperationStatuses),
		priority: oneOf("priority", factionPriorities),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
		objectives: list("objectives"),
		site: list("site"),
		involved_npcs: list("involved_npcs"),
		embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
		// embedding: embeddingVector("embedding"), // Remove old column
	},
	(t) => [unique().on(t.factionId, t.name)],
)

export const factionCulture = pgTable(
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
		embeddingId: nullableFk("embedding_id", embeddings.id), // Add FK
		// embedding: embeddingVector("embedding"), // Remove old column
	},
	(t) => [unique().on(t.factionId)],
)

export const enums = {
	controlLevels,
	diplomaticTypes,
	relationshipStrengths,
	sizeTypes,
	reachLevels,
	factionTypes,
	wealthLevels,
	alignments,
	factionOperationTypes,
	factionOperationStatuses,
	factionOperationScales,
	factionPriorities,
}
