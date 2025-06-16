import { relations, sql } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { lore } from "../lore/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { questStages } from "../quests/stages/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { itemNotableHistory, itemRelations, items } from "./tables"

export const itemsRelations = relations(items, ({ many, one }) => ({
	relations: many(itemRelations),

	notableHistory: many(itemNotableHistory),
	incomingForeshadowing: many(foreshadowing, { relationName: "foreshadowingForItem" }),

	questStage: one(questStages, {
		fields: [items.questStageId],
		references: [questStages.id],
	}),
}))

export const itemRelationsRelations = relations(itemRelations, ({ one }) => ({
	sourceItem: one(items, {
		fields: [itemRelations.sourceItemId],
		references: [items.id],
	}),

	// Soft relations for polymorphic targetEntityType/targetEntityId
	targetItem: one(items, {
		relationName: "ItemRelationTargetItem",
		fields: [itemRelations.targetEntityId],
		references: [items.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'item'`,
	}),

	targetNpc: one(npcs, {
		relationName: "ItemRelationTargetNpc",
		fields: [itemRelations.targetEntityId],
		references: [npcs.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'npc'`,
	}),

	targetFaction: one(factions, {
		relationName: "ItemRelationTargetFaction",
		fields: [itemRelations.targetEntityId],
		references: [factions.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'faction'`,
	}),

	targetSite: one(sites, {
		relationName: "ItemRelationTargetSite",
		fields: [itemRelations.targetEntityId],
		references: [sites.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'site'`,
	}),

	targetQuest: one(quests, {
		relationName: "ItemRelationTargetQuest",
		fields: [itemRelations.targetEntityId],
		references: [quests.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'quest'`,
	}),

	targetConflict: one(conflicts, {
		relationName: "ItemRelationTargetConflict",
		fields: [itemRelations.targetEntityId],
		references: [conflicts.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'conflict'`,
	}),

	targetNarrativeDestination: one(narrativeDestinations, {
		relationName: "ItemRelationTargetNarrativeDestination",
		fields: [itemRelations.targetEntityId],
		references: [narrativeDestinations.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'narrative_destination'`,
	}),

	targetLore: one(lore, {
		relationName: "ItemRelationTargetLore",
		fields: [itemRelations.targetEntityId],
		references: [lore.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${itemRelations.targetEntityType} = 'lore'`,
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
