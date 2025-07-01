import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { lore, loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { itemConnections, items } from "./tables"

export const itemsRelations = relations(items, ({ many }) => ({
	relations: many(itemConnections),
	outgoingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingSourceItem" }),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetItem" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetItem" }),
}))

export const itemRelationsRelations = relations(itemConnections, ({ one }) => ({
	sourceItem: one(items, {
		fields: [itemConnections.itemId],
		references: [items.id],
	}),

	item: one(items, {
		fields: [itemConnections.connectedItemId],
		references: [items.id],
	}),
	npc: one(npcs, {
		fields: [itemConnections.connectedNpcId],
		references: [npcs.id],
	}),
	faction: one(factions, {
		fields: [itemConnections.connectedFactionId],
		references: [factions.id],
	}),
	site: one(sites, {
		fields: [itemConnections.connectedSiteId],
		references: [sites.id],
	}),
	quest: one(quests, {
		fields: [itemConnections.connectedQuestId],
		references: [quests.id],
	}),
	conflict: one(conflicts, {
		fields: [itemConnections.connectedConflictId],
		references: [conflicts.id],
	}),
	lore: one(lore, {
		fields: [itemConnections.connectedLoreId],
		references: [lore.id],
	}),
	questStage: one(questStages, {
		fields: [itemConnections.connectedQuestStageId],
		references: [questStages.id],
		relationName: "questStageItemConnections",
	}),
}))
