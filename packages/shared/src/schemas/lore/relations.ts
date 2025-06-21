import { relations, sql } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { lore, loreLinks } from "./tables"

export const loreRelations = relations(lore, ({ many }) => ({
	links: many(loreLinks, { relationName: "LoreLinkParent" }),
	itemRelations: many(itemRelations),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetLore" }),
	outgoingForeshadowing: many(foreshadowing, { relationName: "sourceLoreForForeshadowing" }),
}))

export const loreLinksRelations = relations(loreLinks, ({ one }) => ({
	lore: one(lore, {
		relationName: "LoreLinkParent",
		fields: [loreLinks.loreId],
		references: [lore.id],
	}),

	// Soft relations for polymorphic targetEntityType/targetEntityId
	targetRegion: one(regions, {
		relationName: "LoreLinkTargetRegion",
		fields: [loreLinks.targetEntityId],
		references: [regions.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${loreLinks.targetEntityType} = 'region'`,
	}),

	targetFaction: one(factions, {
		relationName: "LoreLinkTargetFaction",
		fields: [loreLinks.targetEntityId],
		references: [factions.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${loreLinks.targetEntityType} = 'faction'`,
	}),

	targetNpc: one(npcs, {
		relationName: "LoreLinkTargetNpc",
		fields: [loreLinks.targetEntityId],
		references: [npcs.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${loreLinks.targetEntityType} = 'npc'`,
	}),

	targetConflict: one(conflicts, {
		relationName: "LoreLinkTargetConflict",
		fields: [loreLinks.targetEntityId],
		references: [conflicts.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${loreLinks.targetEntityType} = 'conflict'`,
	}),

	targetQuest: one(quests, {
		relationName: "LoreLinkTargetQuest",
		fields: [loreLinks.targetEntityId],
		references: [quests.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${loreLinks.targetEntityType} = 'quest'`,
	}),

	targetLore: one(lore, {
		relationName: "LoreLinkTargetLore",
		fields: [loreLinks.targetEntityId],
		references: [lore.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${loreLinks.targetEntityType} = 'lore'`,
	}),

	targetForeshadowing: one(foreshadowing, {
		fields: [loreLinks.targetEntityId],
		references: [foreshadowing.id],
		relationName: "targetForeshadowingForLoreLink",
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${loreLinks.targetEntityType} = 'foreshadowing'`,
	}),
}))
