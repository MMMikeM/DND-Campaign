// associations/relations.ts
import { relations } from "drizzle-orm"
import {
	clues,
	factionQuestInvolvement,
	factionRegionalPower,
	items,
	npcQuestRoles,
	questIntroductions,
	questHookNpcs,
	regionConnectionDetails,
} from "./tables.js"
import { factions } from "../factions/tables.js"
import { npcs } from "../npc/tables.js"
import { quests, questStages } from "../quests/tables.js"
import { sites, regionConnections, regions, areas } from "../regions/tables.js"

export const questNpcRelations = relations(npcQuestRoles, ({ one }) => ({
	quest: one(quests, {
		fields: [npcQuestRoles.questId],
		references: [quests.id],
		relationName: "questNpcs",
	}),
	npc: one(npcs, {
		fields: [npcQuestRoles.npcId],
		references: [npcs.id],
		relationName: "npcQuests",
	}),
}))

export const clueRelations = relations(clues, ({ one }) => ({
	stage: one(questStages, {
		fields: [clues.questStageId],
		references: [questStages.id],
		relationName: "stageClues",
	}),
	site: one(sites, {
		fields: [clues.siteId],
		references: [sites.id],
		relationName: "siteClues",
	}),
	npc: one(npcs, {
		fields: [clues.npcId],
		references: [npcs.id],
		relationName: "npcClues",
	}),
	faction: one(factions, {
		fields: [clues.factionId],
		references: [factions.id],
		relationName: "factionClues",
	}),
}))

export const factionQuestsRelations = relations(factionQuestInvolvement, ({ one }) => ({
	faction: one(factions, {
		fields: [factionQuestInvolvement.factionId],
		references: [factions.id],
		relationName: "factionQuests",
	}),
	quest: one(quests, {
		fields: [factionQuestInvolvement.questId],
		references: [quests.id],
		relationName: "questFactions",
	}),
}))

export const factionInfluenceRelations = relations(factionRegionalPower, ({ one }) => ({
	faction: one(factions, {
		fields: [factionRegionalPower.factionId],
		references: [factions.id],
		relationName: "factionInfluence",
	}),
	quest: one(quests, {
		fields: [factionRegionalPower.questId],
		references: [quests.id],
		relationName: "questFactionInfluence",
	}),
	region: one(regions, {
		fields: [factionRegionalPower.regionId],
		references: [regions.id],
		relationName: "regionFactionInfluence",
	}),
	area: one(areas, {
		fields: [factionRegionalPower.areaId],
		references: [areas.id],
		relationName: "areaFactionInfluence",
	}),
	site: one(sites, {
		fields: [factionRegionalPower.siteId],
		references: [sites.id],
		relationName: "siteFactionInfluence",
	}),
}))

export const itemRelations = relations(items, ({ one }) => ({
	npc: one(npcs, {
		fields: [items.npcId],
		references: [npcs.id],
		relationName: "npcItems",
	}),
	faction: one(factions, {
		fields: [items.factionId],
		references: [factions.id],
		relationName: "factionItems",
	}),
	quest: one(quests, {
		fields: [items.questId],
		references: [quests.id],
		relationName: "questItems",
	}),
	site: one(sites, {
		fields: [items.siteId],
		references: [sites.id],
		relationName: "siteItems",
	}),
	stage: one(questStages, {
		fields: [items.stageId],
		references: [questStages.id],
		relationName: "stageItems",
	}),
}))

export const questHooksRelations = relations(questIntroductions, ({ one, many }) => ({
	quest: one(questStages, {
		fields: [questIntroductions.stageId],
		references: [questStages.id],
		relationName: "questHooks",
	}),
	site: one(sites, {
		fields: [questIntroductions.siteId],
		references: [sites.id],
		relationName: "siteHooks",
	}),
	stage: one(questStages, {
		fields: [questIntroductions.stageId],
		references: [questStages.id],
		relationName: "stageHooks",
	}),
	faction: one(factions, {
		fields: [questIntroductions.factionId],
		references: [factions.id],
		relationName: "factionHooks",
	}),
	npcs: many(questHookNpcs, { relationName: "hookNpcs" }),
}))

export const questHookNpcsRelations = relations(questHookNpcs, ({ one }) => ({
	hook: one(questIntroductions, {
		fields: [questHookNpcs.hookId],
		references: [questIntroductions.id],
		relationName: "hookNpcs",
	}),
	npc: one(npcs, {
		fields: [questHookNpcs.npcId],
		references: [npcs.id],
		relationName: "npcQuestHooks",
	}),
}))

export const regionConnectionDetailsRelations = relations(regionConnectionDetails, ({ one }) => ({
	connection: one(regionConnections, {
		fields: [regionConnectionDetails.relationId],
		references: [regionConnections.id],
		relationName: "connectionDetails", // Match name from above
	}),
	controllingFaction: one(factions, {
		fields: [regionConnectionDetails.controllingFaction],
		references: [factions.id],
		relationName: "factionControlledRoutes",
	}),
}))
