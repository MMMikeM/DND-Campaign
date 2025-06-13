import { readdir, readFile, stat } from "node:fs/promises"
import { extname, join, parse } from "node:path"
import { tables } from "@tome-master/shared"
import { imageSize } from "image-size"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import { schemas, syncMapsSchema, tableEnum } from "./map-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition, ToolHandler } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const mapTables = {
	mapDetails: tables.mapTables.mapDetails,
}

const createEntityGetters = createEntityGettersFactory(mapTables)

export const entityGetters = createEntityGetters({
	all_map_details: () =>
		db.query.mapDetails.findMany({
			with: { map: { columns: { id: true }, with: { site: { columns: { id: true, name: true } } } } },
		}),

	map_detail_by_id: (id: number) =>
		db.query.mapDetails.findFirst({
			where: (mapDetails, { eq }) => eq(mapDetails.mapId, id),
			with: { map: { columns: { id: true }, with: { site: { columns: { id: true, name: true } } } } },
		}),
})

const synchronizeMapsHandler: ToolHandler = async () => {
	const directory = process.env.MAPS_DIRECTORY
	if (!directory) {
		throw new Error("MAPS_DIRECTORY environment variable is not set. Please configure the path to your maps folder.")
	}
	const supportedFormats = [".jpeg", ".jpg", ".png", ".webp"]

	try {
		const files = await readdir(directory)
		const imageFiles = files.filter((file) => supportedFormats.includes(extname(file).toLowerCase()))

		if (imageFiles.length === 0) {
			throw new Error("No new map images found to synchronize.")
		}

		const newMaps = await Promise.all(
			imageFiles.map(async (fileName) => {
				const mapName = parse(fileName).name
				const existingMap = await db.query.maps.findFirst({
					where: (maps, { eq }) => eq(maps.fileName, mapName),
				})

				if (existingMap) {
					logger.info(`Map '${mapName}' already exists. Skipping.`)
					return null
				}

				const filePath = join(directory, fileName)
				const mapImage = await readFile(filePath)
				const imageFormat = extname(fileName).slice(1) as "jpeg" | "png" | "webp"
				const imageBytes = await stat(filePath).then((stats) => stats.size)
				const { width, height } = imageSize(mapImage)

				const [newMap] = await db
					.insert(tables.mapTables.maps)
					.values({
						fileName: mapName,
						mapImage,
						imageFormat,
						imageHeight: height,
						imageWidth: width,
						imageSize: imageBytes,
					})
					.returning()

				logger.info(`Added new map: ${mapName}`)
				return newMap
			}),
		)

		const addedMaps = newMaps.filter(Boolean)
		return {
			message: `Synchronization complete. Added ${addedMaps.length} new maps.`,
			success: true,
		}
	} catch (error) {
		logger.error("Failed to synchronize maps directory", { err: error, directory })
		throw new Error(`Failed to synchronize maps from directory: ${directory}`)
	}
}

export const mapToolDefinitions: Record<"manage_map" | "synchronize_maps", ToolDefinition> = {
	manage_map: {
		description: "Manage map assets and their associated tactical details.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_map", mapTables, tableEnum, schemas),
		annotations: {
			title: "Manage Maps",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
	synchronize_maps: {
		description: "Synchronize map images from a directory with the database.",
		inputSchema: zodToMCP(syncMapsSchema),
		handler: synchronizeMapsHandler,
		annotations: {
			title: "Synchronize Maps",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: true,
		},
	},
}
