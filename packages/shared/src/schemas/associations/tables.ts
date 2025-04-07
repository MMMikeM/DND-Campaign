import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, nullableFk, list, pk, string, oneOf, embeddingVector } from "../../db/utils.js"
import { embeddings } from "../embeddings/tables.js"
import { factions } from "../factions/tables.js"
import { npcs } from "../npc/tables.js"
import { quests, questStages } from "../quests/tables.js"
import { sites, regionConnections, regions, areas } from "../regions/tables.js"

const importanceLevels = ["minor", "supporting", "major", "critical"] as const
const factionRoles = ["quest_giver", "antagonist", "ally", "target", "beneficiary", "obstacle", "resource"] as const
const introductionTypes = ["rumor", "npc_interaction", "location_discovery"] as const
const presentationStyles = ["subtle", "clear", "urgent", "mysterious"] as const
const powerLevels = ["minor", "moderate", "strong", "dominant"] as const
const routeTypes = ["road", "river", "mountain pass", "sea route", "portal", "wilderness"] as const
const travelDifficulties = ["trivial", "easy", "moderate", "difficult", "treacherous"] as const
const trustLevel = ["none", "low", "medium", "high"] as const
const npcRoles = ["quest_giver", "ally", "antagonist", "guide", "bystander", "target", "victim", "resource"] as const

export const npcQuestRoles = pgTable(
	"npc_quest_roles",
	{
		id: pk(),
		npcId: cascadeFk("npc_id", npcs.id),
		questId: nullableFk("quest_id", quests.id),
		role: oneOf("role", npcRoles),
		importance: oneOf("importance", importanceLevels),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
		dramaticMoments: list("dramatic_moments"),
		hiddenAspects: list("hidden_aspects"),
	},
	(t) => [unique().on(t.npcId, t.questId, t.role)],
)

export const factionQuestInvolvement = pgTable(
	"faction_quest_involvement",
	{
		id: pk(),
		questId: cascadeFk("quest_id", quests.id),
		factionId: nullableFk("faction_id", factions.id),
		role: oneOf("role", factionRoles),
		interest: list("interest"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.questId, t.factionId)],
)

export const items = pgTable("items", {
	id: pk(),
	name: string("name").unique(),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),
	siteId: nullableFk("site_id", sites.id),
	questId: nullableFk("quest_id", quests.id),
	stageId: nullableFk("stage_id", questStages.id),
	type: string("type"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	significance: string("significance"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const questIntroductions = pgTable(
	"quest_introductions",
	{
		id: pk(),
		stageId: cascadeFk("stage_id", questStages.id),
		siteId: nullableFk("site_id", sites.id),
		factionId: nullableFk("faction_id", factions.id),
		itemId: nullableFk("item_id", items.id),
		source: string("source"),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
		discoveryCondition: list("discovery_condition"),
		introductionType: oneOf("introduction_type", introductionTypes),
		presentationStyle: oneOf("presentation_style", presentationStyles),
		hookContent: list("hook_content"),
	},
	(t) => [unique().on(t.stageId, t.siteId, t.factionId, t.itemId)],
)

export const questHookNpcs = pgTable(
	"quest_hook_npcs",
	{
		id: pk(),
		hookId: cascadeFk("hook_id", questIntroductions.id),
		npcId: cascadeFk("npc_id", npcs.id),
		relationship: string("relationship"),
		trustRequired: oneOf("trust_required", trustLevel),
		dialogueHint: string("dialogue_hint"),
	},
	(t) => [unique().on(t.hookId, t.npcId)],
)

export const clues = pgTable("clues", {
	id: pk(),
	questStageId: cascadeFk("quest_stage_id", questStages.id),
	factionId: nullableFk("faction_id", factions.id),
	siteId: nullableFk("site_id", sites.id),
	npcId: nullableFk("npc_id", npcs.id),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	discoveryCondition: list("discovery_condition"),
	reveals: list("reveals"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const factionRegionalPower = pgTable(
	"faction_regional_power",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		questId: nullableFk("quest_id", quests.id),
		regionId: nullableFk("region_id", regions.id),
		areaId: nullableFk("area_id", areas.id),
		siteId: nullableFk("site_id", sites.id),
		powerLevel: oneOf("power_level", powerLevels),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.questId, t.regionId, t.areaId, t.siteId)],
)

export const regionConnectionDetails = pgTable("region_connection_details", {
	id: pk(),
	relationId: cascadeFk("relation_id", regionConnections.id).unique(),
	routeType: oneOf("route_type", routeTypes),
	travelDifficulty: oneOf("travel_difficulty", travelDifficulties),
	travelTime: string("travel_time"),
	controllingFaction: nullableFk("controlling_faction", factions.id),
	travelHazards: list("travel_hazards"),
	pointsOfInterest: list("points_of_interest"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
})

export const enums = {
	factionRoles,
	importanceLevels,
	introductionTypes,
	npcRoles,
	powerLevels,
	presentationStyles,
	routeTypes,
	travelDifficulties,
	trustLevel,
}
