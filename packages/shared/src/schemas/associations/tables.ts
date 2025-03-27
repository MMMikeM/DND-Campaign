// associations/tables.ts
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { cascadeFk, nullableFk, list, pk, string, oneOf } from "../../db/utils.js"
import { factions } from "../factions/tables.js"
import { npcs } from "../npc/tables.js"
import { quests, questStages } from "../quests/tables.js"
import { locations, regionRelations, regions } from "../regions/tables.js"
import { trustLevel } from "../common.js"

const importanceLevels = ["minor", "supporting", "major", "critical"] as const

export const questNpcs = sqliteTable("quest_npcs", {
	id: pk(),
	npcId: cascadeFk("npc_id", npcs.id),
	questId: nullableFk("quest_id", quests.id),
	role: string("role"),
	importance: oneOf("importance", importanceLevels),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	dramaticMoments: list("dramatic_moments"),
	hiddenAspects: list("hidden_aspects"),
})

export const factionQuests = sqliteTable("faction_quests", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id),
	factionId: nullableFk("faction_id", factions.id),
	role: text("role").notNull(),
	interest: list("interest"),
})

export const questHooks = sqliteTable("quest_hooks", {
	id: pk(),
	questId: cascadeFk("quest_id", quests.id),
	locationId: nullableFk("location_id", locations.id),
	stageId: nullableFk("stage_id", questStages.id),
	factionId: nullableFk("faction_id", factions.id),
	itemId: nullableFk("item_id", locations.id),
	source: string("source"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	discoveryCondition: list("discovery_condition"),
	hookType: text("hook_type", { enum: ["rumor", "npc_interaction", "location_discovery"] }),
	presentation: text("presentation", { enum: ["subtle", "clear", "urgent", "mysterious"] }),
	hookContent: list("hook_content"),
})

export const questHookNpcs = sqliteTable("quest_hook_npcs", {
	id: pk(),
	hookId: cascadeFk("hook_id", questHooks.id),
	npcId: cascadeFk("npc_id", npcs.id),
	relationship: string("relationship"),
	trustRequired: oneOf("trust_required", trustLevel),
	dialogueHint: string("dialogue_hint"),
})

export const clues = sqliteTable("clues", {
	id: pk(),
	questStageId: cascadeFk("quest_stage_id", questStages.id),
	factionId: nullableFk("faction_id", factions.id),
	locationId: nullableFk("location_id", locations.id),
	npcId: nullableFk("npc_id", npcs.id),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	discoveryCondition: list("discovery_condition"),
	reveals: list("reveals"),
})

export const items = sqliteTable("items", {
	id: pk(),
	name: string("name").unique(),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),
	locationId: nullableFk("location_id", locations.id),
	questId: nullableFk("quest_id", quests.id),
	stageId: nullableFk("stage_id", questStages.id),
	type: string("type"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	significance: string("significance"),
})

export const factionInfluence = sqliteTable("faction_influence", {
	id: pk(),
	questId: nullableFk("quest_id", quests.id),
	factionId: nullableFk("faction_id", factions.id),
	regionId: nullableFk("region_id", regions.id),
	locationId: nullableFk("location_id", locations.id),
	influenceLevel: string("influence_level"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
})

export const regionConnections = sqliteTable("region_connections", {
	id: pk(),
	relationId: cascadeFk("relation_id", regionRelations.id), // Reference to the relationship
	routeType: oneOf("route_type", ["road", "river", "mountain pass", "sea route", "portal", "wilderness"]),
	travelDifficulty: oneOf("travel_difficulty", ["trivial", "easy", "moderate", "difficult", "treacherous"]),
	travelTime: string("travel_time"),
	controllingFaction: nullableFk("controlling_faction", factions.id),
	travelHazards: list("travel_hazards"),
	pointsOfInterest: list("points_of_interest"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
})
