// investigation/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { discoverableElements, investigations } from "./tables"

export const discoverableElementsRelations = relations(discoverableElements, ({ one }) => ({
	stage: one(questStages, {
		fields: [discoverableElements.questStageId],
		references: [questStages.id],
		relationName: "stageDiscoverableElements",
	}),
	location: one(sites, {
		fields: [discoverableElements.siteId],
		references: [sites.id],
		relationName: "siteDiscoverableElements",
	}),
	sourceNpc: one(npcs, {
		fields: [discoverableElements.npcId],
		references: [npcs.id],
		relationName: "npcDiscoverableElements",
	}),
	relatedItem: one(items, {
		fields: [discoverableElements.relatedItemId],
		references: [items.id],
		relationName: "itemDiscoverableElements",
	}),
	faction: one(factions, {
		fields: [discoverableElements.factionId],
		references: [factions.id],
		relationName: "factionDiscoverableElements",
	}),
	investigation: one(investigations, {
		fields: [discoverableElements.investigationId],
		references: [investigations.id],
		relationName: "investigationDiscoverableElements",
	}),
	// What this points to (foreshadowing relations)
	foreshadowsQuest: one(quests, {
		fields: [discoverableElements.foreshadowsQuestId],
		references: [quests.id],
		relationName: "foreshadowsQuest",
	}),
	foreshadowsEvent: one(narrativeEvents, {
		fields: [discoverableElements.foreshadowsEventId],
		references: [narrativeEvents.id],
		relationName: "foreshadowsEvent",
	}),
	foreshadowsNpc: one(npcs, {
		fields: [discoverableElements.foreshadowsNpcId],
		references: [npcs.id],
		relationName: "foreshadowsNpc",
	}),
	foreshadowedDestination: one(narrativeDestinations, {
		fields: [discoverableElements.foreshadowsDestinationId],
		references: [narrativeDestinations.id],
		relationName: "foreshadowedDestination",
	}),
	embedding: one(embeddings, {
		fields: [discoverableElements.embeddingId],
		references: [embeddings.id],
	}),
}))

export const investigationsRelations = relations(investigations, ({ one, many }) => ({
	quest: one(quests, {
		fields: [investigations.questId],
		references: [quests.id],
		relationName: "questInvestigations",
	}),
	elements: many(discoverableElements, {
		relationName: "investigationDiscoverableElements",
	}),
}))
