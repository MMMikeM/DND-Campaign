import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./region-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
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
					columns: { name: true, id: true },
					with: {
						sites: { columns: { name: true, id: true } },
					},
				},
				quests: { columns: { name: true, id: true } },
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
				npcAssociations: { with: { npc: { columns: { name: true, id: true } } } },
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
			where: (regions, { eq }) => eq(regions.id, id),
			with: {
				areas: true,
				quests: { columns: { name: true, id: true } },
				conflicts: true,
				factionInfluence: true,
				incomingRelations: { with: { sourceRegion: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetRegion: { columns: { name: true, id: true } } } },
			},
		}),
	area_by_id: (id: number) =>
		db.query.areas.findFirst({
			where: (areas, { eq }) => eq(areas.id, id),
			with: {
				factionInfluence: true,
				sites: true,
				region: { columns: { name: true, id: true } },
			},
		}),
	site_by_id: (id: number) =>
		db.query.sites.findFirst({
			where: (sites, { eq }) => eq(sites.id, id),
			with: {
				secrets: true,
				encounters: true,
				area: { columns: { id: true, name: true } },
				npcAssociations: { with: { npc: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceSite: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetSite: { columns: { name: true, id: true } } } },
			},
		}),

	site_link_by_id: (id: number) =>
		db.query.siteLinks.findFirst({
			where: (siteLinks, { eq }) => eq(siteLinks.id, id),
			with: {
				targetSite: { with: { outgoingRelations: { with: { targetSite: { columns: { name: true, id: true } } } } } },
				sourceSite: { with: { incomingRelations: { with: { sourceSite: { columns: { name: true, id: true } } } } } },
			},
		}),
	site_encounter_by_id: (id: number) =>
		db.query.siteEncounters.findFirst({
			where: (siteEncounters, { eq }) => eq(siteEncounters.id, id),
			with: { site: true },
		}),
	site_secret_by_id: (id: number) =>
		db.query.siteSecrets.findFirst({ where: (siteSecrets, { eq }) => eq(siteSecrets.id, id), with: { site: true } }),
})

export const regionToolDefinitions: Record<"manage_region", ToolDefinition> = {
	manage_region: {
		description:
			"Manage region-related entities. IMPORTANT: Sites represent tactical battlemap locations and MUST include battlemap image data (battlemapImage, imageFormat, imageSize, imageWidth, imageHeight) when creating new sites.",
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
