import { readdir, readFile, stat } from "node:fs/promises"
import { extname, join, parse } from "node:path"
import { tables } from "@tome-master/shared"
import { imageSize } from "image-size"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import { schemas, syncMapsSchema, tableEnum } from "./map-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
import type { ToolDefinition, ToolHandler } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const mapTables = {
	mapFiles: tables.mapTables.mapFiles,
	mapGroups: tables.mapTables.mapGroups,
	mapVariants: tables.mapTables.mapVariants,
}

const createEntityGetters = createEntityGettersFactory(mapTables)

export const entityGetters = createEntityGetters({
	all_map_files: () =>
		db.query.mapFiles.findMany({
			with: { variant: { columns: { id: true } } },
			columns: { fileName: true, id: true },
			orderBy: (mapFiles, { asc }) => [asc(mapFiles.fileName)],
		}),
	all_map_groups: () =>
		db.query.mapGroups.findMany({
			with: {
				variants: {
					columns: { id: true, description: true, variantName: true },
				},
			},
		}),
	all_map_variants: () =>
		db.query.mapVariants.findMany({
			with: { mapGroup: true, mapFile: true },
		}),

	map_group_by_id: (id: number) =>
		db.query.mapGroups.findFirst({
			where: (mapGroups, { eq }) => eq(mapGroups.id, id),
			with: { variants: true },
		}),
	map_variant_by_id: (id: number) =>
		db.query.mapVariants.findFirst({
			where: (mapVariants, { eq }) => eq(mapVariants.id, id),
			with: { mapGroup: nameAndId },
		}),
	map_file_by_id: (id: number) =>
		db.query.mapFiles.findFirst({
			where: (mapFiles, { eq }) => eq(mapFiles.id, id),
			with: { variant: { columns: { id: true } } },
			columns: { id: true, fileName: true },
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

		// Sort files alphabetically to ensure consistent ordering
		const sortedImageFiles = imageFiles.sort()

		const newMaps = []
		for (const fileName of sortedImageFiles) {
			const mapName = parse(fileName).name
			const existingMap = await db.query.mapFiles.findFirst({
				where: (maps, { eq }) => eq(maps.fileName, mapName),
			})

			if (existingMap) {
				logger.info(`Map '${mapName}' already exists. Skipping.`)
				newMaps.push(null)
				continue
			}

			const filePath = join(directory, fileName)
			const mapImage = await readFile(filePath)
			const imageFormat = extname(fileName).slice(1) as "jpeg" | "png" | "webp"
			const imageBytes = await stat(filePath).then((stats) => stats.size)
			const { width, height } = imageSize(mapImage)

			const [newMap] = await db
				.insert(tables.mapTables.mapFiles)
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
			newMaps.push(newMap)
		}

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

export const mapToolDefinitions: Record<
	"manage_map_group" | "manage_map_variant" | "synchronize_maps",
	ToolDefinition
> = {
	manage_map_group: {
		enums: tables.mapTables.enums,
		description: "Manage map groups and their associated tactical details.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_map_group", mapTables, tableEnum, schemas),
		annotations: {
			title: "Manage Map Groups",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
	manage_map_variant: {
		enums: tables.mapTables.enums,
		description: "Manage map assets and their associated tactical details.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_map_variant", mapTables, tableEnum, schemas),
		annotations: {
			title: "Manage Maps",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
	synchronize_maps: {
		enums: tables.mapTables.enums,
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
