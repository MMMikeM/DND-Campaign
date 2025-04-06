// regions/relations.ts
import { relations } from "drizzle-orm"
import {
	regions,
	regionConnections,
	areas, // New import
	sites, // Renamed from locations
	siteLinks, // Renamed from locationLinks
	siteEncounters, // Renamed from locationEncounters
	siteSecrets, // Renamed from locationSecrets
} from "./tables.js"
// Import quests for direct region reference
import { quests } from "../quests/tables.js"
import { npcLocations } from "../npc/tables.js" // This will need to be updated in npc/tables.js
import { factionRegionalPower, items, regionConnectionDetails } from "../associations/tables.js"
import { factionRegions } from "../factions/tables.js"

export const regionsRelations = relations(regions, ({ many }) => ({
	// Self-referencing relationships
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }),
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }),

	// Child entities
	areas: many(areas, { relationName: "regionAreas" }), // Updated to link to areas instead of locations
	quests: many(quests, { relationName: "regionQuests" }),
	factions: many(factionRegions, { relationName: "regionFactions" }),
	influence: many(factionRegionalPower, { relationName: "regionFactionInfluence" }),
}))

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
	connections: many(regionConnectionDetails, { relationName: "relationConnections" }),
}))

// New relation for areas (middle tier)
export const areasRelations = relations(areas, ({ one, many }) => ({
	// Parent region
	region: one(regions, {
		fields: [areas.regionId],
		references: [regions.id],
		relationName: "regionAreas",
	}),
    
	// Child entities
	sites: many(sites, { relationName: "areaSites" }),
	quests: many(quests, { relationName: "areaQuests" }),
	influence: many(factionRegionalPower, { relationName: "areaFactionInfluence" }),
}))

export const sitesRelations = relations(sites, ({ one, many }) => ({
	// Parent area
	area: one(areas, {
		fields: [sites.areaId],
		references: [areas.id],
		relationName: "areaSites",
	}),

	// Self-referencing relationships
	outgoingRelations: many(siteLinks, { relationName: "sourceSite" }),
	incomingRelations: many(siteLinks, { relationName: "targetSite" }),

	// Child entities
	encounters: many(siteEncounters, { relationName: "siteEncounters" }),
	secrets: many(siteSecrets, { relationName: "siteSecrets" }),
	npcs: many(npcLocations, { relationName: "siteNpcs" }), // This will need updating in npc/tables.js
	items: many(items, { relationName: "siteItems" }),
	influence: many(factionRegionalPower, { relationName: "siteFactionInfluence" }),
}))

export const siteLinksRelations = relations(siteLinks, ({ one }) => ({
	sourceSite: one(sites, {
		fields: [siteLinks.siteId],
		references: [sites.id],
		relationName: "sourceSite",
	}),
	targetSite: one(sites, {
		fields: [siteLinks.otherSiteId],
		references: [sites.id],
		relationName: "targetSite",
	}),
}))

export const siteEncountersRelations = relations(siteEncounters, ({ one }) => ({
	site: one(sites, {
		fields: [siteEncounters.siteId],
		references: [sites.id],
		relationName: "siteEncounters",
	}),
}))

export const siteSecretsRelations = relations(siteSecrets, ({ one }) => ({
	site: one(sites, {
		fields: [siteSecrets.siteId],
		references: [sites.id],
		relationName: "siteSecrets",
	}),
}))