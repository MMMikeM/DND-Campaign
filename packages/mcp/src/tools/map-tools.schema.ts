import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, type Schema } from "./utils/tool.utils"

const mapTables = {
	mapDetails: tables.mapTables.mapDetails,
}

// const { imageFormats } = tables.mapTables.enums

const { mapDetails } = mapTables

type TableNames = CreateTableNames<typeof mapTables>

export const tableEnum = ["mapDetails"] as const satisfies TableNames

export const schemas = {
	mapDetails: createInsertSchema(mapDetails, {
		name: (s) => s.describe("Name of the map"),
		mapId: id.describe("Required ID of the map these details belong to"),
		creativePrompts: (s) => s.describe("Adventure hooks and creative ideas inspired by the map"),
		description: (s) => s.describe("Overall description of the map's features and atmosphere"),
		gmNotes: (s) => s.describe("Private notes for the GM about this map"),
		tags: (s) => s.describe("Descriptive tags for categorization and search"),
		coverOptions: (s) => s.describe("Areas offering cover (full, half, three-quarters)"),
		elevationFeatures: (s) => s.describe("Significant changes in elevation and high/low ground"),
		movementRoutes: (s) => s.describe("Primary and secondary paths for movement across the map"),
		difficultTerrain: (s) => s.describe("Areas that impede movement"),
		chokePoints: (s) => s.describe("Narrow passages or areas that restrict movement"),
		sightLines: (s) => s.describe("Clear lines of sight for ranged attacks and observation"),
		tacticalPositions: (s) => s.describe("Advantageous positions for combatants"),
		interactiveElements: (s) => s.describe("Objects or features characters can interact with"),
		environmentalHazards: (s) => s.describe("Dangers posed by the environment itself"),
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
