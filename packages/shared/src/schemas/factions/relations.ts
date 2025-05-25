// factions/relations.ts
import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { worldStateChanges } from "../events/tables"
import { discoverableElements } from "../investigation/tables"
import { npcFactions } from "../npc/tables"
import { questFactionInvolvement, questIntroductions } from "../quests/tables"
import { areas, regionConnectionDetails, regions, sites } from "../regions/tables"
import {
	factionAgendas,
	factionCulture,
	factionDiplomacy,
	factionHeadquarters,
	factions,
	factionTerritorialControl,
} from "./tables"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelationships: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionDiplomacy, { relationName: "targetFaction" }),

	headquarters: many(factionHeadquarters, { relationName: "factionHeadquarters" }),
	agendas: many(factionAgendas, { relationName: "factionAgendas" }),
	culture: many(factionCulture, { relationName: "factionCulture" }),
	members: many(npcFactions, { relationName: "factionMembers" }),
	relatedQuests: many(questFactionInvolvement, { relationName: "factionQuests" }),
	questIntroductions: many(questIntroductions, { relationName: "factionQuestIntroductions" }),
	territorialControl: many(factionTerritorialControl, { relationName: "factionTerritorialControl" }),
	controlledRoutes: many(regionConnectionDetails, { relationName: "factionControlledRoutes" }),
	conflicts: many(conflictParticipants, { relationName: "factionConflicts" }),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesAffectingFaction" }),
	discoverableElements: many(discoverableElements, { relationName: "factionDiscoverableElements" }),

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

export const factionAgendaRelations = relations(factionAgendas, ({ one }) => ({
	faction: one(factions, {
		fields: [factionAgendas.factionId],
		references: [factions.id],
		relationName: "factionAgendas",
	}),
	embedding: one(embeddings, {
		fields: [factionAgendas.embeddingId],
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

// Faction territorial control relations
export const factionTerritorialControlRelations = relations(factionTerritorialControl, ({ one }) => ({
	faction: one(factions, {
		fields: [factionTerritorialControl.factionId],
		references: [factions.id],
		relationName: "factionTerritorialControl",
	}),
	region: one(regions, {
		fields: [factionTerritorialControl.regionId],
		references: [regions.id],
		relationName: "regionFactionInfluence",
	}),
	area: one(areas, {
		fields: [factionTerritorialControl.areaId],
		references: [areas.id],
		relationName: "areaFactionInfluence",
	}),
	site: one(sites, {
		fields: [factionTerritorialControl.siteId],
		references: [sites.id],
		relationName: "siteFactionInfluence",
	}),
}))
