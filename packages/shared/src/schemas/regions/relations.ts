// regions/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { factionInfluence, factions, regionConnections } from "../factions/tables"
import { foreshadowingSeeds } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelationships } from "../items/tables"
import { maps } from "../maps/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcSites } from "../npc/tables"
import { questHooks, questStages, quests } from "../quests/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
import { areas, regions, siteEncounters, siteLinks, siteSecrets, sites } from "./tables"

export const regionsRelations = relations(regions, ({ many, one }) => ({
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }),
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }),

	areas: many(areas, { relationName: "regionAreas" }),
	quests: many(quests, { relationName: "regionQuests" }),
	conflicts: many(majorConflicts, { relationName: "regionConflicts" }),
	consequences: many(consequences, { relationName: "consequencesInRegion" }),
	narrativeDestinations: many(narrativeDestinations, { relationName: "regionNarrativeDestinations" }),
	factionInfluence: many(factionInfluence, { relationName: "influenceInRegion" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "regionWorldConceptLinks" }),

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
	consequences: many(consequences, { relationName: "consequencesInArea" }),
	factionInfluence: many(factionInfluence, { relationName: "influenceInArea" }),

	embedding: one(embeddings, {
		fields: [areas.embeddingId],
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
	controllingFaction: one(factions, {
		fields: [regionConnections.controllingFactionId],
		references: [factions.id],
		relationName: "controlledRegionConnections",
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
	npcAssociations: many(npcSites, { relationName: "siteNpcs" }),
	questStages: many(questStages, { relationName: "siteQuestStages" }),
	questHooks: many(questHooks, { relationName: "siteQuestHooks" }),
	consequences: many(consequences, { relationName: "consequencesAtSite" }),
	factionHqs: many(factions, { relationName: "factionHq" }),
	factionInfluence: many(factionInfluence, { relationName: "influenceAtSite" }),
	foreshadowingSeeds: many(foreshadowingSeeds, { relationName: "siteForeshadowingSeeds" }),
	foreshadowingTargets: many(foreshadowingSeeds, { relationName: "foreshadowedSite" }),
	itemHistory: many(itemNotableHistory, { relationName: "siteItemHistory" }),
	itemRelationships: many(itemRelationships, { relationName: "siteItemRelationships" }),

	map: one(maps, {
		fields: [sites.mapId],
		references: [maps.id],
	}),
	embedding: one(embeddings, {
		fields: [sites.embeddingId],
		references: [embeddings.id],
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
