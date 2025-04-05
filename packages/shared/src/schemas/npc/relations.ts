// npc/relations.ts
import { relations } from "drizzle-orm"
import { npcs, characterRelationships, npcFactions, npcLocations } from "./tables.js" // Corrected import
import { items, npcQuestRoles, questHookNpcs, clues } from "../associations/tables.js" // Corrected import: questNpcs -> npcQuestRoles
import { factions } from "../factions/tables.js"
import { locations } from "../regions/tables.js"

export const npcsRelations = relations(npcs, ({ many }) => ({
	// Self-referencing relationships
	outgoingRelationships: many(characterRelationships, { relationName: "sourceNpc" }), // Corrected usage
	incomingRelationships: many(characterRelationships, { relationName: "targetNpc" }), // Corrected usage

	// Related entities
	relatedFactions: many(npcFactions, { relationName: "npcFactions" }),
	relatedLocations: many(npcLocations, { relationName: "npcLocations" }),
	// Association relationships
	relatedQuests: many(npcQuestRoles, { relationName: "npcQuests" }), // Corrected usage: questNpcs -> npcQuestRoles
	relatedItems: many(items, { relationName: "npcItems" }),
	relatedQuestHooks: many(questHookNpcs, { relationName: "npcQuestHooks" }),
	relatedClues: many(clues, { relationName: "npcClues" }),
}))

// Renamed relation and corrected internal usage
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
