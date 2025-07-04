import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	regionTables: { regions, areas, sites, siteEncounters, siteLinks, siteSecrets, regionConnections, enums },
} = tables

const {
	atmosphereTypes,
	dangerLevels,
	regionTypes,
	areaTypes,
	siteFunctions,
	linkTypes,
	objectiveTypes,
	difficultyLevels,
	encounterCategories,
	secretTypes,
	siteTypes,
	routeTypes,
	travelDifficulties,
	connectionTypes,
} = enums

type TableNames = CreateTableNames<typeof tables.regionTables>

export const tableEnum = [
	"regions",
	"areas",
	"sites",
	"siteLinks",
	"siteEncounters",
	"siteSecrets",
] as const satisfies TableNames

export const schemas = {
	regions: createInsertSchema(regions, {
		atmosphereType: z.enum(atmosphereTypes).describe("Atmosphere type (dark, light, neutral, etc.)"),
		creativePrompts: list.describe("Adventure hooks and campaign ideas for this region"),
		culturalNotes: list.describe("Traditions, customs, and social behaviors in point form"),
		dangerLevel: z.enum(dangerLevels).describe("Threat assessment (safe, low, moderate, high, deadly)"),
		description: list.describe("Physical features and atmosphere in point form"),
		economy: (s) => s.describe("Industries, trade goods, and economic activities"),
		gmNotes: list.describe("GM notes for this region"),
		hazards: list.describe("Environmental dangers and risks to travelers in point form"),
		history: (s) => s.describe("Major historical events and developments"),
		name: (s) => s.describe("Distinctive name of this region"),
		pointsOfInterest: list.describe("Landmarks and notable locations not detailed as full sites"),
		population: (s) => s.describe("Approximate inhabitants and demographic makeup"),
		revelationLayersSummary: list.describe("Summary of revelation layers for this region"),
		rumors: list.describe("Gossip and stories circulating among locals and travelers"),
		secrets: list.describe("Hidden truths and undiscovered elements known to few"),
		security: list.describe("Military presence, law enforcement, and safety measures"),
		tags: list.describe("Tags for this region"),
		type: z.enum(regionTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Major geographic areas that provide settings for adventures and define the campaign world"),
	regionConnections: createInsertSchema(regionConnections, {
		name: (s) => s.describe("Name of this connection"),
		pointsOfInterest: list.describe("Points of interest for this region"),
		routeType: z.enum(routeTypes).describe("Route type (road, river, air, sea)"),
		travelDifficulty: z.enum(travelDifficulties).describe("Travel difficulty (easy, moderate, hard)"),
		travelHazards: list.describe("Travel hazards for this region"),
		travelTime: (s) => s.describe("Travel time for this region"),
		connectionType: z.enum(connectionTypes).describe("Relationship type (allied, hostile, trade, rivals)"),
		creativePrompts: list.describe("Adventure ideas involving travel or conflict"),
		description: list.describe("How these regions interact and current dynamics"),
		gmNotes: list.describe("GM notes for this connection"),
		sourceRegionId: id.describe("Required ID of primary region in this relationship"),
		targetRegionId: id.describe("Required ID of secondary region in this relationship"),
		tags: list.describe("Tags for this connection"),
	})
		.omit({ id: true })
		.strict()
		.describe("Political, economic, and geographical relationships between different regions"),

	areas: createInsertSchema(areas, {
		atmosphereType: z.enum(atmosphereTypes).describe("Atmosphere type (dark, light, neutral, etc.)"),
		creativePrompts: list.describe("Adventure hooks and campaign ideas for this area"),
		culturalNotes: list.describe("Traditions, customs, and social behaviors in point form"),
		dangerLevel: (s) => s.describe("Threat assessment (safe, low, moderate, high, deadly)"),
		defenses: list.describe("Defensive structures and security measures"),
		description: list.describe("Physical features and atmosphere in point form"),
		gmNotes: list.describe("GM notes for this area"),
		hazards: list.describe("Environmental dangers and risks to travelers in point form"),
		leadership: (s) => s.describe("Rulers, authorities, or influential figures"),
		name: (s) => s.describe("Specific name of this area"),
		pointsOfInterest: list.describe("Landmarks and notable locations not detailed as full sites"),
		population: (s) => s.describe("Approximate inhabitants and demographic makeup"),
		primaryActivity: (s) => s.describe("Primary activity or focus of the area"),
		regionId: id.describe("Required ID of region this area belongs to"),
		revelationLayersSummary: list.describe("Summary of revelation layers for this area"),
		rumors: list.describe("Gossip and stories circulating among locals and travelers"),
		tags: list.describe("Tags for this area"),
		type: z.enum(areaTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Subdivisions within regions that have distinct identities and adventure opportunities"),

	sites: createInsertSchema(sites, {
		areaId: id.describe("Required ID of area this site is located within"),
		mapGroupId: id.describe("Required ID of the map variant this site is associated with"),

		climate: (s) => s.describe("Weather patterns (temperate, tropical, arid, etc.)"),
		creativePrompts: list.describe("Scene ideas and narrative opportunities"),
		creatures: list.describe("Inhabitants, wildlife, and monsters found here"),
		description: list.describe("Visual details and layout in point form"),
		descriptors: list.describe("Evocative adjectives for quick reference"),
		environment: (s) => s.describe("Setting context (urban, rural, wilderness, underground)"),
		features: list.describe("Notable objects and distinct elements"),
		gmNotes: list.describe("GM notes for this site"),
		intendedSiteFunction: z.enum(siteFunctions).describe("Function of this site"),
		lightingDescription: list.describe("Illumination quality and sources"),
		mood: (s) => s.describe("Emotional atmosphere (peaceful, tense, eerie, vibrant)"),
		name: (s) => s.describe("Specific name of this location"),
		type: z.enum(siteTypes).describe("Category (building, fortress, cave, ruins, etc.)"),
		smells: list.describe("Distinctive odors and scents"),
		soundscape: list.describe("Characteristic sounds and acoustic elements"),
		tags: list.describe("Tags for this site"),
		terrain: (s) => s.describe("Physical landscape (rocky, forested, marshy, etc.)"),
		treasures: list.describe("Valuables and collectibles that might be found"),
		weather: list.describe("Typical meteorological conditions and effects"),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Tactical locations where encounters and combat take place. Each site must be linked to a pre-existing map.",
		),

	siteLinks: createInsertSchema(siteLinks, {
		creativePrompts: list.describe("Story ideas involving travel or interaction"),
		description: list.describe("Physical connections and proximity between sites"),
		gmNotes: list.describe("GM notes for this link"),
		linkType: z.enum(linkTypes).describe("Connection type (adjacent, connected, visible from)"),
		targetSiteId: id.describe("Required ID of secondary site in this relationship"),
		sourceSiteId: id.describe("Required ID of primary site in this relationship"),
		tags: list.describe("Tags for this link"),
	})
		.omit({ id: true })
		.strict()
		.describe("Physical and narrative connections between locations that players can traverse")
		.refine((data) => data.sourceSiteId !== data.targetSiteId, {
			message: "A site cannot have a link with itself",
			path: ["targetSiteId"],
		}),

	siteEncounters: createInsertSchema(siteEncounters, {
		name: (s) => s.describe("Distinctive title for this encounter"),
		siteId: id.describe("Required ID of site where this encounter occurs"),
		mapVariantId: optionalId.describe("Optional ID of map variant where this encounter occurs"),

		encounterVibe: list.describe("Vibe of this encounter"),
		creativePrompts: list.describe("Variations and alternative approaches"),
		gmNotes: list.describe("GM notes for this encounter"),
		tags: list.describe("Tags for this encounter"),

		objectiveType: z.enum(objectiveTypes).describe("Type of objective for this encounter"),
		objectiveDetails: (s) => s.describe("Details of the objective for this encounter"),
		hasTimer: z.boolean().describe("Whether this encounter has a timer"),
		timerValue: (s) => s.describe("Value of the timer for this encounter"),
		timerUnit: (s) => s.describe("Unit of the timer for this encounter"),
		timerConsequence: (s) => s.describe("Consequence of the timer for this encounter"),

		coreEnemyGroups: list.describe("Core enemy groups for this encounter"),
		synergyDescription: (s) => s.describe("Synergy description for this encounter"),

		encounterCategory: z.enum(encounterCategories).describe("Category of this encounter"),
		recommendedProficiencyBonus: (s) => s.describe("Recommended proficiency bonus for this encounter"),

		specialVariations: list.describe("Special variations for this encounter"),
		nonCombatOptions: list.describe("Non-combat options for this encounter"),

		encounterSpecificEnvironmentNotes: (s) => s.describe("Specific environment notes for this encounter"),
		interactiveElements: list.describe("Interactive elements for this encounter"),

		treasureOrRewards: list.describe("Treasure or rewards for this encounter"),
	})
		.omit({ id: true })
		.strict()
		.describe("Challenges, interactions, and events that players can experience at specific locations"),

	siteSecrets: createInsertSchema(siteSecrets, {
		consequences: list.describe("Immediate and long-term effects of discovery"),
		creativePrompts: list.describe("Ways to foreshadow or reveal this secret"),
		description: list.describe("What the secret entails and its significance in point form"),
		difficultyToDiscover: z.enum(difficultyLevels).describe("Discovery challenge (obvious through nearly impossible)"),
		discoveryMethod: list.describe("Actions or checks that could reveal this secret"),
		gmNotes: list.describe("GM notes for this secret"),
		secretType: z.enum(secretTypes).describe("Category (historical, hidden area, concealed item, true purpose)"),
		siteId: id.describe("Required ID of site where this secret exists"),
		tags: list.describe("Tags for this secret"),
	})
		.omit({ id: true })
		.strict()
		.describe("Hidden information and concealed areas that reward player exploration and investigation"),
} as const satisfies Schema<TableNames[number]>
