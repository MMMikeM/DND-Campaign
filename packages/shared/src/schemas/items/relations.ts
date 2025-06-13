import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { questStages } from "../quests/stages/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../world-concepts/tables"
import { itemNotableHistory, itemRelationships, items } from "./tables"

export const itemsRelations = relations(items, ({ many, one }) => ({
	sourceOfRelationships: many(itemRelationships, {
		relationName: "sourceItem",
	}),

	targetOfRelationships: many(itemRelationships, {
		relationName: "targetItem",
	}),

	notableHistory: many(itemNotableHistory, {
		relationName: "item",
	}),

	stage: one(questStages, {
		fields: [items.stageId],
		references: [questStages.id],
		relationName: "stageItems",
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
		relationName: "npcItemRelationships",
	}),

	targetFaction: one(factions, {
		fields: [itemRelationships.targetFactionId],
		references: [factions.id],
		relationName: "factionItemRelationships",
	}),

	targetSite: one(sites, {
		fields: [itemRelationships.targetSiteId],
		references: [sites.id],
		relationName: "siteItemRelationships",
	}),

	targetQuest: one(quests, {
		fields: [itemRelationships.targetQuestId],
		references: [quests.id],
		relationName: "questItemRelationships",
	}),

	targetConflict: one(conflicts, {
		fields: [itemRelationships.targetConflictId],
		references: [conflicts.id],
		relationName: "conflictItemRelationships",
	}),

	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [itemRelationships.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "narrativeDestinationItemRelationships",
	}),

	targetWorldConcept: one(worldConcepts, {
		fields: [itemRelationships.targetWorldConceptId],
		references: [worldConcepts.id],
		relationName: "worldConceptItemRelationships",
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
