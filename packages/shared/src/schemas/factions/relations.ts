// factions/relations.ts
import { relations } from "drizzle-orm"
import {
	clues,
	factionQuestInvolvement,
	factionTerritorialControl,
	regionConnectionDetails,
} from "../associations/tables.js"
import { conflictParticipants } from "../conflict/tables.js"
import { embeddings } from "../embeddings/tables.js"
import { npcFactions } from "../npc/tables.js"
import { sites } from "../regions/tables.js"
import { worldStateChanges } from "../world/tables.js"
import { factionAgendas, factionCulture, factionDiplomacy, factionHeadquarters, factions } from "./tables.js"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelationships: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionDiplomacy, { relationName: "targetFaction" }),

	headquarters: many(factionHeadquarters, { relationName: "factionHeadquarters" }),
	agendas: many(factionAgendas, { relationName: "factionAgendas" }),
	culture: many(factionCulture, { relationName: "factionCulture" }),
	members: many(npcFactions, { relationName: "factionMembers" }),
	relatedQuests: many(factionQuestInvolvement, { relationName: "factionQuests" }),
	influence: many(factionTerritorialControl, { relationName: "factionInfluence" }),
	controlledRoutes: many(regionConnectionDetails, { relationName: "factionControlledRoutes" }),
	clues: many(clues, { relationName: "factionClues" }),
	conflicts: many(conflictParticipants, { relationName: "factionConflicts" }),
	worldChanges: many(worldStateChanges, { relationName: "worldChangesAffectingFaction" }),

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
