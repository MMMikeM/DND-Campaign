// factions/relations.ts
import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { discoverableElements } from "../investigation/tables"
import { npcFactions } from "../npc/tables"
import { questFactionInvolvement, questHooks } from "../quests/tables"
import { areas, regionConnectionDetails, regions, sites } from "../regions/tables"
import {
	factionAgendas,
	factionAreaControl,
	factionCulture,
	factionDiplomacy,
	factionHeadquarters,
	factionRegionalControl,
	factionSiteControl,
	factions,
} from "./tables"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelationships: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionDiplomacy, { relationName: "targetFaction" }),
	culture: one(factionCulture, {
		fields: [factions.id],
		references: [factionCulture.factionId],
		relationName: "factionCulture",
	}),

	headquarters: many(factionHeadquarters, { relationName: "factionHeadquarters" }),
	agendas: many(factionAgendas, { relationName: "factionAgendas" }),
	members: many(npcFactions, { relationName: "factionMembers" }),
	relatedQuests: many(questFactionInvolvement, { relationName: "factionQuests" }),
	questHooks: many(questHooks, { relationName: "factionQuestHooks" }),
	regionalControl: many(factionRegionalControl, { relationName: "factionRegionalControl" }),
	areaControl: many(factionAreaControl, { relationName: "factionAreaControl" }),
	siteControl: many(factionSiteControl, { relationName: "factionSiteControl" }),
	controlledRoutes: many(regionConnectionDetails, { relationName: "factionControlledRoutes" }),
	conflicts: many(conflictParticipants, { relationName: "factionConflicts" }),
	consequences: many(consequences, { relationName: "consequencesAffectingFaction" }),
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
export const factionRegionalControlRelations = relations(factionRegionalControl, ({ one }) => ({
	faction: one(factions, {
		fields: [factionRegionalControl.factionId],
		references: [factions.id],
		relationName: "factionRegionalControl",
	}),
	region: one(regions, {
		fields: [factionRegionalControl.regionId],
		references: [regions.id],
		relationName: "regionFactionInfluence",
	}),
}))

export const factionAreaControlRelations = relations(factionAreaControl, ({ one }) => ({
	faction: one(factions, {
		fields: [factionAreaControl.factionId],
		references: [factions.id],
		relationName: "factionAreaControl",
	}),
	area: one(areas, {
		fields: [factionAreaControl.areaId],
		references: [areas.id],
		relationName: "areaFactionInfluence",
	}),
}))

export const factionSiteControlRelations = relations(factionSiteControl, ({ one }) => ({
	faction: one(factions, {
		fields: [factionSiteControl.factionId],
		references: [factions.id],
		relationName: "factionSiteControl",
	}),
	site: one(sites, {
		fields: [factionSiteControl.siteId],
		references: [sites.id],
		relationName: "siteFactionInfluence",
	}),
}))
