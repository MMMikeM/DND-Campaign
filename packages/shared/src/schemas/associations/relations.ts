// associations/relations.ts
import { relations } from "drizzle-orm"
import {
	clues,
	factionQuests,
	factionInfluence,
	items,
	questNpcs,
	questHooks,
	questHookNpcs,
	regionConnections,
} from "./tables.js"
import { factions } from "../factions/tables.js"
import { npcs } from "../npc/tables.js"
import { quests, questStages } from "../quests/tables.js"
import { locations, regionRelations } from "../regions/tables.js"

export const clueRelations = relations(clues, ({ one }) => ({
	stage: one(questStages, {
		fields: [clues.questStageId],
		references: [questStages.id],
		relationName: "stageClues",
	}),
	location: one(locations, {
		fields: [clues.locationId],
		references: [locations.id],
		relationName: "locationClues",
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

export const factionQuestsRelations = relations(factionQuests, ({ one }) => ({
	faction: one(factions, {
		fields: [factionQuests.factionId],
		references: [factions.id],
		relationName: "factionQuests",
	}),
	quest: one(quests, {
		fields: [factionQuests.questId],
		references: [quests.id],
		relationName: "questFactions",
	}),
}))

export const factionInfluenceRelations = relations(factionInfluence, ({ one }) => ({
	faction: one(factions, {
		fields: [factionInfluence.factionId],
		references: [factions.id],
		relationName: "factionInfluence",
	}),
	quest: one(quests, {
		fields: [factionInfluence.questId],
		references: [quests.id],
		relationName: "questFactionInfluence",
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
	location: one(locations, {
		fields: [items.locationId],
		references: [locations.id],
		relationName: "locationItems",
	}),
	stage: one(questStages, {
		fields: [items.stageId],
		references: [questStages.id],
		relationName: "stageItems",
	}),
}))

export const questNpcRelations = relations(questNpcs, ({ one }) => ({
	quest: one(quests, {
		fields: [questNpcs.questId],
		references: [quests.id],
		relationName: "questNpcs",
	}),
	npc: one(npcs, {
		fields: [questNpcs.npcId],
		references: [npcs.id],
		relationName: "npcQuests",
	}),
}))

export const questHooksRelations = relations(questHooks, ({ one, many }) => ({
	quest: one(questStages, {
		fields: [questHooks.stageId],
		references: [questStages.id],
		relationName: "questHooks",
	}),
	location: one(locations, {
		fields: [questHooks.locationId],
		references: [locations.id],
		relationName: "locationHooks",
	}),
	stage: one(questStages, {
		fields: [questHooks.stageId],
		references: [questStages.id],
		relationName: "stageHooks",
	}),
	faction: one(factions, {
		fields: [questHooks.factionId],
		references: [factions.id],
		relationName: "factionHooks",
	}),
	npcs: many(questHookNpcs, { relationName: "hookNpcs" }),
}))

export const questHookNpcsRelations = relations(questHookNpcs, ({ one }) => ({
	hook: one(questHooks, {
		fields: [questHookNpcs.hookId],
		references: [questHooks.id],
		relationName: "hookNpcs",
	}),
	npc: one(npcs, {
		fields: [questHookNpcs.npcId],
		references: [npcs.id],
		relationName: "npcQuestHooks",
	}),
}))

export const regionConnectionsRelations = relations(regionConnections, ({ one }) => ({
	relation: one(regionRelations, {
		fields: [regionConnections.relationId],
		references: [regionRelations.id],
		relationName: "relationConnections",
	}),
	controllingFaction: one(factions, {
		fields: [regionConnections.controllingFaction],
		references: [factions.id],
		relationName: "factionControlledRoutes",
	}),
}))
