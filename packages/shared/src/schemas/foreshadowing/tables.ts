// foreshadowing/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"

const foreshadowingSubtlety = ["obvious", "moderate", "subtle", "hidden"] as const
const narrativeWeight = ["minor", "supporting", "major", "crucial"] as const
const foreshadowingTypes = ["document", "conversation", "object", "environmental", "vision", "rumor"] as const

export const narrativeForeshadowing = pgTable("narrative_foreshadowing", {
	id: pk(),

	questStageId: nullableFk("quest_stage_id", questStages.id),
	siteId: nullableFk("site_id", sites.id),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),

	name: string("name"),
	type: oneOf("type", foreshadowingTypes),
	description: list("description"),
	discoveryCondition: list("discovery_condition"),
	subtlety: oneOf("subtlety", foreshadowingSubtlety).default("moderate"),
	narrativeWeight: oneOf("narrative_weight", narrativeWeight).default("supporting"),

	foreshadowsQuestId: nullableFk("foreshadows_quest_id", quests.id),
	foreshadowsEventId: nullableFk("foreshadows_event_id", narrativeEvents.id),
	foreshadowsNpcId: nullableFk("foreshadows_npc_id", npcs.id),
	foreshadowsDestinationId: nullableFk("foreshadows_destination_id", narrativeDestinations.id),
	foreshadowsElement: string("foreshadows_element"),

	playerNotes: list("player_notes"),
	gmNotes: list("gm_notes"),
})

export const enums = {
	foreshadowingSubtlety,
	narrativeWeight,
	foreshadowingTypes,
}
