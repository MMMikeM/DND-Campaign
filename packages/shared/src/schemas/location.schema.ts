import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { json } from "../db/utils.js"

// Define the main locations table
export const locations = sqliteTable("locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	type: text("type").notNull(),
	region: text("region"),
	description: text("description").notNull(),
	history: text("history"),
	dangerLevel: text("danger_level"),
	factionControl: text("faction_control"),
	// JSON columns for one-to-many relations
	notableFeatures: json<string[]>("notable_features"),
})

export const locationAreas = sqliteTable("location_areas", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description").notNull(),
	areaType: text("area_type").notNull(),
	environment: text("environment").notNull(),
	terrain: text("terrain").notNull(),
	climate: text("climate").notNull(),

	// JSON columns for one-to-many relations
	features: json<string[]>("features").notNull(),
	encounters: json<string[]>("encounters").notNull(),
	treasures: json<string[]>("treasures").notNull(),
	creatures: json<string[]>("creatures").notNull(),
	plants: json<string[]>("plants").notNull(),
	loot: json<string[]>("loot").notNull(),
})
