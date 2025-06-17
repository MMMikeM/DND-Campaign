// maps/tables.ts
import { integer, pgTable } from "drizzle-orm/pg-core"
import { bytea, cascadeFk, list, oneOf, pk, string } from "../../db/utils"

const imageFormats = ["png", "jpg", "webp"] as const

export const mapFiles = pgTable("maps", {
	id: pk(),
	fileName: string("file_name").unique(),
	mapImage: bytea("map_image").notNull(),
	imageFormat: oneOf("image_format", imageFormats).notNull(),
	imageSize: integer("image_size").notNull(),
	imageWidth: integer("image_width").notNull(),
	imageHeight: integer("image_height").notNull(),
})

export const maps = pgTable("map_details", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	mapId: cascadeFk("map_id", mapFiles.id),

	coverOptions: list("cover_options"),
	elevationFeatures: list("elevation_features"),
	movementRoutes: list("movement_routes"),
	difficultTerrain: list("difficult_terrain"),
	chokePoints: list("choke_points"),
	sightLines: list("sight_lines"),
	tacticalPositions: list("tactical_positions"),
	interactiveElements: list("interactive_elements"),
	environmentalHazards: list("environmental_hazards"),
})

export const enums = {
	imageFormats,
}
