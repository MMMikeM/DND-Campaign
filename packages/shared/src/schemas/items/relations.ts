import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../worldbuilding/tables"
import { itemNotableHistory, itemRelationships, items } from "./tables"

export const itemsRelations = relations(items, ({ one, many }) => ({
	sourceOfRelationships: many(itemRelationships, {
		relationName: "sourceItemInRelationships",
	}),

	targetInRelationships: many(itemRelationships, {
		relationName: "relatedItemInRelationships",
	}),

	notableHistory: many(itemNotableHistory, {
		relationName: "itemHistory",
	}),
}))

export const itemRelationshipsRelations = relations(itemRelationships, ({ one }) => ({
	sourceItem: one(items, {
		fields: [itemRelationships.sourceItemId],
		references: [items.id],
		relationName: "sourceItemInRelationships",
	}),

	// Polymorphic relations - only one will be populated based on relatedEntityType
	relatedItem: one(items, {
		fields: [itemRelationships.relatedItemId],
		references: [items.id],
		relationName: "relatedItemInRelationships",
	}),
	relatedNpc: one(npcs, {
		fields: [itemRelationships.relatedNpcId],
		references: [npcs.id],
		relationName: "npcItemRelationships",
	}),
	relatedFaction: one(factions, {
		fields: [itemRelationships.relatedFactionId],
		references: [factions.id],
		relationName: "factionItemRelationships",
	}),
	relatedSite: one(sites, {
		fields: [itemRelationships.relatedSiteId],
		references: [sites.id],
		relationName: "siteItemRelationships",
	}),
	relatedQuest: one(quests, {
		fields: [itemRelationships.relatedQuestId],
		references: [quests.id],
		relationName: "questItemRelationships",
	}),
	relatedConflict: one(majorConflicts, {
		fields: [itemRelationships.relatedConflictId],
		references: [majorConflicts.id],
		relationName: "conflictItemRelationships",
	}),
	relatedNarrativeDestination: one(narrativeDestinations, {
		fields: [itemRelationships.relatedNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "narrativeDestinationItemRelationships",
	}),
	relatedWorldConcept: one(worldConcepts, {
		fields: [itemRelationships.relatedWorldConceptId],
		references: [worldConcepts.id],
		relationName: "worldConceptItemRelationships",
	}),
}))

export const itemNotableHistoryRelations = relations(itemNotableHistory, ({ one }) => ({
	item: one(items, {
		fields: [itemNotableHistory.itemId],
		references: [items.id],
		relationName: "itemHistory",
	}),
	keyNpc: one(npcs, {
		fields: [itemNotableHistory.keyNpcId],
		references: [npcs.id],
		relationName: "npcItemHistory",
	}),
	eventLocationSite: one(sites, {
		fields: [itemNotableHistory.eventLocationSiteId],
		references: [sites.id],
		relationName: "siteItemHistory",
	}),
}))
