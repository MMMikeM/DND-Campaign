// factions/relations.ts
import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { discoverableElements } from "../investigation/tables"
import { npcFactions } from "../npc/tables"
import { questHooks } from "../quests/tables"
import { factionAgendas, factionDiplomacy, factions } from "./tables"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelationships: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionDiplomacy, { relationName: "targetFaction" }),

	agendas: many(factionAgendas, { relationName: "factionAgendas" }),
	members: many(npcFactions, { relationName: "factionMembers" }),
	questHooks: many(questHooks, { relationName: "factionQuestHooks" }),

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
