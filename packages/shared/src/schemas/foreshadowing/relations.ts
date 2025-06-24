import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { lore, loreLinks } from "../lore/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { foreshadowing } from "./tables"

export const foreshadowingRelations = relations(foreshadowing, ({ one, many }) => ({
	incomingLoreLinks: many(loreLinks, { relationName: "targetForeshadowingForLoreLink" }),

	// Target entity relations
	targetQuest: one(quests, {
		fields: [foreshadowing.targetQuestId],
		references: [quests.id],
	}),
	targetNpc: one(npcs, {
		fields: [foreshadowing.targetNpcId],
		references: [npcs.id],
	}),
	targetNarrativeEvent: one(narrativeEvents, {
		fields: [foreshadowing.targetNarrativeEventId],
		references: [narrativeEvents.id],
	}),
	targetConflict: one(conflicts, {
		fields: [foreshadowing.targetConflictId],
		references: [conflicts.id],
	}),
	targetItem: one(items, {
		fields: [foreshadowing.targetItemId],
		references: [items.id],
	}),
	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [foreshadowing.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
	}),
	targetLore: one(lore, {
		fields: [foreshadowing.targetLoreId],
		references: [lore.id],
	}),
	targetFaction: one(factions, {
		fields: [foreshadowing.targetFactionId],
		references: [factions.id],
	}),
	targetSite: one(sites, {
		fields: [foreshadowing.targetSiteId],
		references: [sites.id],
	}),

	// Source entity relations
	sourceQuest: one(quests, {
		fields: [foreshadowing.sourceQuestId],
		references: [quests.id],
	}),
	sourceQuestStage: one(questStages, {
		fields: [foreshadowing.sourceQuestStageId],
		references: [questStages.id],
	}),
	sourceSite: one(sites, {
		fields: [foreshadowing.sourceSiteId],
		references: [sites.id],
	}),
	sourceNpc: one(npcs, {
		fields: [foreshadowing.sourceNpcId],
		references: [npcs.id],
	}),
	sourceLore: one(lore, {
		fields: [foreshadowing.sourceLoreId],
		references: [lore.id],
	}),
	sourceItemDescription: one(items, {
		fields: [foreshadowing.sourceItemDescriptionId],
		references: [items.id],
	}),
}))
