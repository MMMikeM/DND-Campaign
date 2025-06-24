import { relations } from "drizzle-orm"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { lore, loreLinks } from "./tables"

export const loreRelations = relations(lore, ({ many }) => ({
	itemRelations: many(itemRelations),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetLore" }),
	outgoingForeshadowing: many(foreshadowing, { relationName: "sourceLoreForForeshadowing" }),
	links: many(loreLinks, { relationName: "loreLinks" }),
	relatedLinks: many(loreLinks, { relationName: "relatedLoreLinks" }),
}))

export const loreLinksRelations = relations(loreLinks, ({ one }) => ({
	lore: one(lore, {
		fields: [loreLinks.loreId],
		references: [lore.id],
		relationName: "loreLinks",
	}),
	region: one(regions, {
		fields: [loreLinks.regionId],
		references: [regions.id],
	}),
	faction: one(factions, {
		fields: [loreLinks.factionId],
		references: [factions.id],
	}),
	npc: one(npcs, {
		fields: [loreLinks.npcId],
		references: [npcs.id],
	}),
	conflict: one(conflicts, {
		fields: [loreLinks.conflictId],
		references: [conflicts.id],
	}),
	quest: one(quests, {
		fields: [loreLinks.questId],
		references: [quests.id],
	}),
	foreshadowing: one(foreshadowing, {
		fields: [loreLinks.foreshadowingId],
		references: [foreshadowing.id],
	}),
	narrativeDestination: one(narrativeDestinations, {
		fields: [loreLinks.narrativeDestinationId],
		references: [narrativeDestinations.id],
	}),
	relatedLore: one(lore, {
		fields: [loreLinks.relatedLoreId],
		references: [lore.id],
		relationName: "relatedLoreLinks",
	}),
}))
