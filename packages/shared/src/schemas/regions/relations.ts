import { relations } from "drizzle-orm"
import { regions, regionConnections, areas, sites, siteLinks, siteEncounters, siteSecrets } from "./tables.js"

import { quests } from "../quests/tables.js"
import { npcSites } from "../npc/tables.js"
import { factionRegionalPower, items, regionConnectionDetails } from "../associations/tables.js"
import { factionRegions } from "../factions/tables.js"

export const regionsRelations = relations(regions, ({ many }) => ({
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }),
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }),

	areas: many(areas, { relationName: "regionAreas" }),
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

	details: many(regionConnectionDetails, {
		relationName: "connectionDetails",
	}),
}))

export const areasRelations = relations(areas, ({ one, many }) => ({
	region: one(regions, {
		fields: [areas.regionId],
		references: [regions.id],
		relationName: "regionAreas",
	}),

	sites: many(sites, { relationName: "areaSites" }),
	influence: many(factionRegionalPower, { relationName: "areaFactionInfluence" }),
}))

export const sitesRelations = relations(sites, ({ one, many }) => ({
	area: one(areas, {
		fields: [sites.areaId],
		references: [areas.id],
		relationName: "areaSites",
	}),

	outgoingRelations: many(siteLinks, { relationName: "sourceSite" }),
	incomingRelations: many(siteLinks, { relationName: "targetSite" }),

	encounters: many(siteEncounters, { relationName: "siteEncounters" }),
	secrets: many(siteSecrets, { relationName: "siteSecrets" }),
	npcs: many(npcSites, { relationName: "siteNpcs" }),
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
