import { relations } from "drizzle-orm"
import { regions, regionConnections, areas, sites, siteLinks, siteEncounters, siteSecrets } from "./tables.js"
import { embeddings } from "../embeddings/tables.js"

import { quests } from "../quests/tables.js"
import { npcSites } from "../npc/tables.js"
import { factionTerritorialControl, items, regionConnectionDetails } from "../associations/tables.js"

export const regionsRelations = relations(regions, ({ many, one }) => ({
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }),
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }),

	areas: many(areas, { relationName: "regionAreas" }),
	quests: many(quests, { relationName: "regionQuests" }),
	influence: many(factionTerritorialControl, { relationName: "factionTerritorialControl" }),

	embedding: one(embeddings, {
		fields: [regions.embeddingId],
		references: [embeddings.id],
	}),
}))

export const areasRelations = relations(areas, ({ one, many }) => ({
	region: one(regions, {
		fields: [areas.regionId],
		references: [regions.id],
		relationName: "regionAreas",
	}),

	sites: many(sites, { relationName: "areaSites" }),
	influence: many(factionTerritorialControl, { relationName: "factionTerritorialControl" }),

	embedding: one(embeddings, {
		fields: [areas.embeddingId],
		references: [embeddings.id],
	}),
}))

export const sitesRelations = relations(sites, ({ one, many }) => ({
	outgoingRelations: many(siteLinks, { relationName: "sourceSite" }),
	incomingRelations: many(siteLinks, { relationName: "targetSite" }),

	area: one(areas, {
		fields: [sites.areaId],
		references: [areas.id],
		relationName: "areaSites",
	}),

	encounters: many(siteEncounters, { relationName: "siteEncounters" }),
	secrets: many(siteSecrets, { relationName: "siteSecrets" }),
	npcs: many(npcSites, { relationName: "siteNpcs" }),
	items: many(items, { relationName: "siteItems" }),
	influence: many(factionTerritorialControl, { relationName: "factionTerritorialControl" }),

	embedding: one(embeddings, {
		fields: [sites.embeddingId],
		references: [embeddings.id],
	}),
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

	details: many(regionConnectionDetails, { relationName: "connectionDetails" }),
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
	embedding: one(embeddings, {
		fields: [siteEncounters.embeddingId],
		references: [embeddings.id],
	}),
}))

export const siteSecretsRelations = relations(siteSecrets, ({ one }) => ({
	site: one(sites, {
		fields: [siteSecrets.siteId],
		references: [sites.id],
		relationName: "siteSecrets",
	}),
	embedding: one(embeddings, {
		// Add embedding relation
		fields: [siteSecrets.embeddingId],
		references: [embeddings.id],
	}),
}))
