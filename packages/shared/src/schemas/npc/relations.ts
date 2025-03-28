// npc/relations.ts
import { relations } from "drizzle-orm"
import { npcs, npcRelationships, npcFactions, npcLocations } from "./tables.js"
import { items, questNpcs, questHookNpcs, clues } from "../associations/tables.js"
import { factions } from "../factions/tables.js"
import { locations } from "../regions/tables.js"

export const npcsRelations = relations(npcs, ({ many }) => ({
	// Self-referencing relationships
	outgoingRelationships: many(npcRelationships, { relationName: "sourceNpc" }),
	incomingRelationships: many(npcRelationships, { relationName: "targetNpc" }),

	// Related entities
	relatedFactions: many(npcFactions, { relationName: "npcFactions" }),
	relatedLocations: many(npcLocations, { relationName: "npcLocations" }),
	// Association relationships
	relatedQuests: many(questNpcs, { relationName: "npcQuests" }),
	relatedItems: many(items, { relationName: "npcItems" }),
	relatedQuestHooks: many(questHookNpcs, { relationName: "npcQuestHooks" }),
	relatedClues: many(clues, { relationName: "npcClues" }),
}))

export const npcRelationshipsRelations = relations(npcRelationships, ({ one }) => ({
	sourceNpc: one(npcs, {
		fields: [npcRelationships.npcId],
		references: [npcs.id],
		relationName: "sourceNpc",
	}),
	targetNpc: one(npcs, {
		fields: [npcRelationships.relatedNpcId],
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

export const npcLocationsRelations = relations(npcLocations, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcLocations.npcId],
		references: [npcs.id],
		relationName: "npcLocations",
	}),
	location: one(locations, {
		fields: [npcLocations.locationId],
		references: [locations.id],
		relationName: "locationNpcs",
	}),
}))
