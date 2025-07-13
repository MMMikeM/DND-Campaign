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
				orderBy: (maps, { asc }) => [asc(maps.fileName)],
			})

			// Get all map variants to join with map files
			const mapVariants = await db.query.mapVariants.findMany({
				columns: {
					id: true,
					mapFileId: true,
					variantName: true,
					creativePrompts: true,
					description: true,
					tags: true,
				},
				with: {
					mapGroup: {
						columns: { name: true },
					},
				},
			})

			// Create a map of mapFileId to variants
			const variantsByMapFile = new Map<number, (typeof mapVariants)[0][]>()
			for (const variant of mapVariants) {
				if (!variantsByMapFile.has(variant.mapFileId)) {
					variantsByMapFile.set(variant.mapFileId, [])
				}
				variantsByMapFile.get(variant.mapFileId)!.push(variant)
			}

			const mapData = {
				total_maps: maps.length,
				maps_with_variants: maps.filter((map) => variantsByMapFile.has(map.id)).length,
				maps_lacking_variants: maps.filter((map) => !variantsByMapFile.has(map.id)).length,
				map_list: maps.map((map) => {
					const variants = variantsByMapFile.get(map.id) || []
					const primaryVariant = variants[0] || null

					return {
						id: map.id,
						fileName: map.fileName,
						hasVariant: variants.length > 0,
						variant: primaryVariant
							? {
									id: primaryVariant.id,
									name: primaryVariant.variantName,
									mapGroupName: primaryVariant.mapGroup?.name || null,
									creativePrompts: primaryVariant.creativePrompts || [],
									description: primaryVariant.description || [],
									tags: primaryVariant.tags || [],
								}
							: null,
					}
				}),
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
