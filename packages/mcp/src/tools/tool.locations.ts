import {
	locationAreas,
	locations,
	locationEncounters,
	locationRelations,
} from "@tome-master/shared"
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
} from "./tool.utils"

/**
 * Tool names for location-related operations
 */
export type LocationToolNames =
	| "get_all_locations"
	| "get_location_by_id"
	| "manage_location"
	| "manage_location_area"
	| "manage_location_encounter"
	| "manage_location_relation"

export const schemas = {
	locationIdSchema: z.object({ id: z.number() }),
	getAllLocationsSchema: z.object({}),

	locationmanageSchema: createInsertSchema(locations, {
		id: z.number().optional(),
		description: jsonArray,
		notableFeatures: z.array(z.string()),
		secrets: z.array(z.string()),
	}),

	locationAreamanageSchema: createInsertSchema(locationAreas, {
		id: z.number().optional(),
		description: jsonArray,
		features: jsonArray,
		encounters: jsonArray,
		treasures: jsonArray,
		creatures: jsonArray,
		plants: jsonArray,
		loot: jsonArray,
	}),

	locationEncountermanageSchema: createInsertSchema(locationEncounters, {
		id: z.number().optional(),
		description: jsonArray,
		creatures: jsonArray,
		treasure: jsonArray,
	}),

	locationRelationmanageSchema: createInsertSchema(locationRelations, {
		id: z.number().optional(),
		description: jsonArray,
		notes: jsonArray,
	}),
}

export const locationToolDefinitions: Record<LocationToolNames, ToolDefinition> = {
	manage_location: {
		description: createEntityActionDescription("location"),
		inputSchema: zodToMCP(schemas.locationmanageSchema, {
			id: "The ID of the location to update (omit to create new)",
			name: "The name of the location",
			type: "The type of location (city, town, dungeon, wilderness, etc.)",
			region: "The broader region or area where the location is situated",
			description: "Detailed description of the location's appearance and atmosphere",
			history: "The historical background of the location",
			dangerLevel: "How dangerous this location is (safe, low, moderate, high, deadly)",
			notableFeatures: "Distinctive or important features of the location",
			secrets: "Hidden aspects or secrets about the location",
		}),
		handler: createEntityHandler(locations, schemas.locationmanageSchema, "location"),
	},

	manage_location_area: {
		description: createEntityActionDescription("location area"),
		inputSchema: zodToMCP(schemas.locationAreamanageSchema, {
			id: "The ID of the area to update (omit to create new)",
			locationId: "The ID of the parent location this area belongs to",
			name: "The name of this specific area",
			description: "Detailed description of the area",
			areaType: "The type of area (district, room, clearing, etc.)",
			environment: "The environment of this area",
			terrain: "The terrain features of this area",
			climate: "The climate conditions of this area",
			features: "Notable features found in this area",
			encounters: "Potential encounters that might happen here",
			treasures: "Valuable items or treasures that can be found",
			creatures: "Creatures that inhabit or frequent this area",
			plants: "Notable plants or vegetation in this area",
			loot: "Miscellaneous items that might be found here",
		}),
		handler: createEntityHandler(locationAreas, schemas.locationAreamanageSchema, "location area"),
	},

	manage_location_encounter: {
		description: createEntityActionDescription("location encounter"),
		inputSchema: zodToMCP(schemas.locationEncountermanageSchema, {
			id: "The ID of the encounter to update (omit to create new)",
			locationId: "The ID of the location where this encounter occurs",
			name: "The name or title of this encounter",
			description: "Detailed description of the encounter",
			encounterType: "The type of encounter (combat, social, puzzle, trap, environmental)",
			difficulty: "The difficulty level of this encounter",
			creatures: "Creatures involved in this encounter",
			treasure: "Treasure or rewards from completing this encounter",
		}),
		handler: createEntityHandler(
			locationEncounters,
			schemas.locationEncountermanageSchema,
			"location encounter",
		),
	},

	manage_location_relation: {
		description: createEntityActionDescription("location relation"),
		inputSchema: zodToMCP(schemas.locationRelationmanageSchema, {
			id: "The ID of the relation to update (omit to create new)",
			locationId: "The ID of the primary location in this relation",
			otherLocationId: "The ID of the secondary location in this relation",
			description: "Description of how these locations are connected",
			notes: "Additional notes about the relationship between locations",
		}),
		handler: createEntityHandler(
			locationRelations,
			schemas.locationRelationmanageSchema,
			"location relation",
		),
	},

	get_location_by_id: {
		description: "Get detailed information about a specific location by ID",
		inputSchema: zodToMCP(schemas.locationIdSchema, {
			id: "The unique ID of the location to retrieve",
		}),
		handler: async (args) => {
			const parsed = schemas.locationIdSchema.parse(args)
			logger.info("Getting location by ID", { parsed })
			return (
				(await db.query.locations.findFirst({
					where: eq(locations.id, parsed.id),
					with: {
						areas: true,
						encounters: true,
						factions: true,
						npcs: true,
						quests: true,
						relatedTo: true,
						relations: true,
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "Location not found" }],
				}
			)
		},
	},

	get_all_locations: {
		description: "Get all locations in the campaign world",
		inputSchema: zodToMCP(schemas.getAllLocationsSchema, {
			// Empty object with no fields to describe
		}),
		handler: async () => {
			logger.info("Getting all locations")
			return await db.query.locations.findMany()
		},
	},
}
