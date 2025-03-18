import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import {
	locationFactions,
	locationFactionSchema,
	locationNpcs,
	locationNpcSchema,
} from "../relations.schema.js"
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

const tables = {
	locations,
	locationNotableFeatures,
	locationPointsOfInterest,
	locationConnections,
	locationDistricts,
	districtFeatures,
	locationAreas,
	areaFeatures,
	areaEncounters,
	areaTreasures,
}

type Operations = "select" | "insert" | "update"

const schemas = {
	select: {
		locations: createSelectSchema(locations),
		districtFeatures: createSelectSchema(districtFeatures),
		locationAreas: createSelectSchema(locationAreas),
		locationConnections: createSelectSchema(locationConnections),
		locationDistricts: createSelectSchema(locationDistricts),
		locationFactions: createSelectSchema(locationFactions),
		locationNotableFeatures: createSelectSchema(locationNotableFeatures),
		locationNpcs: createSelectSchema(locationNpcs),
		locationPointsOfInterest: createSelectSchema(locationPointsOfInterest),
	},
	insert: {
		locations: createInsertSchema(locations),
		locationNotableFeatures: createInsertSchema(locationNotableFeatures),
		locationPointsOfInterest: createInsertSchema(locationPointsOfInterest),
		locationConnections: createInsertSchema(locationConnections),
		locationDistricts: createInsertSchema(locationDistricts),
		districtFeatures: createInsertSchema(districtFeatures),
		locationAreas: createInsertSchema(locationAreas),
		areaFeatures: createInsertSchema(areaFeatures),
		areaEncounters: createInsertSchema(areaEncounters),
		areaTreasures: createInsertSchema(areaTreasures),
	},
	update: {
		locations: createUpdateSchema(locations),
		locationNotableFeatures: createUpdateSchema(locationNotableFeatures),
		locationPointsOfInterest: createUpdateSchema(locationPointsOfInterest),
		locationConnections: createUpdateSchema(locationConnections),
		locationDistricts: createUpdateSchema(locationDistricts),
		areaFeatures: createUpdateSchema(areaFeatures),
		areaEncounters: createUpdateSchema(areaEncounters),
		areaTreasures: createUpdateSchema(areaTreasures),
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
} as const satisfies Record<Operations, Record<keyof typeof tables | string, any>>

const { select } = schemas

// Define a typed Location schema using Zod
export const LocationSchema = select.locations.extend({
	notable_features: z.array(select.locationNotableFeatures.omit({ locationId: true })),
	npcs: z.array(locationNpcSchema.omit({ locationId: true })),
	factions: z.array(select.locationFactions.omit({ locationId: true })),
	points_of_interest: z.array(select.locationPointsOfInterest.omit({ locationId: true })),
	connections: z.array(select.locationConnections.omit({ locationId: true })),
	districts: z.array(select.locationDistricts.omit({ locationId: true })),
	areas: z.array(select.locationAreas.omit({ locationId: true })),
})
// Define types based on the Zod schemas
export type Location = z.infer<typeof LocationSchema>
export type NewLocation = z.infer<typeof schemas.insert.locations>
export type PointOfInterest = z.infer<typeof schemas.insert.locationPointsOfInterest>
export type District = z.infer<typeof schemas.insert.locationDistricts>
export type Area = z.infer<typeof schemas.insert.locationAreas>
