import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./region-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

const {
	regionTables: { sites, areas, regions, regionConnections, siteEncounters, siteLinks, siteSecrets },
} = tables

type RegionGetters = CreateEntityGetters<typeof tables.regionTables>

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
				incomingRelations: { with: { sourceRegion: { columns: { name: true, id: true } }, details: true } },
				outgoingRelations: { with: { targetRegion: { columns: { name: true, id: true } }, details: true } },
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
				areas: true,
				quests: { columns: { name: true, id: true } },
				worldChanges: { columns: { name: true, id: true } },
				territorialControl: { with: { faction: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceRegion: { columns: { name: true, id: true } }, details: true } },
				outgoingRelations: { with: { targetRegion: { columns: { name: true, id: true } }, details: true } },
			},
		}),
	area_by_id: (id: number) =>
		db.query.areas.findFirst({
			where: eq(areas.id, id),
			with: {
				sites: true,
				region: { columns: { name: true, id: true } },
				worldChanges: { columns: { name: true, id: true } },
				territorialControl: { with: { faction: { columns: { name: true, id: true } } } },
			},
		}),
	site_by_id: (id: number) =>
		db.query.sites.findFirst({
			where: eq(sites.id, id),
			with: {
				items: true,
				secrets: true,
				encounters: true,
				area: { columns: { id: true, name: true } },
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
					with: { incomingRelations: { with: { sourceRegion: { columns: { name: true, id: true } }, details: true } } },
				},
				targetRegion: {
					with: { outgoingRelations: { with: { targetRegion: { columns: { name: true, id: true } }, details: true } } },
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

export const regionToolDefinitions: Record<"manage_region", ToolDefinition> = {
	manage_region: {
		description: "Manage region-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_region", tables.regionTables, tableEnum, schemas),
	},
}
