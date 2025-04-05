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
import { locations, regionConnections, regions } from "../regions/tables.js"

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
	location: one(locations, {
		fields: [factionRegionalPower.locationId],
		references: [locations.id],
		relationName: "locationFactionInfluence",
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

export const questHooksRelations = relations(questIntroductions, ({ one, many }) => ({
	quest: one(questStages, {
		fields: [questIntroductions.stageId],
		references: [questStages.id],
		relationName: "questHooks",
	}),
	location: one(locations, {
		fields: [questIntroductions.locationId],
		references: [locations.id],
		relationName: "locationHooks",
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

export const regionConnectionsRelations = relations(regionConnectionDetails, ({ one }) => ({
	relation: one(regionConnections, {
		// Corrected table name
		fields: [regionConnectionDetails.relationId],
		references: [regionConnections.id], // Corrected reference
		relationName: "relationConnections",
	}),
	controllingFaction: one(factions, {
		fields: [regionConnectionDetails.controllingFaction], // Corrected field reference source
		references: [factions.id],
		relationName: "factionControlledRoutes",
	}),
}))
