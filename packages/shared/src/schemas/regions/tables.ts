// regions/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, oneOf, nullableFk, string, list, pk, embeddingVector } from "../../db/utils.js"

const regionTypes = [
    // Larger geographical classifications
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
    
    // Special region classifications
    "planar",
    "enchanted",
    "blighted",
    "haunted",
    "elemental",
] as const

const areaTypes = [
    // Settlements
    "city",
    "town",
    "village",
    "outpost",
    "hamlet",
    
    // Special area classifications
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
    // Urban Structures
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

    // Natural Formations
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

// Top level: Regions (broader geographical territories)
export const regions = pgTable("regions", {
    id: pk(),
    name: string("name").unique(),
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
    embedding: embeddingVector("embedding"),
})

// Middle level: Areas (settlements, wilderness areas, or complexes within regions)
export const areas = pgTable("areas", {
    id: pk(),
    regionId: cascadeFk("region_id", regions.id),
    name: string("name").unique(),
    type: oneOf("type", areaTypes),
    dangerLevel: oneOf("danger_level", dangerLevels),
    
    // Core details
    leadership: string("leadership"),
    population: string("population"),
    primaryActivity: string("primary_activity"),
    
    // Descriptive elements
    description: list("description"),
    culturalNotes: list("cultural_notes"),
    creativePrompts: list("creative_prompts"),
    hazards: list("hazards"),
    pointsOfInterest: list("points_of_interest"),
    rumors: list("rumors"),
    defenses: list("defenses"),
    embedding: embeddingVector("embedding"),
})

const connectionTypes = ["allied", "hostile", "trade", "cultural", "historical", "vassal", "contested"] as const

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

// Lowest level: Sites (specific locations within areas)
export const sites = pgTable("sites", {
    id: pk(),
    areaId: cascadeFk("area_id", areas.id),
    siteType: oneOf("site_type", siteTypes),

    name: string("name").unique(),
    terrain: string("terrain"),
    climate: string("climate"),
    mood: string("mood"),
    environment: string("environment"),
    // lists
    creativePrompts: list("creative_prompts"),
    creatures: list("creatures"),
    description: list("description"),
    features: list("features"),
    treasures: list("treasures"),
    lightingDescription: list("lighting_description"),

    soundscape: list("soundscape"),
    smells: list("smells"),
    weather: list("weather"),
    descriptors: list("descriptors"), // Evocative adjectives for quick reference
    embedding: embeddingVector("embedding"),
})

const linkTypes = ["adjacent", "road", "tunnel", "portal", "historical", "visible", "path", "conceptual"] as const

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

// Encounters within sites
export const siteEncounters = pgTable(
    "site_encounters",
    {
        id: pk(),
        name: string("name").unique(),
        siteId: cascadeFk("site_id", sites.id),

        encounterType: oneOf("encounter_type", encounterTypes),
        dangerLevel: oneOf("danger_level", dangerLevels),
        difficulty: oneOf("difficulty", ["easy", "medium", "hard"]),

        description: list("description"),
        creativePrompts: list("creative_prompts"),
        creatures: list("creatures"),
        treasure: list("treasure"),
        embedding: embeddingVector("embedding"),
    },
    (t) => [unique().on(t.siteId, t.name)],
)

export const siteSecrets = pgTable("site_secrets", {
    id: pk(),
    siteId: cascadeFk("site_id", sites.id),
    secretType: oneOf("secret_type", ["historical", "hidden area", "concealed item", "true purpose", "connection"]),
    difficultyToDiscover: oneOf("difficulty", ["obvious", "simple", "moderate", "challenging", "nearly impossible"]),
    discoveryMethod: list("discovery_method"),
    description: list("description"),
    creativePrompts: list("creative_prompts"),
    consequences: list("consequences"),
    embedding: embeddingVector("embedding"),
})