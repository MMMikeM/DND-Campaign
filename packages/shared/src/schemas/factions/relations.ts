// factions/relations.ts
import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { foreshadowingSeeds } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { destinationParticipantInvolvement } from "../narrative/tables"
import { npcFactions } from "../npc/tables"
import { questHooks, questParticipantInvolvement } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { worldConceptLinks } from "../worldbuilding/tables"
import { factionAgendas, factionDiplomacy, factionInfluence, factions } from "./tables"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelationships: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionDiplomacy, { relationName: "targetFaction" }),

	agendas: many(factionAgendas, { relationName: "factionAgendas" }),
	members: many(npcFactions, { relationName: "factionMembers" }),
	questHooks: many(questHooks, { relationName: "factionQuestHooks" }),
	questParticipation: many(questParticipantInvolvement, { relationName: "factionQuestParticipation" }),
	influence: many(factionInfluence, { relationName: "factionInfluence" }),

	conflicts: many(conflictParticipants, { relationName: "factionConflicts" }),
	consequences: many(consequences, { relationName: "consequencesAffectingFaction" }),
	destinationInvolvement: many(destinationParticipantInvolvement, { relationName: "factionDestinationInvolvement" }),
	foreshadowingSeeds: many(foreshadowingSeeds, { relationName: "foreshadowedFaction" }),
	itemRelationships: many(itemRelationships, { relationName: "factionItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "factionWorldConceptLinks" }),

	primaryHqSite: one(sites, {
		fields: [factions.primaryHqSiteId],
		references: [sites.id],
		relationName: "factionHq",
	}),

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

export const factionInfluenceRelations = relations(factionInfluence, ({ one }) => ({
	faction: one(factions, {
		fields: [factionInfluence.factionId],
		references: [factions.id],
		relationName: "factionInfluence",
	}),
	region: one(regions, {
		fields: [factionInfluence.regionId],
		references: [regions.id],
		relationName: "influenceInRegion",
	}),
	area: one(areas, {
		fields: [factionInfluence.areaId],
		references: [areas.id],
		relationName: "influenceInArea",
	}),
	site: one(sites, {
		fields: [factionInfluence.siteId],
		references: [sites.id],
		relationName: "influenceAtSite",
	}),
}))
