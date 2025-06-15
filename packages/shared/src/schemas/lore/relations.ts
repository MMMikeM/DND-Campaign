import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { lore, loreLinks } from "./tables"

export const loreRelations = relations(lore, ({ many }) => ({
	links: many(loreLinks),
	itemRelations: many(itemRelations),
	incomingForeshadowing: many(foreshadowing, { relationName: "foreshadowingForLore" }),
}))

export const loreLinksRelations = relations(loreLinks, ({ one }) => ({
	lore: one(lore, {
		fields: [loreLinks.loreId],
		references: [lore.id],
	}),

	linkedRegion: one(regions, {
		fields: [loreLinks.regionId],
		references: [regions.id],
	}),
	linkedNpc: one(npcs, {
		fields: [loreLinks.npcId],
		references: [npcs.id],
	}),
	linkedFaction: one(factions, {
		fields: [loreLinks.factionId],
		references: [factions.id],
	}),
	linkedQuest: one(quests, {
		fields: [loreLinks.questId],
		references: [quests.id],
	}),
	linkedConflict: one(conflicts, {
		fields: [loreLinks.conflictId],
		references: [conflicts.id],
	}),
}))
