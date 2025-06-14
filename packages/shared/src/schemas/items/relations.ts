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
import { itemNotableHistory, itemRelations, items } from "./tables"

export const itemsRelations = relations(items, ({ many, one }) => ({
	outgoingRelations: many(itemRelations, {
		relationName: "sourceItem",
	}),

	incomingRelations: many(itemRelations, {
		relationName: "targetItem",
	}),

	notableHistory: many(itemNotableHistory),
	foreshadowingTarget: many(foreshadowing, { relationName: "foreshadowingForItem" }),

	questStage: one(questStages, {
		fields: [items.questStageId],
		references: [questStages.id],
	}),
}))

export const itemRelationTargets = relations(itemRelations, ({ one }) => ({
	sourceItem: one(items, {
		fields: [itemRelations.sourceItemId],
		references: [items.id],
		relationName: "sourceItem",
	}),

	targetItem: one(items, {
		fields: [itemRelations.targetItemId],
		references: [items.id],
		relationName: "targetItem",
	}),

	targetNpc: one(npcs, {
		fields: [itemRelations.targetNpcId],
		references: [npcs.id],
	}),

	targetFaction: one(factions, {
		fields: [itemRelations.targetFactionId],
		references: [factions.id],
	}),

	targetSite: one(sites, {
		fields: [itemRelations.targetSiteId],
		references: [sites.id],
	}),

	targetQuest: one(quests, {
		fields: [itemRelations.targetQuestId],
		references: [quests.id],
	}),

	targetConflict: one(conflicts, {
		fields: [itemRelations.targetConflictId],
		references: [conflicts.id],
	}),

	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [itemRelations.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
	}),

	targetWorldConcept: one(worldConcepts, {
		fields: [itemRelations.targetWorldConceptId],
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
