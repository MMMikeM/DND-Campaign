// factions/relations.ts
import { relations } from "drizzle-orm"
import {
	factions,
	factionRelationships,
	factionRegions,
	factionHeadquarters,
	factionOperations,
	factionCulture,
} from "./tables.js"
import { locations, regions } from "../regions/tables.js"
import { factionQuests } from "../associations/tables.js"
import { npcFactions } from "../npc/tables.js"

export const factionsRelations = relations(factions, ({ many }) => ({
	// Self-referencing relationship through factionRelationships
	outgoingRelationships: many(factionRelationships, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionRelationships, { relationName: "targetFaction" }),

	// Related entities
	relatedRegions: many(factionRegions, { relationName: "factionRegions" }),
	headquarters: many(factionHeadquarters, { relationName: "factionHeadquarters" }),
	operations: many(factionOperations, { relationName: "factionOperations" }),
	culture: many(factionCulture, { relationName: "factionCulture" }),
	members: many(npcFactions, { relationName: "factionMembers" }),
	relatedQuests: many(factionQuests, { relationName: "factionQuests" }),
}))

export const factionRelationshipsRelations = relations(factionRelationships, ({ one }) => ({
	sourceFaction: one(factions, {
		fields: [factionRelationships.factionId],
		references: [factions.id],
		relationName: "sourceFaction",
	}),
	targetFaction: one(factions, {
		fields: [factionRelationships.otherFactionId],
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
	location: one(locations, {
		fields: [factionHeadquarters.locationId],
		references: [locations.id],
		relationName: "headquartersLocation",
	}),
}))

export const factionOperationsRelations = relations(factionOperations, ({ one }) => ({
	faction: one(factions, {
		fields: [factionOperations.factionId],
		references: [factions.id],
		relationName: "factionOperations",
	}),
}))

export const factionCultureRelations = relations(factionCulture, ({ one }) => ({
	faction: one(factions, {
		fields: [factionCulture.factionId],
		references: [factions.id],
		relationName: "factionCulture",
	}),
}))
