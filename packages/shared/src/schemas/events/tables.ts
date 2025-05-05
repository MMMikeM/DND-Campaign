import { pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { questStages, quests, stageDecisions } from "../quests/tables"

// Enums from changes.md
const eventTypes = ["complication", "escalation", "twist"] as const
const narrativePlacements = ["early", "middle", "climax", "denouement"] as const
const impactSeverities = ["minor", "moderate", "major"] as const

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
	impactSeverity: oneOf("impact_severity", impactSeverities),

	// Type-specific details (used based on eventType)
	complication_details: string("complication_details"), // e.g., "Requires DC 15 Survival check"
	escalation_details: string("escalation_details"), // e.g., "Enemy numbers double," "Time limit halved"
	twist_reveal_details: string("twist_reveal_details"), // e.g., "NPC reveals true allegiance"

	// GM guidance
	creativePrompts: list("creative_prompts"),
	gmNotes: list("gm_notes"), // How to run it effectively
})

export const enums = {
	eventTypes,
	narrativePlacements,
	impactSeverities,
}
