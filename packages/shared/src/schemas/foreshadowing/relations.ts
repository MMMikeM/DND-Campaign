import { relations, sql } from "drizzle-orm"
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
	// Target entity soft relations (what is being foreshadowed)
	targetQuest: one(quests, {
		relationName: "ForeshadowingTargetQuest",
		fields: [foreshadowing.targetEntityId],
		references: [quests.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'quest'`,
	}),

	targetNpc: one(npcs, {
		relationName: "ForeshadowingTargetNpc",
		fields: [foreshadowing.targetEntityId],
		references: [npcs.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'npc'`,
	}),

	targetNarrativeEvent: one(narrativeEvents, {
		relationName: "ForeshadowingTargetNarrativeEvent",
		fields: [foreshadowing.targetEntityId],
		references: [narrativeEvents.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'narrative_event'`,
	}),

	targetConflict: one(conflicts, {
		relationName: "ForeshadowingTargetConflict",
		fields: [foreshadowing.targetEntityId],
		references: [conflicts.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'conflict'`,
	}),

	targetItem: one(items, {
		relationName: "ForeshadowingTargetItem",
		fields: [foreshadowing.targetEntityId],
		references: [items.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'item'`,
	}),

	targetNarrativeDestination: one(narrativeDestinations, {
		relationName: "ForeshadowingTargetNarrativeDestination",
		fields: [foreshadowing.targetEntityId],
		references: [narrativeDestinations.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'narrative_destination'`,
	}),

	targetLore: one(lore, {
		relationName: "ForeshadowingTargetLore",
		fields: [foreshadowing.targetEntityId],
		references: [lore.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'lore'`,
	}),

	targetFaction: one(factions, {
		relationName: "ForeshadowingTargetFaction",
		fields: [foreshadowing.targetEntityId],
		references: [factions.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'faction'`,
	}),

	targetSite: one(sites, {
		relationName: "ForeshadowingTargetSite",
		fields: [foreshadowing.targetEntityId],
		references: [sites.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.targetEntityType} = 'site'`,
	}),

	// Source entity soft relations (where the foreshadowing comes from)
	sourceQuest: one(quests, {
		relationName: "ForeshadowingSourceQuest",
		fields: [foreshadowing.sourceEntityId],
		references: [quests.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.sourceEntityType} = 'quest'`,
	}),

	sourceQuestStage: one(questStages, {
		relationName: "ForeshadowingSourceQuestStage",
		fields: [foreshadowing.sourceEntityId],
		references: [questStages.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.sourceEntityType} = 'quest_stage'`,
	}),

	sourceSite: one(sites, {
		relationName: "ForeshadowingSourceSite",
		fields: [foreshadowing.sourceEntityId],
		references: [sites.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.sourceEntityType} = 'site'`,
	}),

	sourceNpc: one(npcs, {
		relationName: "ForeshadowingSourceNpc",
		fields: [foreshadowing.sourceEntityId],
		references: [npcs.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.sourceEntityType} = 'npc'`,
	}),

	sourceLore: one(lore, {
		relationName: "sourceLoreForForeshadowing",
		fields: [foreshadowing.sourceEntityId],
		references: [lore.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${foreshadowing.sourceEntityType} = 'lore'`,
	}),

	// Note: 'item_description' and 'abstract_theme'/'specific_reveal' don't map to specific tables
	// These are handled as text values in the application layer
}))
