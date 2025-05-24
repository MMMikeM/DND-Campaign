// world/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { quests, stageDecisions } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"

const changeSeverity = ["minor", "moderate", "major", "campaign-defining"] as const
const changeTypes = [
	"faction_power",
	"region_status",
	"political_shift",
	"environmental",
	"demographic",
	"reputation",
	"resource_availability",
	"npc_status",
] as const
const changeVisibility = ["obvious", "subtle", "hidden"] as const
const changeTimeframe = ["immediate", "next_session", "specific_trigger", "later_in_campaign"] as const
const sourcesOfChange = ["decision", "quest_completion", "world_event", "player_choice", "time_passage"] as const

export const worldStateChanges = pgTable("world_state_changes", {
	id: pk(),

	name: string("name").unique(),

	changeType: oneOf("change_type", changeTypes),
	severity: oneOf("severity", changeSeverity).default("moderate"),
	visibility: oneOf("visibility", changeVisibility).default("obvious"),
	timeframe: oneOf("timeframe", changeTimeframe).default("immediate"),
	sourceType: oneOf("source_type", sourcesOfChange),

	questId: nullableFk("quest_id", quests.id),
	decisionId: nullableFk("decision_id", stageDecisions.id),
	conflictId: nullableFk("conflict_id", majorConflicts.id),

	factionId: nullableFk("faction_id", factions.id),
	regionId: nullableFk("region_id", regions.id),
	areaId: nullableFk("area_id", areas.id),
	siteId: nullableFk("site_id", sites.id),
	npcId: nullableFk("npc_id", npcs.id),
	destinationId: nullableFk("destination_id", narrativeDestinations.id),

	futureQuestId: nullableFk("future_quest_id", quests.id),

	description: list("description"),
	gmNotes: list("gm_notes"),
	creativePrompts: list("creative_prompts"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const enums = {
	changeSeverity,
	changeTypes,
	changeVisibility,
	changeTimeframe,
	sourcesOfChange,
}
