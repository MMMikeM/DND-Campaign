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
	regionTables: { sites, areas, regions, regionConnections, siteEncounters, siteLinks, siteSecrets },
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
						factions: true,
						influence: true,
						quests: true,
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
						areas: {
							with: {
								sites: {
									with: {
										encounters: true,
										secrets: true,
										incomingRelations: true,
										outgoingRelations: true,
										items: true,
										npcs: true,
									},
								},
							},
						},
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "site not found" }],
				}
			)
		},
	},
	get_all_regions: {
		description: "Get all sites in the campaign world",
		inputSchema: zodToMCP(schemas.get_all_regions),
		handler: async () => {
			logger.info("Getting all sites")
			return await db.query.regions.findMany()
		},
	},
	manage_regions: {
		description:
			createEntityActionDescription("region") +
			"A region represents an geographic region containing multiple areas, e.g. A province.",
		inputSchema: zodToMCP(schemas.manage_regions),
		handler: createEntityHandler(regions, schemas.manage_regions, "region"),
	},
	manage_areas: {
		description: createEntityActionDescription("area") + "An area is a specific place within a region, e.g. A town.",
		inputSchema: zodToMCP(schemas.manage_areas),
		handler: createEntityHandler(areas, schemas.manage_areas, "area"),
	},
	manage_sites: {
		description: createEntityActionDescription("site") + "A site is a specific place within an area, e.g. A tavern.",
		inputSchema: zodToMCP(schemas.manage_sites),
		handler: createEntityHandler(sites, schemas.manage_sites, "site"),
	},
	manage_region_connections: {
		description: createEntityActionDescription("region relation"),
		inputSchema: zodToMCP(schemas.manage_region_connections),
		handler: createEntityHandler(regionConnections, schemas.manage_region_connections, "region relation"),
	},
	manage_site_links: {
		description: createEntityActionDescription("site relation"),
		inputSchema: zodToMCP(schemas.manage_site_links),
		handler: createEntityHandler(siteLinks, schemas.manage_site_links, "site relation"),
	},
	manage_site_encounters: {
		description: createEntityActionDescription("site encounter"),
		inputSchema: zodToMCP(schemas.manage_site_encounters),
		handler: createEntityHandler(siteEncounters, schemas.manage_site_encounters, "site encounter"),
	},
	manage_site_secrets: {
		description: createEntityActionDescription("site secret"),
		inputSchema: zodToMCP(schemas.manage_site_secrets),
		handler: createEntityHandler(siteSecrets, schemas.manage_site_secrets, "site secret"),
	},
}
