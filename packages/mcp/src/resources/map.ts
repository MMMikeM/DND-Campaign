import type { Resource } from "@modelcontextprotocol/sdk/types.js"
import sharp from "sharp"
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
		const map = await db.query.mapFiles.findFirst({
			where: (maps, { eq }) => eq(maps.id, mapId),
		})

		if (!map) {
			throw new Error(`Map not found with ID: ${mapId}`)
		}

		if (!map.mapImage) {
			logger.warn(`Map image data is missing for map ID: ${mapId}`)
			throw new Error(`Map image data is missing for map ID: ${mapId}`)
		}

		const pipeline = sharp(map.mapImage).resize(1536, 1536, {
			fit: "inside",
			withoutEnlargement: true,
		})

		switch (map.imageFormat) {
			case "jpeg":
				pipeline.jpeg({ quality: 60, progressive: true })
				break
			case "png":
				pipeline.png({ compressionLevel: 8, adaptiveFiltering: true })
				break
			case "webp":
				pipeline.webp({ quality: 60 })
				break
		}

		const processedImageBuffer = await pipeline.toBuffer()
		const blob = processedImageBuffer.toString("base64")
		const mimeType = `image/${map.imageFormat}`

		return {
			uri,
			mimeType,
			blob,
		}
	} catch (error) {
		logger.error("Failed to fetch map resource", { err: error, mapId })
		throw new Error(`Failed to fetch map resource for ID: ${mapId}`)
	}
}

const listMaps: ResourceLister = async (): Promise<Resource[]> => {
	const maps = await db.query.mapFiles.findMany({
		columns: { id: true, fileName: true },
		with: { mapDetails: { columns: { name: true } } },
		where: (maps, { isNotNull }) => isNotNull(maps.mapImage),
		limit: 5,
	})
	return maps.map(
		(map): Resource => ({
			uri: `campaign://map/${map.id}`,
			name: `${map.fileName} (Map)`,
			description: `Battlemap image for ${map.mapDetails?.name}`,
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
