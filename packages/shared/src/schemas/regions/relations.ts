// regions/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { worldStateChanges } from "../events/tables"
import { factionTerritorialControl } from "../factions/tables"
import { items } from "../items/tables"
import { npcSites } from "../npc/tables"
import { quests } from "../quests/tables"
import {
	areas,
	regionConnectionDetails,
	regionConnections,
	regions,
	siteEncounters,
	siteLinks,
	siteSecrets,
	sites,
} from "./tables"

export const regionsRelations = relations(regions, ({ many, one }) => ({
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }),
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }),

	areas: many(areas, { relationName: "regionAreas" }),
	quests: many(quests, { relationName: "regionQuests" }),
	territorialControl: many(factionTerritorialControl, { relationName: "regionFactionInfluence" }),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesAffectingRegion" }),

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
	territorialControl: many(factionTerritorialControl, { relationName: "areaFactionInfluence" }),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesAffectingArea" }),

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
	territorialControl: many(factionTerritorialControl, { relationName: "siteFactionInfluence" }),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesAffectingSite" }),

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

export const regionConnectionDetailsRelations = relations(regionConnectionDetails, ({ one }) => ({
	connection: one(regionConnections, {
		fields: [regionConnectionDetails.connectionId],
		references: [regionConnections.id],
		relationName: "connectionDetails",
	}),
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
		fields: [siteSecrets.embeddingId],
		references: [embeddings.id],
	}),
}))
