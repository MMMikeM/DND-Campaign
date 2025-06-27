import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { loreLinks } from "../lore/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { itemNotableHistory, itemRelations, items } from "./tables"

export const itemsRelations = relations(items, ({ many, one }) => ({
	relations: many(itemRelations),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceItem" }),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetItem" }),
	notableHistory: many(itemNotableHistory),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetItem" }),

	questStage: one(questStages, {
		fields: [items.questStageId],
		references: [questStages.id],
		relationName: "stageItems",
	}),
}))

export const itemRelationsRelations = relations(itemRelations, ({ one }) => ({
	sourceItem: one(items, {
		fields: [itemRelations.sourceItemId],
		references: [items.id],
	}),

	item: one(items, {
		fields: [itemRelations.itemId],
		references: [items.id],
	}),
	npc: one(npcs, {
		fields: [itemRelations.npcId],
		references: [npcs.id],
	}),
	faction: one(factions, {
		fields: [itemRelations.factionId],
		references: [factions.id],
	}),
	site: one(sites, {
		fields: [itemRelations.siteId],
		references: [sites.id],
	}),
	quest: one(quests, {
		fields: [itemRelations.questId],
		references: [quests.id],
		relationName: "questItemRelations",
	}),
	conflict: one(conflicts, {
		fields: [itemRelations.conflictId],
		references: [conflicts.id],
	}),
	narrativeDestination: one(narrativeDestinations, {
		fields: [itemRelations.narrativeDestinationId],
		references: [narrativeDestinations.id],
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
