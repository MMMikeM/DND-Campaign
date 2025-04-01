// regions/relations.ts
import { relations } from "drizzle-orm"
import {
	regions,
	regionRelations,
	locations,
	locationRelations,
	locationEncounters,
	locationSecrets,
} from "./tables.js"
// Import quests for direct region reference
import { quests } from "../quests/tables.js"
import { npcLocations } from "../npc/tables.js"
import { factionInfluence, items, regionConnections } from "../associations/tables.js"
import { factionRegions } from "../factions/tables.js"

export const regionsRelations = relations(regions, ({ many }) => ({
	// Self-referencing relationships
	outgoingRelations: many(regionRelations, { relationName: "sourceRegion" }),
	incomingRelations: many(regionRelations, { relationName: "targetRegion" }),

	// Child entities
	locations: many(locations, { relationName: "regionLocations" }),
	quests: many(quests, { relationName: "regionQuests" }),
	factions: many(factionRegions, { relationName: "regionFactions" }),
	influence: many(factionInfluence, { relationName: "regionFactionInfluence" }),
}))

export const regionRelationsRelations = relations(regionRelations, ({ one, many }) => ({
	sourceRegion: one(regions, {
		fields: [regionRelations.regionId],
		references: [regions.id],
		relationName: "sourceRegion",
	}),
	targetRegion: one(regions, {
		fields: [regionRelations.otherRegionId],
		references: [regions.id],
		relationName: "targetRegion",
	}),
	// Add relation to connections
	connections: many(regionConnections, { relationName: "relationConnections" }),
}))

export const locationsRelations = relations(locations, ({ one, many }) => ({
	// Parent region
	region: one(regions, {
		fields: [locations.regionId],
		references: [regions.id],
		relationName: "regionLocations",
	}),

	// Self-referencing relationships
	outgoingRelations: many(locationRelations, { relationName: "sourceLocation" }),
	incomingRelations: many(locationRelations, { relationName: "targetLocation" }),

	// Child entities
	encounters: many(locationEncounters, { relationName: "locationEncounters" }),
	secrets: many(locationSecrets, { relationName: "locationSecrets" }),
	npcs: many(npcLocations, { relationName: "locationNpcs" }),
	items: many(items, { relationName: "locationItems" }),
	influence: many(factionInfluence, { relationName: "locationFactionInfluence" }),
}))

export const locationRelationsRelations = relations(locationRelations, ({ one }) => ({
	sourceLocation: one(locations, {
		fields: [locationRelations.locationId],
		references: [locations.id],
		relationName: "sourceLocation",
	}),
	targetLocation: one(locations, {
		fields: [locationRelations.otherLocationId],
		references: [locations.id],
		relationName: "targetLocation",
	}),
}))

export const locationEncountersRelations = relations(locationEncounters, ({ one }) => ({
	location: one(locations, {
		fields: [locationEncounters.locationId],
		references: [locations.id],
		relationName: "locationEncounters",
	}),
}))

export const locationSecretsRelations = relations(locationSecrets, ({ one }) => ({
	location: one(locations, {
		fields: [locationSecrets.locationId],
		references: [locations.id],
		relationName: "locationSecrets",
	}),
}))
