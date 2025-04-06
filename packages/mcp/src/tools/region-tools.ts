import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { createEntityActionDescription, createEntityHandler, createGetEntityHandler } from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./region-tools-schema"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"

const {
	regionTables: { sites, areas, regions, regionConnections, siteEncounters, siteLinks, siteSecrets },
} = tables

export type RegionTools = CreateTableTools<typeof tables.regionTables> | "get_region_entity"
export type RegionGetters = CreateEntityGetters<typeof tables.regionTables>

const entityGetters: RegionGetters = {
	all_regions: () => db.query.regions.findMany(),
	all_areas: () => db.query.areas.findMany(),
	all_sites: () => db.query.sites.findMany(),
	all_region_connections: () => db.query.regionConnections.findMany(),
	all_site_encounters: () => db.query.siteEncounters.findMany(),
	all_site_links: () => db.query.siteLinks.findMany(),
	all_site_secrets: () => db.query.siteSecrets.findMany(),

	region_by_id: (id: number) =>
		db.query.regions.findFirst({
			where: eq(regions.id, id),
			with: {
				factions: true,
				influence: true,
				quests: true,
				incomingRelations: { with: { sourceRegion: true, details: true } },
				outgoingRelations: { with: { targetRegion: true, details: true } },
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
		}),
	area_by_id: (id: number) =>
		db.query.areas.findFirst({
			where: eq(areas.id, id),
			with: {
				region: true,
				sites: {
					with: {
						encounters: true,
						secrets: true,
					},
				},
			},
		}),
	site_by_id: (id: number) =>
		db.query.sites.findFirst({
			where: eq(sites.id, id),
			with: {
				area: true,
				encounters: true,
				secrets: true,
				incomingRelations: true,
				outgoingRelations: true,
				items: true,
				npcs: true,
			},
		}),
	region_connection_by_id: (id: number) =>
		db.query.regionConnections.findFirst({ where: eq(regionConnections.id, id) }),
	site_encounter_by_id: (id: number) => db.query.siteEncounters.findFirst({ where: eq(siteEncounters.id, id) }),
	site_link_by_id: (id: number) => db.query.siteLinks.findFirst({ where: eq(siteLinks.id, id) }),
	site_secret_by_id: (id: number) => db.query.siteSecrets.findFirst({ where: eq(siteSecrets.id, id) }),
}

export const regionToolDefinitions: Record<RegionTools, ToolDefinition> = {
	get_region_entity: {
		description: "Get region information by type and optional ID",
		inputSchema: zodToMCP(schemas.get_entity),
		handler: createGetEntityHandler("region", entityGetters),
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
