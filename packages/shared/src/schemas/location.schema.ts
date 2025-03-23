import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { jsonArray } from "../db/utils.js"
import { relations } from "drizzle-orm"

// Key enums only
const locationType = [
	"city",
	"town",
	"village",
	"dungeon",
	"wilderness",
	"ruin",
	"temple",
	"fortress",
	"cave",
	"planar",
] as const
const dangerLevels = ["safe", "low", "moderate", "high", "deadly"] as const

// Define the main locations table
export const locations = sqliteTable("locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	type: text("type", { enum: locationType }).notNull(),
	region: text("region").notNull(),
	description: jsonArray("description").notNull(),
	history: text("history").notNull(),
	dangerLevel: text("danger_level", { enum: dangerLevels }).notNull(),
	notableFeatures: jsonArray("notable_features").notNull(),
	secrets: jsonArray("secrets").notNull(),
})

export const locationAreas = sqliteTable("location_areas", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }), // Keep CASCADE as areas should be deleted with their parent location
	name: text("name").notNull(),
	description: jsonArray("description"),
	areaType: text("area_type").notNull(),
	environment: text("environment").notNull(),
	terrain: text("terrain").notNull(),
	climate: text("climate").notNull(),
	features: jsonArray("features").notNull(),
	encounters: jsonArray("encounters").notNull(),
	treasures: jsonArray("treasures").notNull(),
	creatures: jsonArray("creatures").notNull(),
	plants: jsonArray("plants").notNull(),
	loot: jsonArray("loot").notNull(),
})

// Simplified to just encounters
export const locationEncounters = sqliteTable("location_encounters", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }), // Keep CASCADE as encounters should be deleted with their parent location
	name: text("name").notNull(),
	description: jsonArray("description"),
	encounterType: text("encounter_type", {
		enum: ["combat", "social", "puzzle", "trap", "environmental"],
	}).notNull(),
	difficulty: text("difficulty"),
	creatures: jsonArray("creatures"),
	treasure: jsonArray("treasure"),
})

export const locationRelations = sqliteTable("location_relations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "set null" }), // Keep CASCADE as locations should be deleted with their parent location
	otherLocationId: integer("other_location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "set null" }), // Keep CASCADE as locations should be deleted with their parent location
	description: jsonArray("description"),
	notes: jsonArray("notes"),
})
