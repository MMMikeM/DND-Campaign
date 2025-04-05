// world/tables.ts
import { pgTable, timestamp, boolean } from "drizzle-orm/pg-core"
import { list, pk, string, oneOf, nullableFk } from "../../db/utils"
import { quests } from "../quests/tables"
import { stageDecisions } from "../quests/tables"
import { factions } from "../factions/tables"
import { regions } from "../regions/tables"
import { locations } from "../regions/tables"
import { npcs } from "../npc/tables"
import { majorConflicts } from "../conflict/tables"

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

	// Basic information
	title: string("title").unique(),
	description: list("description"),

	// Characteristics
	changeType: oneOf("change_type", changeTypes),
	severity: oneOf("severity", changeSeverity).default("moderate"),
	visibility: oneOf("visibility", changeVisibility).default("obvious"),
	timeframe: oneOf("timeframe", changeTimeframe).default("immediate"),
	sourceType: oneOf("source_type", sourcesOfChange),

	// What triggered this change
	questId: nullableFk("quest_id", quests.id),
	decisionId: nullableFk("decision_id", stageDecisions.id),
	conflictId: nullableFk("conflict_id", majorConflicts.id),

	// Affected entities
	factionId: nullableFk("faction_id", factions.id),
	regionId: nullableFk("region_id", regions.id),
	locationId: nullableFk("location_id", locations.id),
	npcId: nullableFk("npc_id", npcs.id),

	// Follow-up tracking
	recordedDate: timestamp("recorded_date").defaultNow(),
	futureQuestId: nullableFk("future_quest_id", quests.id),
	isResolved: boolean("is_resolved").default(false),

	// GM planning tools
	creativePrompts: list("creative_prompts"), // Ideas for showing this change
	gmNotes: list("gm_notes"),
})
