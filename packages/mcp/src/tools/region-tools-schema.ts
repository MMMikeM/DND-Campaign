import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { RegionTools } from "./region-tools"
import { id, optionalId } from "./tool.utils"

const {
	regionTables: { regions, areas, sites, regionConnections, siteEncounters, siteLinks, siteSecrets, enums },
} = tables

export const schemas = {
	manage_regions: createInsertSchema(regions, {
		id: optionalId.describe("ID of region to manage (omit to create new, include alone to delete)"),
		culturalNotes: (s) => s.describe("Traditions, customs, and social behaviors in point form"),
		creativePrompts: (s) => s.describe("Adventure hooks and campaign ideas for this region"),
		description: (s) => s.describe("Physical features and atmosphere in point form"),
		hazards: (s) => s.describe("Environmental dangers and risks to travelers in point form"),
		pointsOfInterest: (s) => s.describe("Landmarks and notable locations not detailed as full sites"),
		rumors: (s) => s.describe("Gossip and stories circulating among locals and travelers"),
		secrets: (s) => s.describe("Hidden truths and undiscovered elements known to few"),
		security: (s) => s.describe("Military presence, law enforcement, and safety measures"),
		name: (s) => s.describe("Distinctive name of this region"),
		history: (s) => s.describe("Major historical events and developments"),
		economy: (s) => s.describe("Industries, trade goods, and economic activities"),
		population: (s) => s.describe("Approximate inhabitants and demographic makeup"),
		dangerLevel: z.enum(enums.dangerLevels).describe("Threat assessment (safe, low, moderate, high, deadly)"),
		type: z.enum(enums.regionTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
	})
		.strict()
		.describe("Major geographic areas that provide settings for adventures and define the campaign world"),

	manage_areas: createInsertSchema(areas, {
		id: optionalId.describe("ID of area to manage (omit to create new, include alone to delete)"),
		regionId: id.describe("Required ID of region this area belongs to"),
		name: (s) => s.describe("Specific name of this area"),
		creativePrompts: (s) => s.describe("Adventure hooks and campaign ideas for this area"),
		description: (s) => s.describe("Physical features and atmosphere in point form"),
		hazards: (s) => s.describe("Environmental dangers and risks to travelers in point form"),
		pointsOfInterest: (s) => s.describe("Landmarks and notable locations not detailed as full sites"),
		rumors: (s) => s.describe("Gossip and stories circulating among locals and travelers"),
		culturalNotes: (s) => s.describe("Traditions, customs, and social behaviors in point form"),
		dangerLevel: (s) => s.describe("Threat assessment (safe, low, moderate, high, deadly)"),
		population: (s) => s.describe("Approximate inhabitants and demographic makeup"),
		primaryActivity: (s) => s.describe("Primary activity or focus of the area"),
		leadership: (s) => s.describe("Rulers, authorities, or influential figures"),
		defenses: (s) => s.describe("Defensive structures and security measures"),
		type: z.enum(enums.areaTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
	})
		.strict()
		.describe("Subdivisions within regions that have distinct identities and adventure opportunities"),

	manage_sites: createInsertSchema(sites, {
		id: optionalId.describe("ID of site to manage (omit to create new, include alone to delete)"),
		areaId: id.describe("Required ID of area this site is located within"),
		creativePrompts: (s) => s.describe("Scene ideas and narrative opportunities"),
		creatures: (s) => s.describe("Inhabitants, wildlife, and monsters found here"),
		description: (s) => s.describe("Visual details and layout in point form"),
		features: (s) => s.describe("Notable objects and distinct elements"),
		treasures: (s) => s.describe("Valuables and collectibles that might be found"),
		soundscape: (s) => s.describe("Characteristic sounds and acoustic elements"),
		smells: (s) => s.describe("Distinctive odors and scents"),
		weather: (s) => s.describe("Typical meteorological conditions and effects"),
		descriptors: (s) => s.describe("Evocative adjectives for quick reference"),
		lightingDescription: (s) => s.describe("Illumination quality and sources"),
		name: (s) => s.describe("Specific name of this location"),
		terrain: (s) => s.describe("Physical landscape (rocky, forested, marshy, etc.)"),
		climate: (s) => s.describe("Weather patterns (temperate, tropical, arid, etc.)"),
		environment: (s) => s.describe("Setting context (urban, rural, wilderness, underground)"),
		mood: (s) => s.describe("Emotional atmosphere (peaceful, tense, eerie, vibrant)"),
		siteType: z.enum(enums.siteTypes).describe("Category (building, fortress, cave, ruins, etc.)"),
	})
		.strict()
		.describe("Specific locations where encounters, scenes, and adventures take place"),

	manage_region_connections: createInsertSchema(regionConnections, {
		id: optionalId.describe("ID of connection to manage (omit to create new, include alone to delete)"),
		regionId: id.describe("Required ID of primary region in this relationship"),
		otherRegionId: id.describe("Required ID of secondary region in this relationship"),
		description: (s) => s.describe("How these regions interact and current dynamics"),
		creativePrompts: (s) => s.describe("Adventure ideas involving travel or conflict"),
		connectionType: z.enum(enums.connectionTypes).describe("Relationship type (allied, hostile, trade, rivals)"),
	})
		.strict()
		.describe("Political, economic, and geographical relationships between different regions"),

	manage_site_links: createInsertSchema(siteLinks, {
		id: optionalId.describe("ID of link to manage (omit to create new, include alone to delete)"),
		siteId: id.describe("Required ID of primary site in this relationship"),
		otherSiteId: id.describe("Required ID of secondary site in this relationship"),
		description: (s) => s.describe("Physical connections and proximity between sites"),
		creativePrompts: (s) => s.describe("Story ideas involving travel or interaction"),
		linkType: z.enum(enums.linkTypes).describe("Connection type (adjacent, connected, visible from)"),
	})
		.strict()
		.describe("Physical and narrative connections between locations that players can traverse"),

	manage_site_encounters: createInsertSchema(siteEncounters, {
		id: optionalId.describe("ID of encounter to manage (omit to create new, include alone to delete)"),
		siteId: id.describe("Required ID of site where this encounter occurs"),
		description: (s) => s.describe("Setup and possible outcomes in point form"),
		creatures: (s) => s.describe("Enemies, NPCs, or beings involved"),
		treasure: (s) => s.describe("Rewards and valuable items obtainable"),
		creativePrompts: (s) => s.describe("Variations and alternative approaches"),
		name: (s) => s.describe("Distinctive title for this encounter"),
		encounterType: z.enum(enums.encounterTypes).describe("Interaction type (combat, social, puzzle, trap)"),
		difficulty: z.enum(enums.difficultyLevels).describe("Challenge level (easy, medium, hard)"),
		dangerLevel: z.enum(enums.dangerLevels).describe("Threat level (safe, low, moderate, high, deadly)"),
	}).strict()
		.describe("Challenges, interactions, and events that players can experience at specific locations"),

	manage_site_secrets: createInsertSchema(siteSecrets, {
		id: optionalId.describe("ID of secret to manage (omit to create new, include alone to delete)"),
		siteId: id.describe("Required ID of site where this secret exists"),
		description: (s) => s.describe("What the secret entails and its significance in point form"),
		consequences: (s) => s.describe("Immediate and long-term effects of discovery"),
		creativePrompts: (s) => s.describe("Ways to foreshadow or reveal this secret"),
		discoveryMethod: (s) => s.describe("Actions or checks that could reveal this secret"),
		difficultyToDiscover: z
			.enum(enums.difficultyLevels)
			.describe("Discovery challenge (obvious through nearly impossible)"),
		secretType: z.enum(enums.secretTypes).describe("Category (historical, hidden area, concealed item, true purpose)"),
	})
		.strict()
		.describe("Hidden information and concealed areas that reward player exploration and investigation"),
} satisfies Record<RegionTools, z.ZodSchema<unknown>>
