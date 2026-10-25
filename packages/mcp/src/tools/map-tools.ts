import { readdir, readFile, stat } from "node:fs/promises"
import { extname, join, parse } from "node:path"
import { enums, tables } from "@tome-master/shared/entities/maps"
import { imageSize } from "image-size"
import { db, logger } from "../index"
import { mapGroupTableEnum, mapVariantTableEnum, schemas, syncMapsSchema } from "./map-tools.schema"
import {
	createErrorResponse,
	createManageEntityHandler,
	createManageSchema,
	createResponse,
	nameAndId,
} from "./utils/tool.utils"
import type { ToolDefinition, ToolHandler } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const isImageFormat = (value: string): value is (typeof enums.imageFormats)[number] =>
	(enums.imageFormats as readonly string[]).includes(value)

const mapTables = {
	mapFiles: tables.mapFiles,
	mapGroups: tables.mapGroups,
	mapVariants: tables.mapVariants,
}

const createEntityGetters = createEntityGettersFactory(mapTables)

export const entityGetters = createEntityGetters({
	all_map_files: () =>
		db.query.mapFiles.findMany({
			with: { variant: { columns: { id: true } } },
			columns: { fileName: true, id: true },
			orderBy: { fileName: "asc" },
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
			where: { id },
			with: { variants: true },
		}),
	map_variant_by_id: (id: number) =>
		db.query.mapVariants.findFirst({
			where: { id },
			with: { mapGroup: nameAndId },
		}),
	map_file_by_id: (id: number) =>
		db.query.mapFiles.findFirst({
			where: { id },
			with: { variant: { columns: { id: true } } },
			columns: { id: true, fileName: true },
		}),
})

const synchronizeMapsHandler: ToolHandler = async () => {
	const directory = process.env.MAPS_DIRECTORY
	if (!directory) {
		return createErrorResponse(
			"MAPS_DIRECTORY environment variable is not set. Please configure the path to your maps folder.",
		)
	}
	const supportedFormats = [".jpeg", ".jpg", ".png", ".webp"]

	try {
		const files = await readdir(directory)
		const imageFiles = files.filter((file) => supportedFormats.includes(extname(file).toLowerCase()))

		if (imageFiles.length === 0) {
			return createErrorResponse(`No map images found in ${directory}.`)
		}

		// Sort files alphabetically to ensure consistent ordering
		const sortedImageFiles = imageFiles.sort()

		const newMaps = []
		for (const fileName of sortedImageFiles) {
			const mapName = parse(fileName).name
			const existingMap = await db.query.mapFiles.findFirst({
				where: { fileName: mapName },
			})

			if (existingMap) {
				logger.info(`Map '${mapName}' already exists. Skipping.`)
				newMaps.push(null)
				continue
			}

			const filePath = join(directory, fileName)
			const mapImage = await readFile(filePath)
			// The column enum spells it "jpg"; on disk the extension may be either.
			const extension = extname(fileName).slice(1).toLowerCase()
			const imageFormat = extension === "jpeg" ? "jpg" : extension
			if (!isImageFormat(imageFormat)) {
				logger.info(`Skipping '${fileName}': unsupported image format '${extension}'.`)
				newMaps.push(null)
				continue
			}
			const imageBytes = await stat(filePath).then((stats) => stats.size)
			const { width, height } = imageSize(mapImage)

			const [newMap] = await db
				.insert(tables.mapFiles)
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
		return createResponse(`Synchronization complete. Added ${addedMaps.length} new maps.`)
	} catch (error) {
		logger.error({ err: error, directory }, "Failed to synchronize maps directory")
		return createErrorResponse(`Failed to synchronize maps from directory: ${directory}`)
	}
}

export const mapToolDefinitions: Record<
	"manage_map_group" | "manage_map_variant" | "synchronize_maps",
	ToolDefinition
> = {
	manage_map_group: {
		enums,
		description: "Manage map groups, which collect the variants of one map under a shared theme or setting.",
		inputSchema: createManageSchema(schemas, mapGroupTableEnum),
		handler: createManageEntityHandler("manage_map_group", mapTables, mapGroupTableEnum, schemas),
		annotations: {
			title: "Manage Map Groups",
			readOnlyHint: false,
			destructiveHint: true,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
	manage_map_variant: {
		enums,
		description: "Manage map variants: the individual map images in a group and their tactical details.",
		inputSchema: createManageSchema(schemas, mapVariantTableEnum),
		handler: createManageEntityHandler("manage_map_variant", mapTables, mapVariantTableEnum, schemas),
		annotations: {
			title: "Manage Map Variants",
			readOnlyHint: false,
			destructiveHint: true,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
	synchronize_maps: {
		enums,
		description: "Synchronize map images from a directory with the database.",
		inputSchema: syncMapsSchema,
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
