import { integer, pgTable } from "drizzle-orm/pg-core"
import { bytea, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"

const imageFormats = ["png", "jpg", "webp"] as const

export const maps = pgTable("maps", {
	id: pk(),
	name: string("name").unique().notNull(),
	mapImage: bytea("map_image").notNull(),
	imageFormat: oneOf("image_format", imageFormats).notNull(),
	imageSize: integer("image_size").notNull(),
	imageWidth: integer("image_width").notNull(),
	imageHeight: integer("image_height").notNull(),
})

export const mapDetails = pgTable("map_details", {
	mapId: string("map_id")
		.primaryKey()
		.references(() => maps.id, { onDelete: "cascade" }),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	// Battlemap Tactical Analysis
	coverOptions: list("cover_options"),
	elevationFeatures: list("elevation_features"),
	movementRoutes: list("movement_routes"),
	difficultTerrain: list("difficult_terrain"),
	chokePoints: list("choke_points"),
	sightLines: list("sight_lines"),
	tacticalPositions: list("tactical_positions"),
	interactiveElements: list("interactive_elements"),
	environmentalHazards: list("environmental_hazards"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})
