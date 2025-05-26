import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { discoverableElements } from "../investigation/tables"

import { sites } from "../regions/tables"
import { characterRelationships, npcFactions, npcSites, npcs } from "./tables"

export const npcsRelations = relations(npcs, ({ many, one }) => ({
	outgoingRelationships: many(characterRelationships, { relationName: "sourceNpc" }),
	incomingRelationships: many(characterRelationships, { relationName: "targetNpc" }),

	relatedFactions: many(npcFactions, { relationName: "npcFactions" }),
	relatedSites: many(npcSites, { relationName: "npcSites" }),

	discoverableElements: many(discoverableElements, { relationName: "npcDiscoverableElements" }),

	discoverableElementsAsSource: many(discoverableElements, {
		relationName: "npcDiscoverableElements",
	}),
	discoverableElementsForeshadowingThisNpc: many(discoverableElements, {
		relationName: "foreshadowsNpc",
	}),

	currentLocation: one(sites, {
		fields: [npcs.currentLocationId],
		references: [sites.id],
		relationName: "npcsAtCurrentLocation",
	}),

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

export const npcSitesRelations = relations(npcSites, ({ one }) => ({
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
