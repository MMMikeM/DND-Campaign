// maps/tables.ts

import { sql } from "drizzle-orm"
import { boolean, integer, pgTable, unique, uniqueIndex } from "drizzle-orm/pg-core"
import { bytea, cascadeFk, list, oneOf, pk, string } from "../../db/utils"

const imageFormats = ["png", "jpg", "webp"] as const

export const mapFiles = pgTable("map_files", {
	id: pk(),
	fileName: string("file_name").unique(),
	mapImage: bytea("map_image").notNull(),
	imageFormat: oneOf("image_format", imageFormats).notNull(),
	imageSize: integer("image_size").notNull(),
	imageWidth: integer("image_width").notNull(),
	imageHeight: integer("image_height").notNull(),
})

export const mapGroups = pgTable("map_groups", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	tags: list("tags"),
})

export const mapVariants = pgTable(
	"map_variants",
	{
		id: pk(),
		mapGroupId: cascadeFk("map_group_id", mapGroups.id),
		mapFileId: cascadeFk("map_file_id", mapFiles.id).unique(),
		isDefault: boolean("is_default").default(false).notNull(),

		variantName: string("name").unique(),

		description: list("description"),
		tags: list("tags"),
		creativePrompts: list("creative_prompts"),

		atmosphereAndSensoryDetails: list("atmosphere_and_sensory_details"),
		tacticalFeatures: list("tactical_features"),
		interactiveElements: list("interactive_elements"),
		environmentalHazards: list("environmental_hazards"),
	},
	(t) => [
		unique("map_id_variant_name_unique").on(t.mapGroupId, t.variantName),
		uniqueIndex("one_default_per_group_idx").on(t.mapGroupId).where(sql`${t.isDefault} = true`),
	],
)
export const enums = {
	imageFormats,
}
