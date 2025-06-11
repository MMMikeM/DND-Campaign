import { Resource } from "@modelcontextprotocol/sdk/types.js"
import { db, logger } from ".."
import type { ResourceDefinition, ResourceHandler, ResourceLister } from "./resource-types"

const handleMapResource: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/map\/(\d+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid map URI: ${uri}`)
	}

	const mapId = Number.parseInt(match[1])
	logger.info(`Fetching map resource for ID: ${mapId}`)

	try {
		const map = await db.query.maps.findFirst({
			where: (maps, { eq }) => eq(maps.id, mapId),
		})

		if (!map) {
			throw new Error(`Map not found with ID: ${mapId}`)
		}

		if (!map.mapImage) {
			logger.warn(`Map image data is missing for map ID: ${mapId}`)
			throw new Error(`Map image data is missing for map ID: ${mapId}`)
		}

		const blob = map.mapImage.toString("base64")
		const mimeType = `image/${map.imageFormat}`

		return {
			uri,
			mimeType,
			blob,
		}
	} catch (error) {
		logger.error("Failed to fetch map resource", { error, mapId })
		throw new Error(`Failed to fetch map resource for ID: ${mapId}`)
	}
}

const listMaps: ResourceLister = async (): Promise<Resource[]> => {
	const maps = await db.query.maps.findMany({
		columns: { id: true, name: true },
		limit: 5,
	})
	return maps.map(
		(map): Resource => ({
			uri: `campaign://map/${map.id}`,
			name: `${map.name} (Map)`,
			description: `Battlemap image for ${map.name}`,
			mimeType: "image/*",
		}),
	)
}

export const mapResourceDefinition: ResourceDefinition = {
	uriTemplate: "campaign://map/{id}",
	name: "Campaign Map",
	description: "A battlemap image from the campaign library.",
	mimeType: "image/*",
	handler: handleMapResource,
	lister: listMaps,
}
