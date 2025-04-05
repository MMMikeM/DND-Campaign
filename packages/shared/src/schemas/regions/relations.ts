// regions/relations.ts
import { relations } from "drizzle-orm"
import {
	regions,
	regionConnections, // Corrected import
	locations,
	locationLinks, // Corrected import
	locationEncounters,
	locationSecrets,
} from "./tables.js"
// Import quests for direct region reference
import { quests } from "../quests/tables.js"
import { npcLocations } from "../npc/tables.js"
import { factionRegionalPower, items, regionConnectionDetails } from "../associations/tables.js" // Corrected imports
import { factionRegions } from "../factions/tables.js"

export const regionsRelations = relations(regions, ({ many }) => ({
	// Self-referencing relationships
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }), // Corrected usage
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }), // Corrected usage

	// Child entities
	locations: many(locations, { relationName: "regionLocations" }),
	quests: many(quests, { relationName: "regionQuests" }),
	factions: many(factionRegions, { relationName: "regionFactions" }),
	influence: many(factionRegionalPower, { relationName: "regionFactionInfluence" }), // Corrected usage
}))

// Renamed relation and corrected internal usage
export const regionConnectionsRelations = relations(regionConnections, ({ one, many }) => ({
	sourceRegion: one(regions, {
		fields: [regionConnections.regionId],
		references: [regions.id],
		relationName: "sourceRegion",
	}),
	targetRegion: one(regions, {
		fields: [regionConnections.otherRegionId],
		references: [regions.id],
		relationName: "targetRegion",
	}),
	// Add relation to connection details
	connections: many(regionConnectionDetails, { relationName: "relationConnections" }), // Corrected usage
}))

export const locationsRelations = relations(locations, ({ one, many }) => ({
	// Parent region
	region: one(regions, {
		fields: [locations.regionId],
		references: [regions.id],
		relationName: "regionLocations",
	}),

	// Self-referencing relationships
	outgoingRelations: many(locationLinks, { relationName: "sourceLocation" }), // Corrected usage
	incomingRelations: many(locationLinks, { relationName: "targetLocation" }), // Corrected usage

	// Child entities
	encounters: many(locationEncounters, { relationName: "locationEncounters" }),
	secrets: many(locationSecrets, { relationName: "locationSecrets" }),
	npcs: many(npcLocations, { relationName: "locationNpcs" }),
	items: many(items, { relationName: "locationItems" }),
	influence: many(factionRegionalPower, { relationName: "locationFactionInfluence" }), // Corrected usage
}))

// Renamed relation and corrected internal usage
export const locationLinksRelations = relations(locationLinks, ({ one }) => ({
	sourceLocation: one(locations, {
		fields: [locationLinks.locationId],
		references: [locations.id],
		relationName: "sourceLocation",
	}),
	targetLocation: one(locations, {
		fields: [locationLinks.otherLocationId],
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
