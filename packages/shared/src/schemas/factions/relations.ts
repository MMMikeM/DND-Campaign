import { relations } from "drizzle-orm"
import {
	factions,
	factionDiplomacy,
	factionRegions,
	factionHeadquarters,
	factionOperations,
	factionCulture,
} from "./tables.js"
import { embeddings } from "../embeddings/tables.js"
import { sites, regions } from "../regions/tables.js"
import { factionRegionalPower, factionQuestInvolvement } from "../associations/tables.js"
import { npcFactions } from "../npc/tables.js"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelationships: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionDiplomacy, { relationName: "targetFaction" }),

	relatedRegions: many(factionRegions, { relationName: "factionRegions" }),
	headquarters: many(factionHeadquarters, { relationName: "factionHeadquarters" }),
	operations: many(factionOperations, { relationName: "factionOperations" }),
	culture: many(factionCulture, { relationName: "factionCulture" }),
	members: many(npcFactions, { relationName: "factionMembers" }),
	relatedQuests: many(factionQuestInvolvement, { relationName: "factionQuests" }),
	influence: many(factionRegionalPower, { relationName: "factionInfluence" }),

	alliances: many(factionDiplomacy, { relationName: "factionAlliances" }),

	embedding: one(embeddings, {
		fields: [factions.embeddingId],
		references: [embeddings.id],
	}),
}))

export const factionDiplomacyRelations = relations(factionDiplomacy, ({ one }) => ({
	sourceFaction: one(factions, {
		fields: [factionDiplomacy.factionId],
		references: [factions.id],
		relationName: "sourceFaction",
	}),
	targetFaction: one(factions, {
		fields: [factionDiplomacy.otherFactionId],
		references: [factions.id],
		relationName: "targetFaction",
	}),
}))

export const factionRegionsRelations = relations(factionRegions, ({ one }) => ({
	faction: one(factions, {
		fields: [factionRegions.factionId],
		references: [factions.id],
		relationName: "factionRegions",
	}),
	region: one(regions, {
		fields: [factionRegions.regionId],
		references: [regions.id],
		relationName: "regionFactions",
	}),
}))

export const factionHeadquartersRelations = relations(factionHeadquarters, ({ one }) => ({
	faction: one(factions, {
		fields: [factionHeadquarters.factionId],
		references: [factions.id],
		relationName: "factionHeadquarters",
	}),
	site: one(sites, {
		fields: [factionHeadquarters.siteId],
		references: [sites.id],
		relationName: "headquartersSite",
	}),
}))

export const factionOperationsRelations = relations(factionOperations, ({ one }) => ({
	faction: one(factions, {
		fields: [factionOperations.factionId],
		references: [factions.id],
		relationName: "factionOperations",
	}),
	embedding: one(embeddings, {
		fields: [factionOperations.embeddingId],
		references: [embeddings.id],
	}),
}))

export const factionCultureRelations = relations(factionCulture, ({ one }) => ({
	faction: one(factions, {
		fields: [factionCulture.factionId],
		references: [factions.id],
		relationName: "factionCulture",
	}),
	embedding: one(embeddings, {
		fields: [factionCulture.embeddingId],
		references: [embeddings.id],
	}),
}))
