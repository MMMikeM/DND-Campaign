import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import {
	createEntityHandler,
	createEntityActionDescription,
	jsonArray,
	type ToolDefinition,
	type CamelToSnakeCase,
} from "./tool.utils"

const {
	regionTables: {
		locations,
		regionRelations,
		regions,
		locationEncounters,
		locationRelations,
		locationSecrets,
	},
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.regionTables>}`

/**
 * Tool names for location-related operations
 */
export type LocationToolNames = "get_all_regions" | "get_region_by_id" | TableTools

export const schemas = {
	id: z.object({ id: z.number() }),
	regions: createInsertSchema(regions, {
		id: z.number().optional(),
		culturalNotes: jsonArray,
		creativePrompts: jsonArray,
		description: jsonArray,
		hazards: jsonArray,
		pointsOfInterest: jsonArray,
		rumors: jsonArray,
		secrets: jsonArray,
		security: jsonArray,
	}).strict(),
	regionRelations: createInsertSchema(regionRelations, {
		id: z.number().optional(),
		description: jsonArray,
	}).strict(),
	locations: createInsertSchema(locations, {
		id: z.number().optional(),
		creativePrompts: jsonArray,
		creatures: jsonArray,
		description: jsonArray,
		features: jsonArray,
		treasures: jsonArray,
	}).strict(),
	locationRelations: createInsertSchema(locationRelations, {
		id: z.number().optional(),
		description: jsonArray,
		creativePrompts: jsonArray,
	}).strict(),
	locationEncounters: createInsertSchema(locationEncounters, {
		id: z.number().optional(),
		description: jsonArray,
		creatures: jsonArray,
		treasure: jsonArray,
		creativePrompts: jsonArray,
	}).strict(),
	locationSecrets: createInsertSchema(locationSecrets, {
		id: z.number().optional(),
		description: jsonArray,
		consequences: jsonArray,
		creativePrompts: jsonArray,
		discoveryMethod: jsonArray,
	}).strict(),
}

export const locationToolDefinitions: Record<LocationToolNames, ToolDefinition> = {
	get_region_by_id: {
		description: "Get detailed information about a specific region by ID",
		inputSchema: zodToMCP(schemas.id, {
			id: "The unique ID of the region to retrieve",
		}),
		handler: async (args) => {
			const parsed = schemas.id.parse(args)
			logger.info("Getting region by ID", { parsed })
			return (
				(await db.query.regions.findFirst({
					where: eq(regions.id, parsed.id),
					with: {
						incomingRelations: {
							with: {
								sourceRegion: true,
							},
						},
						outgoingRelations: {
							with: {
								targetRegion: true,
							},
						},
						locations: {
							with: {
								region: true,
								encounters: true,
								secrets: true,
								incomingRelations: true,
								outgoingRelations: true,
								items: true,
								npcs: true,
							},
						},
						quests: true,
						factions: true,
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "Location not found" }],
				}
			)
		},
	},

	get_all_regions: {
		description: "Get all locations in the campaign world",
		inputSchema: zodToMCP(z.any()),
		handler: async () => {
			logger.info("Getting all locations")
			return await db.query.locations.findMany()
		},
	},
	manage_regions: {
		description:
			createEntityActionDescription("region") +
			"A region represents an area containing multiple locations, e.g. A town.",
		inputSchema: zodToMCP(schemas.regions, {
			id: "The ID of the region to update (omit to create new)",
			name: "The name of the region",
			description: "Detailed description of the region, in point form",
			culturalNotes: "Cultural notes about the region, in point form",
			history: "Historical background of the region",
			secrets: "Hidden aspects or secrets about the region, in point form",
			dangerLevel: "How dangerous this region is (safe, low, moderate, high, deadly)",
			economy: "The main economic activity of the region",
			hazards: "Natural or man-made hazards in the region, in point form",
			pointsOfInterest:
				"Points of interest in the region, in point form, careful not to overlap with specific locations",
			population: "Population of the region",
			rumors: "Rumors or gossip about the region",
			type: "The type of region (city, town, wilderness, etc.)",
			creativePrompts: "Creative prompts for this region",
			security: "Security level and measures in place in the region, in point form",
		}),
		handler: createEntityHandler(regions, schemas.regions, "region"),
	},
	manage_region_relations: {
		description: createEntityActionDescription("region relation"),
		inputSchema: zodToMCP(schemas.regionRelations, {
			id: "The ID of the relation to update (omit to create new)",
			regionId: "The ID of the primary region in this relation",
			otherRegionId: "The ID of the secondary region in this relation",
			description: "Description of how these regions are connected",
			creativePrompts: "Creative prompts for this relation",
			relationType: "The type of relation (e.g. ally, enemy, trade, etc.)",
		}),
		handler: createEntityHandler(regionRelations, schemas.regionRelations, "region relation"),
	},
	manage_locations: {
		description:
			createEntityActionDescription("location") +
			"A location is a specific place within a region, e.g. A tavern.",
		inputSchema: zodToMCP(schemas.locations, {
			id: "The ID of the location to update (omit to create new)",
			name: "The name of the location",
			description: "Detailed description of the location's appearance and atmosphere",
			regionId: "The ID of the region this location belongs to",
			terrain: "The terrain of the location (e.g. forest, mountain, desert)",
			climate: "The climate of the location (e.g. temperate, tropical, arid)",
			environment: "The environment of the location (e.g. urban, rural, wilderness)",
			creativePrompts: "Creative prompts for this location",
			creatures: "Creatures that can be found in this location",
			features: "Distinctive features of the location (e.g. a fountain, a statue)",
			treasures: "Treasures or items that can be found in this location",
			locationType: "The type of location (e.g. tavern, shop, dungeon)",
			soundscape: "Sounds associated with this location",
			smells: "Smells associated with this location",
			weather: "Weather conditions in this location",
			descriptors: "Evocative adjectives for quick reference",
			mood: "The mood or atmosphere of this location (peaceful, tense, eerie, vibrant, desolate, chaotic, oppressive)",
			lightingDescription: "The description of the lighting in this location",
		}),
		handler: createEntityHandler(locations, schemas.locations, "location"),
	},
	manage_location_relations: {
		description: createEntityActionDescription("location relation"),
		inputSchema: zodToMCP(schemas.locationRelations, {
			id: "The ID of the relation to update (omit to create new)",
			locationId: "The ID of the primary location in this relation",
			otherLocationId: "The ID of the secondary location in this relation",
			description: "Description of how these locations are connected",
			creativePrompts: "Creative prompts for this relation",
			relationType: "The type of relation (e.g. friendly neighbour, ally, enemy, trade, etc.)",
		}),
		handler: createEntityHandler(locationRelations, schemas.locationRelations, "location relation"),
	},

	manage_location_encounters: {
		description: createEntityActionDescription("location encounter"),
		inputSchema: zodToMCP(schemas.locationEncounters, {
			id: "The ID of the encounter to update (omit to create new)",
			locationId: "The ID of the location where this encounter occurs",
			name: "The name or title of this encounter",
			description: "Detailed description of the encounter",
			encounterType: "The type of encounter (combat, social, puzzle, trap, environmental)",
			difficulty: "The difficulty level of this encounter",
			creatures: "Creatures involved in this encounter",
			treasure: "Treasure or rewards from completing this encounter",
			creativePrompts: "Creative prompts for this encounter",
			dangerLevel: "The danger level of this encounter (safe, low, moderate, high, deadly)",
		}),
		handler: createEntityHandler(locationEncounters, schemas.locationEncounters, "location encounter"),
	},

	manage_location_secrets: {
		description: createEntityActionDescription("location secret"),
		inputSchema: zodToMCP(schemas.locationSecrets, {
			id: "The ID of the secret to update (omit to create new)",
			locationId: "The ID of the location where this secret is found",
			description: "Detailed description of the secret",
			consequences: "Consequences of discovering this secret",
			creativePrompts: "Creative prompts related to this secret",
			discoveryMethod: "How this secret can be discovered (e.g. overheard, found, revealed)",
			difficultyToDiscover: "The difficulty level to discover this secret (easy, medium, hard)",
			secretType: "The type of secret (e.g. hidden treasure, ancient artifact, dark past)",
		}),
		handler: createEntityHandler(locationSecrets, schemas.locationSecrets, "location secret"),
	},
}
