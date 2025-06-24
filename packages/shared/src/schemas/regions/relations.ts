// regions/relations.ts
import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factionInfluence, factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { mapGroups, mapVariants } from "../maps/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcSiteAssociations } from "../npcs/tables"
import { questHooks, quests } from "../quests/tables"
import { questStages } from "../stages/tables"
import { areas, regionConnections, regions, siteEncounters, siteLinks, siteSecrets, sites } from "./tables"

export const regionsRelations = relations(regions, ({ many }) => ({
	outgoingRelations: many(regionConnections, { relationName: "sourceRegion" }),
	incomingRelations: many(regionConnections, { relationName: "targetRegion" }),

	areas: many(areas),
	quests: many(quests),
	conflicts: many(conflicts),
	consequences: many(consequences, { relationName: "ConsequenceAffectedRegion" }),
	narrativeDestinations: many(narrativeDestinations),
	factionInfluence: many(factionInfluence),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetRegion" }),
}))

export const areasRelations = relations(areas, ({ one, many }) => ({
	region: one(regions, {
		fields: [areas.regionId],
		references: [regions.id],
	}),

	sites: many(sites),
	consequences: many(consequences, { relationName: "ConsequenceAffectedArea" }),
	factionInfluence: many(factionInfluence),
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
	}),

	encounters: many(siteEncounters),
	secrets: many(siteSecrets),
	npcAssociations: many(npcSiteAssociations),
	questStages: many(questStages),
	questHooks: many(questHooks),
	consequences: many(consequences, { relationName: "ConsequenceAffectedSite" }),
	factionHqs: many(factions, { relationName: "factionHq" }),
	factionInfluence: many(factionInfluence),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceSite" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetSite" }),
	itemHistory: many(itemNotableHistory),
	itemRelations: many(itemRelations),

	mapGroup: one(mapGroups, {
		fields: [sites.mapGroupId],
		references: [mapGroups.id],
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
	}),
	mapVariant: one(mapVariants, {
		fields: [siteEncounters.mapVariantId],
		references: [mapVariants.id],
	}),
}))

export const siteSecretsRelations = relations(siteSecrets, ({ one }) => ({
	site: one(sites, {
		fields: [siteSecrets.siteId],
		references: [sites.id],
	}),
}))
