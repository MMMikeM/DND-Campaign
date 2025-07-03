import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./region-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.regionTables)

export const entityGetters = createEntityGetters({
	all_regions: () =>
		db.query.regions.findMany({
			columns: {
				name: true,
				id: true,
				description: true,
			},
			with: {
				areas: {
					...nameAndId,
					with: { sites: nameAndId },
				},
				incomingRelations: { with: { sourceRegion: nameAndId } },
				outgoingRelations: { with: { targetRegion: nameAndId } },
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
				region: nameAndId,
				sites: nameAndId,
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
				area: nameAndId,
				mapGroup: { with: { variants: true } },
				incomingRelations: { with: { sourceSite: nameAndId } },
				outgoingRelations: { with: { targetSite: nameAndId } },
			},
		}),
	all_site_encounters: () =>
		db.query.siteEncounters.findMany({
			with: { site: nameAndId },
		}),
	all_site_links: () =>
		db.query.siteLinks.findMany({
			with: {
				sourceSite: nameAndId,
				targetSite: nameAndId,
			},
		}),
	all_site_secrets: () =>
		db.query.siteSecrets.findMany({
			with: { site: nameAndId },
		}),

	region_by_id: (id: number) =>
		db.query.regions.findFirst({
			where: (regions, { eq }) => eq(regions.id, id),
			with: {
				areas: true,
				conflicts: true,
				factionInfluence: true,
				incomingRelations: { with: { sourceRegion: nameAndId } },
				outgoingRelations: { with: { targetRegion: nameAndId } },
			},
		}),
	area_by_id: (id: number) =>
		db.query.areas.findFirst({
			where: (areas, { eq }) => eq(areas.id, id),
			with: {
				factionInfluence: true,
				sites: true,
				region: nameAndId,
			},
		}),
	site_by_id: (id: number) =>
		db.query.sites.findFirst({
			where: (sites, { eq }) => eq(sites.id, id),
			with: {
				factionHqs: true,
				mapGroup: nameAndId,
				secret: true,
				questStages: nameAndId,
				questHooks: nameAndId,
				area: nameAndId,
				incomingRelations: { with: { sourceSite: nameAndId } },
				outgoingRelations: { with: { targetSite: nameAndId } },
			},
		}),

	site_link_by_id: (id: number) =>
		db.query.siteLinks.findFirst({
			where: (siteLinks, { eq }) => eq(siteLinks.id, id),
			with: {
				targetSite: { with: { outgoingRelations: { with: { targetSite: nameAndId } } } },
				sourceSite: { with: { incomingRelations: { with: { sourceSite: nameAndId } } } },
			},
		}),
	site_encounter_by_id: (id: number) =>
		db.query.siteEncounters.findFirst({
			where: (siteEncounters, { eq }) => eq(siteEncounters.id, id),
			with: { site: true },
		}),
	site_secret_by_id: (id: number) =>
		db.query.siteSecrets.findFirst({
			where: (siteSecrets, { eq }) => eq(siteSecrets.siteId, id),
			with: { site: true },
		}),
	all_region_connections: () =>
		db.query.regionConnections.findMany({
			with: {
				sourceRegion: nameAndId,
				targetRegion: nameAndId,
			},
		}),
	region_connection_by_id: (id: number) =>
		db.query.regionConnections.findFirst({
			where: (regionConnections, { eq }) => eq(regionConnections.id, id),
			with: {
				sourceRegion: nameAndId,
				targetRegion: nameAndId,
			},
		}),
})

export const regionToolDefinitions: Record<"manage_region", ToolDefinition> = {
	manage_region: {
		enums: tables.regionTables.enums,
		description:
			"Manage region-related entities. Sites are tactical locations and MUST be linked to an existing map via `mapId` on creation.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_region", tables.regionTables, tableEnum, schemas),
		annotations: {
			title: "Manage Regions",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
