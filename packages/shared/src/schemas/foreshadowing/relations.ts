import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { lore } from "../lore/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { foreshadowing } from "./tables"

export const foreshadowingRelations = relations(foreshadowing, ({ one }) => ({
	targetQuest: one(quests, {
		fields: [foreshadowing.targetQuestId],
		references: [quests.id],
		relationName: "foreshadowingForQuest",
	}),
	targetNpc: one(npcs, {
		fields: [foreshadowing.targetNpcId],
		references: [npcs.id],
		relationName: "foreshadowingForNpc",
	}),
	targetNarrativeEvent: one(narrativeEvents, {
		fields: [foreshadowing.targetNarrativeEventId],
		references: [narrativeEvents.id],
		relationName: "foreshadowingForNarrativeEvent",
	}),
	targetConflict: one(conflicts, {
		fields: [foreshadowing.targetConflictId],
		references: [conflicts.id],
		relationName: "foreshadowingForConflict",
	}),
	targetItem: one(items, {
		fields: [foreshadowing.targetItemId],
		references: [items.id],
		relationName: "foreshadowingForItem",
	}),
	targetNarrativeDestination: one(narrativeDestinations, {
		fields: [foreshadowing.targetNarrativeDestinationId],
		references: [narrativeDestinations.id],
		relationName: "foreshadowingForNarrativeDestination",
	}),
	targetLore: one(lore, {
		fields: [foreshadowing.targetLoreId],
		references: [lore.id],
		relationName: "foreshadowingForLore",
	}),
	targetFaction: one(factions, {
		fields: [foreshadowing.targetFactionId],
		references: [factions.id],
		relationName: "foreshadowingForFaction",
	}),
	targetSite: one(sites, {
		fields: [foreshadowing.targetSiteId],
		references: [sites.id],
		relationName: "foreshadowingForSite",
	}),

	sourceQuest: one(quests, {
		fields: [foreshadowing.sourceQuestId],
		references: [quests.id],
		relationName: "foreshadowingFromQuest",
	}),
	sourceQuestStage: one(questStages, {
		fields: [foreshadowing.sourceQuestStageId],
		references: [questStages.id],
		relationName: "foreshadowingFromQuestStage",
	}),
	sourceSite: one(sites, {
		fields: [foreshadowing.sourceSiteId],
		references: [sites.id],
		relationName: "foreshadowingFromSite",
	}),
	sourceNpc: one(npcs, {
		fields: [foreshadowing.sourceNpcId],
		references: [npcs.id],
		relationName: "foreshadowingFromNpc",
	}),
}))
