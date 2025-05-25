// events/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { impactSeverity } from "../common"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests, stageDecisions } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"

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
const eventTypes = ["complication", "escalation", "twist"] as const
const narrativePlacements = ["early", "middle", "climax", "denouement"] as const

export const narrativeEvents = pgTable("narrative_events", {
	id: pk(),
	name: string("name").unique(),
	eventType: oneOf("event_type", eventTypes),

	// What this event affects
	questStageId: nullableFk("quest_stage_id", questStages.id), // Where it happens
	triggeringDecisionId: nullableFk("triggering_decision_id", stageDecisions.id), // If triggered by a choice
	relatedQuestId: nullableFk("related_quest_id", quests.id), // If it impacts the whole quest

	// Common fields
	description: list("description"),
	narrativePlacement: oneOf("narrative_placement", narrativePlacements),
	impactSeverity: oneOf("impact_severity", impactSeverity),

	// Type-specific details (used based on eventType)
	complication_details: string("complication_details"), // e.g., "Requires DC 15 Survival check"
	escalation_details: string("escalation_details"), // e.g., "Enemy numbers double," "Time limit halved"
	twist_reveal_details: string("twist_reveal_details"), // e.g., "NPC reveals true allegiance"

	// GM guidance
	creativePrompts: list("creative_prompts"),
	gmNotes: list("gm_notes"), // How to run it effectively
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const worldStateChanges = pgTable("world_state_changes", {
	id: pk(),

	name: string("name").unique(),

	changeType: oneOf("change_type", changeTypes),
	severity: oneOf("severity", impactSeverity).default("moderate"),
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
	changeSeverity: impactSeverity,
	changeTypes,
	changeVisibility,
	changeTimeframe,
	sourcesOfChange,
	eventTypes,
	narrativePlacements,
	impactSeverities: impactSeverity,
}
