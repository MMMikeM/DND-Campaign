// regions/relations.ts
import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { factionInfluence, factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { quests } from "../quests/tables"
import { worldConceptLinks } from "../worldbuilding/tables"

import { areas, regionConnections, regions, sites } from "./tables"

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

// Note: Sites relations are in a separate file at ./sites/relations.ts
