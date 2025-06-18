import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, type Schema } from "./utils/tool.utils"

const mapTables = {
	maps: tables.mapTables.maps,
}

// const { imageFormats } = tables.mapTables.enums

const { maps } = mapTables

type TableNames = CreateTableNames<typeof mapTables>

export const tableEnum = ["maps"] as const satisfies TableNames

export const schemas = {
	maps: createInsertSchema(maps, {
		name: (s) => s.describe("Name of the map"),
		mapId: id.describe("Required ID of the map these details belong to"),
		creativePrompts: list.describe("Adventure hooks and creative ideas inspired by the map"),
		description: list.describe("Overall description of the map's features and atmosphere"),
		gmNotes: list.describe("Private notes for the GM about this map"),
		tags: list.describe("Descriptive tags for categorization and search"),
		coverOptions: list.describe("Areas offering cover (full, half, three-quarters)"),
		elevationFeatures: list.describe("Significant changes in elevation and high/low ground"),
		movementRoutes: list.describe("Primary and secondary paths for movement across the map"),
		difficultTerrain: list.describe("Areas that impede movement"),
		chokePoints: list.describe("Narrow passages or areas that restrict movement"),
		sightLines: list.describe("Clear lines of sight for ranged attacks and observation"),
		tacticalPositions: list.describe("Advantageous positions for combatants"),
		interactiveElements: list.describe("Objects or features characters can interact with"),
		environmentalHazards: list.describe("Dangers posed by the environment itself"),
	})
		.omit({ id: true })
		.strict()
		.describe("Tactical analysis and descriptive details for a specific map, usually AI-generated"),
} as const satisfies Schema<TableNames[number]>

export const syncMapsSchema = z
	.object({})
	.describe(
		"Scans a pre-configured directory for map images and adds any new maps to the database, making them available for use in the campaign.",
	)
