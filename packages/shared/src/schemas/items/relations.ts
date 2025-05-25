import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { itemHistory, items } from "./tables"

export const itemsRelations = relations(items, ({ one, many }) => ({
	currentLocation: one(sites, {
		fields: [items.currentLocationId],
		references: [sites.id],
		relationName: "siteItems",
	}),
	ownerNpc: one(npcs, {
		fields: [items.ownerNpcId],
		references: [npcs.id],
		relationName: "npcItems",
	}),
	controllingFaction: one(factions, {
		fields: [items.controllingFactionId],
		references: [factions.id],
		relationName: "factionItems",
	}),
	quest: one(quests, {
		fields: [items.questId],
		references: [quests.id],
		relationName: "questItems",
	}),
	stage: one(questStages, {
		fields: [items.stageId],
		references: [questStages.id],
		relationName: "stageItems",
	}),
	history: many(itemHistory, { relationName: "itemHistory" }),
	embedding: one(embeddings, {
		fields: [items.embeddingId],
		references: [embeddings.id],
	}),
}))

export const itemHistoryRelations = relations(itemHistory, ({ one }) => ({
	item: one(items, {
		fields: [itemHistory.itemId],
		references: [items.id],
		relationName: "itemHistory",
	}),
}))
