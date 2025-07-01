import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { lore, loreLinks } from "../lore/tables"
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
		relationName: "ForeshadowingTargetQuest",
	}),
	targetNpc: one(npcs, {
		fields: [foreshadowing.targetNpcId],
		references: [npcs.id],
		relationName: "ForeshadowingTargetNpc",
	}),
	targetConflict: one(conflicts, {
		fields: [foreshadowing.targetConflictId],
		references: [conflicts.id],
		relationName: "ForeshadowingTargetConflict",
	}),
	targetItem: one(items, {
		fields: [foreshadowing.targetItemId],
		references: [items.id],
		relationName: "ForeshadowingTargetItem",
	}),
	targetLore: one(lore, {
		fields: [foreshadowing.targetLoreId],
		references: [lore.id],
		relationName: "ForeshadowingTargetLore",
	}),
	targetFaction: one(factions, {
		fields: [foreshadowing.targetFactionId],
		references: [factions.id],
		relationName: "ForeshadowingTargetFaction",
	}),
	targetSite: one(sites, {
		fields: [foreshadowing.targetSiteId],
		references: [sites.id],
		relationName: "ForeshadowingTargetSite",
	}),

	// Source entity relations
	sourceQuest: one(quests, {
		fields: [foreshadowing.sourceQuestId],
		references: [quests.id],
		relationName: "ForeshadowingSourceQuest",
	}),
	sourceQuestStage: one(questStages, {
		fields: [foreshadowing.sourceQuestStageId],
		references: [questStages.id],
		relationName: "ForeshadowingSourceQuestStage",
	}),
	sourceSite: one(sites, {
		fields: [foreshadowing.sourceSiteId],
		references: [sites.id],
		relationName: "ForeshadowingSourceSite",
	}),
	sourceNpc: one(npcs, {
		fields: [foreshadowing.sourceNpcId],
		references: [npcs.id],
		relationName: "ForeshadowingSourceNpc",
	}),
	sourceLore: one(lore, {
		fields: [foreshadowing.sourceLoreId],
		references: [lore.id],
		relationName: "sourceLoreForForeshadowing",
	}),
	sourceItemDescription: one(items, {
		fields: [foreshadowing.sourceItemDescriptionId],
		references: [items.id],
		relationName: "ForeshadowingSourceItem",
	}),
}))
