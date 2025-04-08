import { tables } from "@tome-master/shared"
import { eq, name } from "drizzle-orm"
import { db } from "../index"
import { createEntityActionDescription, createEntityHandler } from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./region-tools-schema"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"

const {
	regionTables: { sites, areas, regions, regionConnections, siteEncounters, siteLinks, siteSecrets },
} = tables

export type RegionTools = CreateTableTools<typeof tables.regionTables>
export type RegionGetters = CreateEntityGetters<typeof tables.regionTables>

export const entityGetters: RegionGetters = {
	all_regions: () =>
		db.query.regions.findMany({
			columns: {
				name: true,
				id: true,
				description: true,
			},
			with: {
				areas: {
					columns: { name: true, id: true },
					with: {
						sites: { columns: { name: true, id: true } },
					},
				},
				quests: { columns: { name: true, id: true } },
				worldChanges: { columns: { name: true, id: true } },
				territorialControl: { with: { faction: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceRegion: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetRegion: { columns: { name: true, id: true } } } },
			},
		}),
	all_areas: () =>
		db.query.areas.findMany({
			columns: {
				name: true,
				id: true,
				description: true,
			},
			with: {
				territorialControl: { with: { faction: { columns: { name: true, id: true } } } },
				worldChanges: { columns: { name: true, id: true } },
				region: { columns: { name: true, id: true } },
				sites: { columns: { name: true, id: true } },
			},
		}),
	all_sites: () =>
		db.query.sites.findMany({
			columns: {
				name: true,
				id: true,
				description: true,
			},
			with: {
				area: { columns: { name: true, id: true } },
				incomingRelations: { with: { sourceSite: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetSite: { columns: { name: true, id: true } } } },
				npcs: { with: { npc: { columns: { name: true, id: true } } } },
			},
		}),
	all_region_connections: () =>
		db.query.regionConnections.findMany({
			with: {
				sourceRegion: { columns: { name: true, id: true } },
				targetRegion: { columns: { name: true, id: true } },
			},
		}),
	all_site_encounters: () =>
		db.query.siteEncounters.findMany({
			with: {
				site: { columns: { name: true, id: true } },
			},
		}),
	all_site_links: () =>
		db.query.siteLinks.findMany({
			with: {
				sourceSite: { columns: { name: true, id: true } },
				targetSite: { columns: { name: true, id: true } },
			},
		}),
	all_site_secrets: () =>
		db.query.siteSecrets.findMany({
			with: {
				site: { columns: { name: true, id: true } },
			},
		}),

	region_by_id: (id: number) =>
		db.query.regions.findFirst({
			where: eq(regions.id, id),
			with: {
				territorialControl: { with: { faction: { columns: { name: true, id: true } } } },
				worldChanges: { columns: { name: true, id: true } },
				quests: { columns: { name: true, id: true } },
				areas: { columns: { id: true, name: true } },
				incomingRelations: { with: { sourceRegion: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetRegion: { columns: { name: true, id: true } } } },
			},
		}),
	area_by_id: (id: number) =>
		db.query.areas.findFirst({
			where: eq(areas.id, id),
			with: {
				territorialControl: { with: { faction: { columns: { name: true, id: true } } } },
				worldChanges: { columns: { name: true, id: true } },
				region: { columns: { name: true, id: true } },
				sites: { columns: { id: true, name: true } },
			},
		}),
	site_by_id: (id: number) =>
		db.query.sites.findFirst({
			where: eq(sites.id, id),
			with: {
				area: { columns: { id: true, name: true } },
				encounters: true,
				secrets: true,
				items: true,
				npcs: { with: { npc: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceSite: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetSite: { columns: { name: true, id: true } } } },
			},
		}),
	region_connection_by_id: (id: number) =>
		db.query.regionConnections.findFirst({
			where: eq(regionConnections.id, id),
			with: {
				details: true,
				sourceRegion: {
					with: { incomingRelations: { with: { sourceRegion: { columns: { name: true, id: true } } } } },
				},
				targetRegion: {
					with: { outgoingRelations: { with: { targetRegion: { columns: { name: true, id: true } } } } },
				},
			},
		}),
	site_link_by_id: (id: number) =>
		db.query.siteLinks.findFirst({
			where: eq(siteLinks.id, id),
			with: {
				targetSite: { with: { outgoingRelations: { with: { targetSite: { columns: { name: true, id: true } } } } } },
				sourceSite: { with: { incomingRelations: { with: { sourceSite: { columns: { name: true, id: true } } } } } },
			},
		}),
	site_encounter_by_id: (id: number) =>
		db.query.siteEncounters.findFirst({ where: eq(siteEncounters.id, id), with: { site: true } }),
	site_secret_by_id: (id: number) =>
		db.query.siteSecrets.findFirst({ where: eq(siteSecrets.id, id), with: { site: true } }),
}

export const regionToolDefinitions: Record<RegionTools, ToolDefinition> = {
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
