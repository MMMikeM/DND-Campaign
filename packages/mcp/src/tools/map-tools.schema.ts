import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, type Schema } from "./utils/tool.utils"

const mapTables = {
	mapVariants: tables.mapTables.mapVariants,
	mapGroups: tables.mapTables.mapGroups,
}

// const { imageFormats } = tables.mapTables.enums

const { mapVariants, mapGroups } = mapTables

type TableNames = CreateTableNames<typeof mapTables>

export const tableEnum = ["mapVariants", "mapGroups"] as const satisfies TableNames

export const schemas = {
	mapVariants: createInsertSchema(mapVariants, {
		variantName: (s) => s.describe("Name of the map"),
		isDefault: (s) => s.describe("Whether this is the default variant for the map group"),
		mapFileId: id.describe("Required ID of the map file these details belong to"),
		mapGroupId: id.describe("Required ID of the map these details belong to"),
		creativePrompts: list.describe("Adventure hooks and creative ideas inspired by the map"),
		description: list.describe("Overall description of the map's features and atmosphere"),
		tags: list.describe("Descriptive tags for categorization and search"),
		interactiveElements: list.describe("Objects or features characters can interact with"),
		environmentalHazards: list.describe("Dangers posed by the environment itself"),
		atmosphereAndSensoryDetails: list.describe("Atmosphere and sensory details of the map"),
		tacticalFeatures: list.describe("Tactical features of the map"),
	})
		.omit({ id: true })
		.strict()
		.describe("Tactical analysis and descriptive details for a specific map, ensure a map group first exists"),
	mapGroups: createInsertSchema(mapGroups, {
		name: (s) => s.describe("Name of the map group"),
		creativePrompts: list.describe("Adventure hooks and creative ideas inspired by the map"),
		description: list.describe("Overall description of the map's features and atmosphere"),
		tags: list.describe("Descriptive tags for categorization and search"),
	})
		.omit({ id: true })
		.strict()
		.describe("A group of maps that share a common theme or setting"),
} as const satisfies Schema<TableNames[number]>

export const syncMapsSchema = z
	.object({})
	.describe(
		"Scans a pre-configured directory for map images and adds any new maps to the database, making them available for use in the campaign.",
	)
