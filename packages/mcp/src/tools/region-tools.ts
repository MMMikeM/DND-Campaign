import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import {
	createEntityActionDescription,
	createEntityHandler,
	type CamelToSnakeCase,
	type ToolDefinition,
} from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./region-tools-schema"

const {
	regionTables: { locations, regionConnections, regions, locationEncounters, locationLinks, locationSecrets },
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.regionTables>}`
export type RegionTools = TableTools | "get_all_regions" | "get_region_by_id"

export const regionToolDefinitions: Record<RegionTools, ToolDefinition> = {
	get_region_by_id: {
		description: "Get detailed information about a specific region by ID",
		inputSchema: zodToMCP(schemas.get_region_by_id),
		handler: async (args) => {
			const parsed = schemas.get_region_by_id.parse(args)
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
		description: "Get all regions in the campaign world",
		inputSchema: zodToMCP(schemas.get_all_regions),
		handler: async () => {
			logger.info("Getting all regions")
			return await db.query.regions.findMany()
		},
	},
	manage_regions: {
		description:
			createEntityActionDescription("region") +
			"A region represents an area containing multiple locations, e.g. A town.",
		inputSchema: zodToMCP(schemas.manage_regions),
		handler: createEntityHandler(regions, schemas.manage_regions, "region"),
	},
	manage_region_connections: {
		description: createEntityActionDescription("region relation"),
		inputSchema: zodToMCP(schemas.manage_region_connections),
		handler: createEntityHandler(regionConnections, schemas.manage_region_connections, "region relation"),
	},
	manage_locations: {
		description:
			createEntityActionDescription("location") + "A location is a specific place within a region, e.g. A tavern.",
		inputSchema: zodToMCP(schemas.manage_locations),
		handler: createEntityHandler(locations, schemas.manage_locations, "location"),
	},
	manage_location_links: {
		description: createEntityActionDescription("location relation"),
		inputSchema: zodToMCP(schemas.manage_location_links),
		handler: createEntityHandler(locationLinks, schemas.manage_location_links, "location relation"),
	},

	manage_location_encounters: {
		description: createEntityActionDescription("location encounter"),
		inputSchema: zodToMCP(schemas.manage_location_encounters),
		handler: createEntityHandler(locationEncounters, schemas.manage_location_encounters, "location encounter"),
	},

	manage_location_secrets: {
		description: createEntityActionDescription("location secret"),
		inputSchema: zodToMCP(schemas.manage_location_secrets),
		handler: createEntityHandler(locationSecrets, schemas.manage_location_secrets, "location secret"),
	},
}
