import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { clues } from "../investigation/tables"
import { items } from "../items/tables"
import { questHookNpcs, questNpcRoles } from "../quests/tables"
import { sites } from "../regions/tables"
import { characterRelationships, npcFactions, npcSites, npcs } from "./tables"

export const npcsRelations = relations(npcs, ({ many, one }) => ({
	outgoingRelationships: many(characterRelationships, { relationName: "sourceNpc" }),
	incomingRelationships: many(characterRelationships, { relationName: "targetNpc" }),

	relatedFactions: many(npcFactions, { relationName: "npcFactions" }),
	relatedSites: many(npcSites, { relationName: "npcSites" }),

	relatedQuests: many(questNpcRoles, { relationName: "npcQuests" }),
	relatedItems: many(items, { relationName: "npcItems" }),
	relatedQuestHooks: many(questHookNpcs, { relationName: "npcQuestHooks" }),
	relatedClues: many(clues, { relationName: "npcClues" }),

	embedding: one(embeddings, {
		fields: [npcs.embeddingId],
		references: [embeddings.id],
	}),
}))

export const characterRelationshipsRelations = relations(characterRelationships, ({ one }) => ({
	sourceNpc: one(npcs, {
		fields: [characterRelationships.npcId],
		references: [npcs.id],
		relationName: "sourceNpc",
	}),
	targetNpc: one(npcs, {
		fields: [characterRelationships.relatedNpcId],
		references: [npcs.id],
		relationName: "targetNpc",
	}),
}))

export const npcFactionsRelations = relations(npcFactions, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcFactions.npcId],
		references: [npcs.id],
		relationName: "npcFactions",
	}),
	faction: one(factions, {
		fields: [npcFactions.factionId],
		references: [factions.id],
		relationName: "factionMembers",
	}),
}))

export const npcSiteRelations = relations(npcSites, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcSites.npcId],
		references: [npcs.id],
		relationName: "npcSites",
	}),
	site: one(sites, {
		fields: [npcSites.siteId],
		references: [sites.id],
		relationName: "siteNpcs",
	}),
}))
