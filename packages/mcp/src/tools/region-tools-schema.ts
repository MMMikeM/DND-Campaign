import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { id, jsonArray } from "./tool.utils"
import { RegionTools } from "./region-tools"

const {
	regionTables: { locations, regionConnections, regions, locationEncounters, locationLinks, locationSecrets },
} = tables

export const schemas = {
	get_region_by_id: z.object({ id: id.describe("The unique identifier for the region to retrieve") }),
	get_all_regions: z.object({}).describe("Retrieves all regions from the database"),
	manage_regions: createInsertSchema(regions, {
		id: z.number().optional().describe("The ID of the region to update (omit to create new)"),
		culturalNotes: jsonArray.describe(
			"Distinctive traditions, customs, and social behaviors of the inhabitants in point form",
		),
		creativePrompts: jsonArray.describe("Adventure hooks, campaign ideas, and storytelling suggestions for GMs"),
		description: jsonArray.describe("Physical characteristics, notable features, and general atmosphere in point form"),
		hazards: jsonArray.describe(
			"Environmental dangers, natural threats, and potential risks to travelers in point form",
		),
		pointsOfInterest: jsonArray.describe(
			"Significant landmarks, natural wonders, and notable sites that aren't fully detailed locations",
		),
		rumors: jsonArray.describe("Gossip, hearsay, and stories circulating among locals and travelers about this region"),
		secrets: jsonArray.describe(
			"Hidden truths, concealed history, and undiscovered elements known only to select individuals",
		),
		security: jsonArray.describe(
			"Military presence, law enforcement, defensive structures, and overall safety measures",
		),
		name: (s) => s.describe("The distinctive name by which this region is commonly known"),
		history: (s) => s.describe("Major historical events, founding, conflicts, and development over time"),
		dangerLevel: (s) => s.describe("Overall threat assessment (safe, low, moderate, high, deadly)"),
		economy: (s) => s.describe("Primary industries, trade goods, and economic activities sustaining the region"),
		population: (s) => s.describe("Approximate number of inhabitants and demographic makeup"),
		type: (s) =>
			s.describe(
				"Geographic or settlement classification (city, town, village, coastal, desert, forest, mountain, ocean, river, swamp, wilderness, etc.)",
			),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A distinct geographic area with its own characteristics, culture, and points of interest"),

	manage_region_connections: createInsertSchema(regionConnections, {
		id: z.number().optional().describe("The ID of the relation to update (omit to create new)"),
		description: jsonArray.describe("Details about how these regions interact, shared history, and current dynamics"),
		creativePrompts: jsonArray.describe("Adventure ideas involving travel or conflict between these regions"),
		regionId: (s) => s.describe("The ID of the primary region in this relationship (references regions.id)"),
		otherRegionId: (s) =>
			s.optional().describe("The ID of the secondary region in this relationship (references regions.id)"),
		connectionType: (s) =>
			s.describe("The nature of their connection (allied, hostile, trade partners, political rivals, etc.)"),
	})
		.strict()
		.describe("Defines how two geographic regions interact and relate to each other"),

	manage_locations: createInsertSchema(locations, {
		id: z.number().optional().describe("The ID of the location to update (omit to create new)"),
		creativePrompts: jsonArray.describe("Scene-setting ideas, encounter suggestions, and narrative opportunities"),
		creatures: jsonArray.describe("Typical inhabitants, wildlife, monsters, or other beings found here"),
		description: jsonArray.describe("Visual details, spatial layout, and defining characteristics in point form"),
		features: jsonArray.describe("Notable objects, architectural elements, or distinct aspects worth attention"),
		treasures: jsonArray.describe("Valuables, rewards, and collectibles that might be discovered here"),
		soundscape: jsonArray.describe("Characteristic noises, ambient sounds, and acoustic elements"),
		smells: jsonArray.describe("Distinctive odors, scents, and olfactory experiences in this location"),
		weather: jsonArray.describe("Typical or current meteorological conditions and their effects"),
		descriptors: jsonArray.describe("Short, evocative adjectives for quick atmospheric reference during gameplay"),
		lightingDescription: jsonArray.describe("Quality, sources, and characteristics of illumination or darkness"),
		name: (s) => s.describe("The specific name of this place or site"),
		regionId: (s) =>
			s.optional().describe("The ID of the larger region this location is situated within (references regions.id)"),
		terrain: (s) => s.describe("The physical landscape or ground characteristics (rocky, forested, marshy, etc.)"),
		climate: (s) =>
			s.describe("Prevailing weather patterns and atmospheric conditions (temperate, tropical, arid, etc.)"),
		environment: (s) => s.describe("The broader context of the setting (urban, rural, wilderness, underground, etc.)"),
		locationType: (s) =>
			s.describe(
				"The category of site (building, fortress, castle, tower, temple, cave, clearing, ruins, road, bridge, etc.)",
			),
		mood: (s) =>
			s.describe(
				"The emotional atmosphere and feeling evoked (peaceful, tense, eerie, vibrant, desolate, chaotic, oppressive)",
			),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A specific place within a region where scenes, encounters, and adventures can occur"),

	manage_location_links: createInsertSchema(locationLinks, {
		id: z.number().optional().describe("The ID of the relation to update (omit to create new)"),
		description: jsonArray.describe("Physical connections, proximity, and relationship dynamics between locations"),
		creativePrompts: jsonArray.describe(
			"Story ideas involving travel between these locations or utilizing their relationship",
		),
		locationId: (s) => s.describe("The ID of the primary location in this relationship (references locations.id)"),
		otherLocationId: (s) =>
			s.optional().describe("The ID of the secondary location in this relationship (references locations.id)"),
		linkType: (s) =>
			s.describe(
				"How these locations interact with each other (adjacent, connected, visible from, controls access to, etc.)",
			),
	})
		.strict()
		.describe("Defines how two specific locations relate to or connect with each other"),

	manage_location_encounters: createInsertSchema(locationEncounters, {
		id: z.number().optional().describe("The ID of the encounter to update (omit to create new)"),
		description: jsonArray.describe("Setup, progression, and possible outcomes of this encounter in point form"),
		creatures: jsonArray.describe("Specific enemies, NPCs, or beings involved and their motivations"),
		treasure: jsonArray.describe("Rewards, loot, and valuable items obtainable from this encounter"),
		creativePrompts: jsonArray.describe(
			"Variations, dramatic moments, and alternative approaches to running this encounter",
		),
		locationId: (s) => s.describe("The ID of the location where this encounter takes place (references locations.id)"),
		name: (s) => s.describe("A distinctive title or identifier for this encounter"),
		encounterType: (s) => s.describe("The primary interaction type (combat, social, puzzle, trap, environmental)"),
		difficulty: (s) => s.describe("Challenge level for players (easy, medium, hard)"),
		dangerLevel: (s) => s.describe("Potential threat to character survival (safe, low, moderate, high, deadly)"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A planned interaction, challenge, or event that can occur at a specific location"),

	manage_location_secrets: createInsertSchema(locationSecrets, {
		id: z.number().optional().describe("The ID of the secret to update (omit to create new)"),
		description: jsonArray.describe("What the secret entails, its significance, and potential impact in point form"),
		consequences: jsonArray.describe("What happens when this secret is discovered, both immediate and long-term"),
		creativePrompts: jsonArray.describe("Ways to foreshadow, reveal, or incorporate this secret into the narrative"),
		discoveryMethod: jsonArray.describe("Specific actions, checks, or circumstances that could reveal this secret"),
		locationId: (s) => s.describe("The ID of the location where this secret exists (references locations.id)"),
		difficultyToDiscover: (s) =>
			s.describe("How challenging it is to uncover (obvious, simple, moderate, challenging, nearly impossible)"),
		secretType: (s) =>
			s.describe("The category of revelation (historical, hidden area, concealed item, true purpose, connection)"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("Hidden information, concealed areas, or unknown truths associated with a location"),
} satisfies Record<RegionTools, z.ZodSchema<unknown>>
