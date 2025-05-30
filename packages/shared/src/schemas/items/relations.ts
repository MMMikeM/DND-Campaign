import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../worldbuilding/tables"
import { itemNotableHistory, itemRelationships, items } from "./tables"

export const itemsRelations = relations(items, ({ many }) => ({
	sourceOfRelationships: many(itemRelationships, {
		relationName: "sourceItem",
	}),

	targetOfRelationships: many(itemRelationships, {
		relationName: "targetItem",
	}),

	notableHistory: many(itemNotableHistory, {
		relationName: "item",
	}),
}))

export const itemRelationshipsRelations = relations(itemRelationships, ({ one }) => ({
	sourceItem: one(items, {
		fields: [itemRelationships.sourceItemId],
		references: [items.id],
		relationName: "sourceItem",
	}),

	targetItem: one(items, {
		fields: [itemRelationships.targetItemId],
		references: [items.id],
		relationName: "targetItem",
	}),

	targetNpc: one(npcs, {
		fields: [itemRelationships.targetNpcId],
		references: [npcs.id],
	}),

	targetFaction: one(factions, {
		fields: [itemRelationships.targetFactionId],
		references: [factions.id],
	}),

	targetSite: one(sites, {
		fields: [itemRelationships.targetSiteId],
		references: [sites.id],
	}),

	targetQuest: one(quests, {
		fields: [itemRelationships.targetQuestId],
		references: [quests.id],
	}),

	targetConflict: one(majorConflicts, {
		fields: [itemRelationships.targetConflictId],
		references: [majorConflicts.id],
	}),

	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [itemRelationships.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
	}),

	targetWorldConcept: one(worldConcepts, {
		fields: [itemRelationships.targetWorldConceptId],
		references: [worldConcepts.id],
	}),
}))

export const itemNotableHistoryRelations = relations(itemNotableHistory, ({ one }) => ({
	item: one(items, {
		fields: [itemNotableHistory.itemId],
		references: [items.id],
		relationName: "item",
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
