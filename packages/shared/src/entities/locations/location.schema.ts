import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

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
})

// Define the location features table
export const locationNotableFeatures = sqliteTable("location_notable_features", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	feature: text("feature").notNull(),
})

// Define the location points of interest table
export const locationPointsOfInterest = sqliteTable("location_points_of_interest", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description").notNull(),
})

// Define the location connections table
export const locationConnections = sqliteTable("location_connections", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	connectedLocationId: integer("connected_location_id")
		.notNull()
		.references(() => locations.id),
})

// Define the location districts table
export const locationDistricts = sqliteTable("location_districts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description").notNull(),
})

// Define the district features table
export const districtFeatures = sqliteTable("district_features", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	districtId: integer("district_id")
		.notNull()
		.references(() => locationDistricts.id, { onDelete: "cascade" }),
	feature: text("feature").notNull(),
})

// Define the location areas table
export const locationAreas = sqliteTable("location_areas", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description").notNull(),
})

// Define the area features table
export const areaFeatures = sqliteTable("area_features", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	areaId: integer("area_id")
		.notNull()
		.references(() => locationAreas.id, { onDelete: "cascade" }),
	feature: text("feature").notNull(),
})

// Define the area encounters table
export const areaEncounters = sqliteTable("area_encounters", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	areaId: integer("area_id")
		.notNull()
		.references(() => locationAreas.id, { onDelete: "cascade" }),
	encounter: text("encounter").notNull(),
})

// Define the area treasures table
export const areaTreasures = sqliteTable("area_treasures", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	areaId: integer("area_id")
		.notNull()
		.references(() => locationAreas.id, { onDelete: "cascade" }),
	treasure: text("treasure").notNull(),
})

// Define the district NPCs table
export const districtNpcs = sqliteTable("district_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	districtId: integer("district_id")
		.notNull()
		.references(() => locationDistricts.id, { onDelete: "cascade" }),
	npcId: integer("npc_id").notNull(),
})

// Define the area NPCs table
export const areaNpcs = sqliteTable("area_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	areaId: integer("area_id")
		.notNull()
		.references(() => locationAreas.id, { onDelete: "cascade" }),
	npcId: integer("npc_id").notNull(),
})

// Define location NPCs and factions tables
export const locationNpcs = sqliteTable("location_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	locationId: integer("location_id")
		.notNull()
		.references(() => locations.id, { onDelete: "cascade" }),
	npcId: integer("npc_id").notNull(),
})
