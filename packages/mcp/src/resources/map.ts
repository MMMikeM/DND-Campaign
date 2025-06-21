import type { Resource } from "@modelcontextprotocol/sdk/types.js"
import { db, logger } from ".."
import type { ResourceDefinition, ResourceHandler, ResourceLister } from "./resource-types"
import { createJsonResource } from "./resource-utils"

const listMaps: ResourceLister = async (): Promise<Resource[]> => {
	return [
		{
			uri: `campaign://map/list`,
			name: `List Maps with Details`,
			description: `List of map files with their associated variant details and map groups`,
			mimeType: "application/json",
		},
	]
}

const handleMapResource: ResourceHandler = async (uri: string) => {
	if (uri === "campaign://map/list") {
		logger.info("Fetching map list data")

		try {
			const maps = await db.query.mapFiles.findMany({
				columns: { id: true, fileName: true },
				with: {
					variant: {
						columns: {
							id: true,
							variantName: true,
							creativePrompts: true,
							description: true,
							gmNotes: true,
							tags: true,
						},
						with: {
							mapGroup: {
								columns: { name: true },
							},
						},
					},
				},
				where: (maps, { isNotNull }) => isNotNull(maps.mapImage),
				orderBy: (maps, { asc }) => [asc(maps.fileName)],
			})

			const mapData = {
				total_maps: maps.length,
				maps_with_variants: maps.filter((map) => map.variant).length,
				maps_lacking_variants: maps.filter((map) => !map.variant).length,
				map_list: maps.map((map) => ({
					id: map.id,
					fileName: map.fileName,
					hasVariant: !!map.variant,
					variant: map.variant
						? {
								id: map.variant.id,
								name: map.variant.variantName,
								mapGroupName: map.variant.mapGroup?.name || null,
								creativePrompts: map.variant.creativePrompts || [],
								description: map.variant.description || [],
								gmNotes: map.variant.gmNotes || [],
								tags: map.variant.tags || [],
							}
						: null,
				})),
			}

			return createJsonResource(uri, mapData)
		} catch (error) {
			logger.error("Failed to fetch map data", { error })
			throw new Error(`Failed to fetch map data: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	throw new Error(`Unknown map resource URI: ${uri}`)
}

export const mapResourceDefinition: ResourceDefinition = {
	uriTemplate: "campaign://map/list",
	name: "Campaign Map List",
	description: "List of map files with their associated variant details, groups, and tactical information",
	mimeType: "application/json",
	handler: handleMapResource,
	lister: listMaps,
}
