// regions/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factionInfluence, factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelationships } from "../items/tables"
import { maps } from "../maps/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcSiteAssociations } from "../npcs/tables"
import { questHooks, questStages, quests } from "../quests/tables"
import { worldConceptLinks } from "../world-concepts/tables"
import { areas, regionConnections, regions, siteEncounters, siteLinks, siteSecrets, sites } from "./tables"

export const regionsRelations = relations(regions, ({ many }) => ({
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }),
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }),

	areas: many(areas, { relationName: "regionAreas" }),
	quests: many(quests, { relationName: "regionQuests" }),
	conflicts: many(conflicts, { relationName: "regionConflicts" }),
	consequences: many(consequences, { relationName: "consequencesInRegion" }),
	narrativeDestinations: many(narrativeDestinations, { relationName: "regionNarrativeDestinations" }),
	factionInfluence: many(factionInfluence, { relationName: "influenceInRegion" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "regionWorldConceptLinks" }),
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
}))

export const regionConnectionsRelations = relations(regionConnections, ({ one }) => ({
	sourceRegion: one(regions, {
		fields: [regionConnections.sourceRegionId],
		references: [regions.id],
		relationName: "sourceRegion",
	}),
	targetRegion: one(regions, {
		fields: [regionConnections.targetRegionId],
		references: [regions.id],
		relationName: "targetRegion",
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
	npcAssociations: many(npcSiteAssociations, { relationName: "siteNpcs" }),
	questStages: many(questStages, { relationName: "siteQuestStages" }),
	questHooks: many(questHooks, { relationName: "siteQuestHooks" }),
	consequences: many(consequences, { relationName: "consequencesAtSite" }),
	factionHqs: many(factions, { relationName: "factionHq" }),
	factionInfluence: many(factionInfluence, { relationName: "influenceAtSite" }),
	foreshadowingSeeds: many(foreshadowing, { relationName: "siteForeshadowingSeeds" }),
	foreshadowingTargets: many(foreshadowing, { relationName: "foreshadowedSite" }),
	itemHistory: many(itemNotableHistory, { relationName: "siteItemHistory" }),
	itemRelationships: many(itemRelationships, { relationName: "siteItemRelationships" }),

	map: one(maps, {
		fields: [sites.mapId],
		references: [maps.id],
	}),
}))

export const siteLinksRelations = relations(siteLinks, ({ one }) => ({
	sourceSite: one(sites, {
		fields: [siteLinks.sourceSiteId],
		references: [sites.id],
		relationName: "sourceSite",
	}),
	targetSite: one(sites, {
		fields: [siteLinks.targetSiteId],
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
