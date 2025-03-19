import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod"
import {
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
	districtNpcs,
	areaNpcs,
	locationNpcs,
} from "./location.schema.js"
import { z } from "zod"
import {
	insertLocationFactionSchema,
	insertLocationNpcSchema,
	locationFactionSchema,
	locationNpcSchema,
} from "../relations.zod"
import { locationFactions } from "../relations.schema.js"

const locationSchemas = {
	select: {
		locations: createSelectSchema(locations),
		locationNotableFeatures: createSelectSchema(locationNotableFeatures),
		locationPointsOfInterest: createSelectSchema(locationPointsOfInterest),
		locationConnections: createSelectSchema(locationConnections),
		locationDistricts: createSelectSchema(locationDistricts),
		districtFeatures: createSelectSchema(districtFeatures),
		locationAreas: createSelectSchema(locationAreas),
		areaFeatures: createSelectSchema(areaFeatures),
		areaEncounters: createSelectSchema(areaEncounters),
		areaTreasures: createSelectSchema(areaTreasures),
		districtNpcs: createSelectSchema(districtNpcs),
		areaNpcs: createSelectSchema(areaNpcs),
		locationNpcs: createSelectSchema(locationNpcs),
		locationFactions: createSelectSchema(locationFactions),
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
		districtNpcs: createInsertSchema(districtNpcs),
		areaNpcs: createInsertSchema(areaNpcs),
		locationNpcs: createInsertSchema(locationNpcs),
		locationFactions: createInsertSchema(locationFactions),
	},
	update: {
		locations: createUpdateSchema(locations),
		locationNotableFeatures: createUpdateSchema(locationNotableFeatures),
		locationPointsOfInterest: createUpdateSchema(locationPointsOfInterest),
		locationConnections: createUpdateSchema(locationConnections),
		locationDistricts: createUpdateSchema(locationDistricts),
		districtFeatures: createUpdateSchema(districtFeatures),
		locationAreas: createUpdateSchema(locationAreas),
		areaFeatures: createUpdateSchema(areaFeatures),
		areaEncounters: createUpdateSchema(areaEncounters),
		areaTreasures: createUpdateSchema(areaTreasures),
		districtNpcs: createUpdateSchema(districtNpcs),
		areaNpcs: createUpdateSchema(areaNpcs),
		locationNpcs: createUpdateSchema(locationNpcs),
		locationFactions: createUpdateSchema(locationFactions),
	},
}

const { select, insert, update } = locationSchemas

// Update schema definitions for districts and areas to include their features, etc.
export const DistrictSchema = select.locationDistricts.extend({
	features: z.array(select.districtFeatures.omit({ districtId: true })),
	npcs: z.array(select.districtNpcs.omit({ districtId: true })),
})

export const AreaSchema = select.locationAreas.extend({
	features: z.array(select.areaFeatures.omit({ areaId: true })),
	encounters: z.array(select.areaEncounters.omit({ areaId: true })),
	treasures: z.array(select.areaTreasures.omit({ areaId: true })),
	npcs: z.array(select.areaNpcs.omit({ areaId: true })),
})

export const LocationSchema = select.locations
	.extend({
		notableFeatures: z.array(select.locationNotableFeatures.omit({ locationId: true })),
		pointsOfInterest: z.array(select.locationPointsOfInterest.omit({ locationId: true })),
		connections: z.array(select.locationConnections.omit({ locationId: true })),
		districts: z.array(DistrictSchema.omit({ locationId: true })),
		areas: z.array(AreaSchema.omit({ locationId: true })),
		npcs: z.array(locationNpcSchema.omit({ locationId: true })),
		factions: z.array(locationFactionSchema.omit({ locationId: true })),
	})
	.strict()

// Now define the insert and update schemas
export const newLocationSchema = insert.locations
	.omit({ id: true })
	.extend({
		notableFeatures: z
			.array(insert.locationNotableFeatures.omit({ id: true, locationId: true }))
			.optional(),
		pointsOfInterest: z
			.array(insert.locationPointsOfInterest.omit({ id: true, locationId: true }))
			.optional(),
		connections: z
			.array(insert.locationConnections.omit({ id: true, locationId: true }))
			.optional(),
		districts: z
			.array(
				insert.locationDistricts.omit({ id: true, locationId: true }).extend({
					features: z
						.array(insert.districtFeatures.omit({ id: true, districtId: true }))
						.optional(),
					npcs: z.array(insert.districtNpcs.omit({ id: true, districtId: true })).optional(),
				}),
			)
			.optional(),
		areas: z
			.array(
				insert.locationAreas.omit({ id: true, locationId: true }).extend({
					features: z.array(insert.areaFeatures.omit({ id: true, areaId: true })).optional(),
					encounters: z.array(insert.areaEncounters.omit({ id: true, areaId: true })).optional(),
					treasures: z.array(insert.areaTreasures.omit({ id: true, areaId: true })).optional(),
					npcs: z.array(insert.areaNpcs.omit({ id: true, areaId: true })).optional(),
				}),
			)
			.optional(),
		npcs: z.array(insertLocationNpcSchema.omit({ locationId: true })).optional(),
		factions: z.array(insertLocationFactionSchema.omit({ locationId: true })).optional(),
	})
	.strict()

export const updateLocationSchema = update.locations
	.extend({
		notableFeatures: z.array(insert.locationNotableFeatures.omit({ locationId: true })).optional(),
		pointsOfInterest: z
			.array(insert.locationPointsOfInterest.omit({ locationId: true }))
			.optional(),
		connections: z.array(insert.locationConnections.omit({ locationId: true })).optional(),
		districts: z
			.array(
				insert.locationDistricts.omit({ locationId: true }).extend({
					features: z.array(insert.districtFeatures.omit({ districtId: true })).optional(),
					npcs: z.array(insert.districtNpcs.omit({ districtId: true })).optional(),
				}),
			)
			.optional(),
		areas: z
			.array(
				insert.locationAreas.omit({ locationId: true }).extend({
					features: z.array(insert.areaFeatures.omit({ areaId: true })).optional(),
					encounters: z.array(insert.areaEncounters.omit({ areaId: true })).optional(),
					treasures: z.array(insert.areaTreasures.omit({ areaId: true })).optional(),
					npcs: z.array(insert.areaNpcs.omit({ areaId: true })).optional(),
				}),
			)
			.optional(),
		npcs: z.array(insertLocationNpcSchema.omit({ locationId: true })).optional(),
		factions: z.array(insertLocationFactionSchema.omit({ locationId: true })).optional(),
	})
	.strict()

export const getLocationSchema = z
	.number()
	.refine((id) => id > 0, {
		message: "Location ID must be greater than 0",
	})
	.describe("Get a location by ID")

// Define types based on the Zod schemas
export type Location = z.infer<typeof LocationSchema>
export type NewLocation = z.infer<typeof newLocationSchema>
export type UpdateLocation = z.infer<typeof updateLocationSchema>
