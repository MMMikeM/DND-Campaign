// regions/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import {
	factionAreaControl,
	factionHeadquarters,
	factionRegionalControl,
	factionSiteControl,
	factions,
} from "../factions/tables"
import { discoverableElements } from "../investigation/tables"
import { items } from "../items/tables"
import { npcSites } from "../npc/tables"
import { questHooks, questStages, quests } from "../quests/tables"
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
	conflicts: many(majorConflicts, { relationName: "regionConflicts" }),
	factionControl: many(factionRegionalControl, { relationName: "regionFactionInfluence" }),
	consequences: many(consequences, { relationName: "consequencesInRegion" }),

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
	factionControl: many(factionAreaControl, { relationName: "areaFactionInfluence" }),
	consequences: many(consequences, { relationName: "consequencesInArea" }),

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
	discoverableElements: many(discoverableElements, { relationName: "siteDiscoverableElements" }),
	questStages: many(questStages, { relationName: "siteQuestStages" }),
	questHooks: many(questHooks, { relationName: "siteQuestHooks" }),
	headquarters: many(factionHeadquarters, { relationName: "headquartersSite" }),
	factionControl: many(factionSiteControl, { relationName: "siteFactionInfluence" }),
	consequences: many(consequences, { relationName: "consequencesAtSite" }),

	embedding: one(embeddings, {
		fields: [sites.embeddingId],
		references: [embeddings.id],
	}),
}))

export const regionConnectionsRelations = relations(regionConnections, ({ one }) => ({
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

	details: one(regionConnectionDetails, {
		fields: [regionConnections.id],
		references: [regionConnectionDetails.connectionId],
		relationName: "connectionDetails",
	}),
}))

export const regionConnectionDetailsRelations = relations(regionConnectionDetails, ({ one }) => ({
	connection: one(regionConnections, {
		fields: [regionConnectionDetails.connectionId],
		references: [regionConnections.id],
		relationName: "connectionDetails",
	}),
	controllingFaction: one(factions, {
		fields: [regionConnectionDetails.controllingFactionId],
		references: [factions.id],
		relationName: "factionControlledRoutes",
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
