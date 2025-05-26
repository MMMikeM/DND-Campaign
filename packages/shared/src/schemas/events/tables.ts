// events/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests, stageDecisions } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"

const impactSeverity = ["minor", "moderate", "major"] as const
const eventTypes = ["complication", "escalation", "twist"] as const
const narrativePlacements = ["early", "middle", "climax", "denouement"] as const
const rhythmEffects = [
	"spike_tension",
	"introduce_mystery",
	"provide_breather_twist",
	"force_reassessment_of_plans",
	"heighten_stakes",
] as const

const consequenceTypes = [
	// Character & Relationship
	"character_reaction",
	"npc_status_change",
	"relationship_change",

	// Faction & Political
	"faction_power_shift",
	"political_shift",
	"reputation_change",

	// World & Environment
	"region_status_change",
	"environmental_change",
	"demographic_shift",

	// Resources & Items
	"resource_availability_change",
	"item_acquisition",

	// Quest & Narrative
	"quest_availability_change",
	"story_progression",
] as const

const consequenceVisibility = ["obvious", "subtle", "hidden"] as const
const consequenceTimeframe = ["immediate", "next_session", "specific_trigger", "later_in_campaign"] as const
const consequenceSources = [
	"decision",
	"quest_completion",
	"world_event",
	"player_choice",
	"time_passage",
	"quest_completion_affecting_conflict",
] as const
const playerImpactFeels = [
	"empowering_reward",
	"earned_progress",
	"challenging_setback",
	"neutral_world_evolution",
	"unexpected_opportunity",
	"just_consequence",
] as const

export const narrativeEvents = pgTable("narrative_events", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	eventType: oneOf("event_type", eventTypes),

	intendedRhythmEffect: oneOf("intended_rhythm_effect", rhythmEffects),

	questStageId: nullableFk("quest_stage_id", questStages.id),
	triggeringDecisionId: nullableFk("triggering_decision_id", stageDecisions.id),
	relatedQuestId: nullableFk("related_quest_id", quests.id),

	narrativePlacement: oneOf("narrative_placement", narrativePlacements),
	impactSeverity: oneOf("impact_severity", impactSeverity),

	complication_details: nullableString("complication_details"),
	escalation_details: nullableString("escalation_details"),
	twist_reveal_details: nullableString("twist_reveal_details"),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const consequences = pgTable(
	"consequences",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		name: string("name").unique(),

		consequenceType: oneOf("consequence_type", consequenceTypes),
		severity: oneOf("severity", impactSeverity),
		visibility: oneOf("visibility", consequenceVisibility),
		timeframe: oneOf("timeframe", consequenceTimeframe),
		sourceType: oneOf("source_type", consequenceSources),

		playerImpactFeel: oneOf("player_impact_feel", playerImpactFeels),

		// What triggered this consequence
		triggerDecisionId: nullableFk("trigger_decision_id", stageDecisions.id),
		triggerQuestId: nullableFk("trigger_quest_id", quests.id),
		triggerConflictId: nullableFk("trigger_conflict_id", majorConflicts.id),

		// What's affected by this consequence
		affectedFactionId: nullableFk("affected_faction_id", factions.id),
		affectedRegionId: nullableFk("affected_region_id", regions.id),
		affectedAreaId: nullableFk("affected_area_id", areas.id),
		affectedSiteId: nullableFk("affected_site_id", sites.id),
		affectedNpcId: nullableFk("affected_npc_id", npcs.id),
		affectedDestinationId: nullableFk("affected_destination_id", narrativeDestinations.id),

		// Conflict progression fields
		affectedConflictId: nullableFk("affected_conflict_id", majorConflicts.id),
		conflictImpactDescription: nullableString("conflict_impact_description"),

		// Future implications
		futureQuestId: nullableFk("future_quest_id", quests.id),

		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [
		check(
			"npc_or_faction",
			sql`(${t.affectedNpcId} IS NOT NULL AND ${t.affectedFactionId} IS NULL) OR (${t.affectedNpcId} IS NULL AND ${t.affectedFactionId} IS NOT NULL)`,
		),
	],
)

export const enums = {
	eventTypes,
	impactSeverity,
	narrativePlacements,
	rhythmEffects,
	consequenceTypes,
	consequenceVisibility,
	consequenceTimeframe,
	consequenceSources,
	playerImpactFeels,
}
