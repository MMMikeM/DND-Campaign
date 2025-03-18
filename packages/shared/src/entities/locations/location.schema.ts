import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

// Define the main locations table
export const locations = sqliteTable("locations", {
	id: integer("id").primaryKey().notNull(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	region: text("region"),
	description: text("description").notNull(),
	history: text("history"),
	dangerLevel: text("danger_level"),
	factionControl: text("faction_control"),
})

// Define the location features table
export const locationNotableFeatures = sqliteTable(
	"location_notable_features",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		feature: text("feature").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.feature] })],
)

// Define the location points of interest table
export const locationPointsOfInterest = sqliteTable(
	"location_points_of_interest",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.name] })],
)

// Define the location connections table
export const locationConnections = sqliteTable(
	"location_connections",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		connectedLocationId: integer("connected_location_id")
			.notNull()
			.references(() => locations.id),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.connectedLocationId] })],
)

// Define the location districts table
export const locationDistricts = sqliteTable(
	"location_districts",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		districtId: integer("district_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.districtId] })],
)

// Define the district features table
export const districtFeatures = sqliteTable(
	"district_features",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		districtId: integer("district_id").notNull(),
		feature: text("feature").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.districtId, table.feature] })],
)

// Define the location areas table
export const locationAreas = sqliteTable(
	"location_areas",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaId: integer("area_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.areaId] })],
)

// Define the area features table
export const areaFeatures = sqliteTable(
	"area_features",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaId: integer("area_id").notNull(),
		feature: text("feature").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.areaId, table.feature] })],
)

// Define the area encounters table
export const areaEncounters = sqliteTable(
	"area_encounters",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaId: integer("area_id").notNull(),
		encounter: text("encounter").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.areaId, table.encounter] })],
)

// Define the area treasures table
export const areaTreasures = sqliteTable(
	"area_treasures",
	{
		locationId: integer("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaId: integer("area_id").notNull(),
		treasure: text("treasure").notNull(),
	},
	(table) => [primaryKey({ columns: [table.locationId, table.areaId, table.treasure] })],
)

// Create Zod schemas for insert and select operations
export const insertLocationSchema = createInsertSchema(locations)
export const selectLocationSchema = createSelectSchema(locations)
export const insertPointOfInterestSchema = createInsertSchema(locationPointsOfInterest)
export const selectPointOfInterestSchema = createSelectSchema(locationPointsOfInterest)
export const insertDistrictSchema = createInsertSchema(locationDistricts)
export const selectDistrictSchema = createSelectSchema(locationDistricts)
export const insertAreaSchema = createInsertSchema(locationAreas)
export const selectAreaSchema = createSelectSchema(locationAreas)

// Define a typed Location schema using Zod
export const LocationSchema = selectLocationSchema.extend({
	notable_features: z.array(z.string()),
	npcs: z.array(z.number()),
	factions: z.array(z.number()),
	points_of_interest: z.array(selectPointOfInterestSchema.omit({ locationId: true })),
	connections: z.array(z.number()),
	districts: z.record(
		z.object({
			description: z.string(),
			features: z.array(z.string()).optional(),
			npcs: z.array(z.number()).optional(),
		}),
	),
	areas: z.record(
		z.object({
			description: z.string(),
			features: z.array(z.string()).optional(),
			encounters: z.array(z.string()).optional(),
			treasure: z.array(z.string()).optional(),
			npcs: z.array(z.number()).optional(),
		}),
	),
})

// Define types based on the Zod schemas
export type Location = z.infer<typeof LocationSchema>
export type NewLocation = z.infer<typeof insertLocationSchema>
export type PointOfInterest = z.infer<typeof selectPointOfInterestSchema>
export type District = z.infer<typeof selectDistrictSchema>
export type Area = z.infer<typeof selectAreaSchema>
