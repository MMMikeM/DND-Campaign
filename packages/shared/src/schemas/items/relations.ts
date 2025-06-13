import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { questStages } from "../quests/stages/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../world-concepts/tables"
import { itemNotableHistory, itemRelationships, items } from "./tables"

export const itemsRelations = relations(items, ({ many, one }) => ({
	outgoingRelationships: many(itemRelationships, {
		relationName: "sourceItem",
	}),

	incomingRelationships: many(itemRelationships, {
		relationName: "targetItem",
	}),

	notableHistory: many(itemNotableHistory),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForItem" }),

	questStage: one(questStages, {
		fields: [items.questStageId],
		references: [questStages.id],
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

	targetConflict: one(conflicts, {
		fields: [itemRelationships.targetConflictId],
		references: [conflicts.id],
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
	}),
	keyNpc: one(npcs, {
		fields: [itemNotableHistory.keyNpcId],
		references: [npcs.id],
	}),
	locationSite: one(sites, {
		fields: [itemNotableHistory.locationSiteId],
		references: [sites.id],
	}),
}))
