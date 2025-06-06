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
import { enums } from "./enums"

export { enums } from "./enums"

const {
	consequenceSources,
	consequenceTimeframe,
	consequenceTypes,
	consequenceVisibility,
	eventTypes,
	impactSeverity,
	narrativePlacements,
	playerImpactFeels,
	rhythmEffects,
} = enums

export const narrativeEvents = pgTable(
	"narrative_events",
	{
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
	},
	(t) => [
		check(
			"chk_event_type_details_exclusive",
			sql`
		CASE ${t.eventType}
			WHEN 'complication' THEN (${t.complication_details} IS NOT NULL AND ${t.escalation_details} IS NULL AND ${t.twist_reveal_details} IS NULL)
			WHEN 'escalation' THEN (${t.complication_details} IS NULL AND ${t.escalation_details} IS NOT NULL AND ${t.twist_reveal_details} IS NULL)
			WHEN 'twist' THEN (${t.complication_details} IS NULL AND ${t.escalation_details} IS NULL AND ${t.twist_reveal_details} IS NOT NULL)
			ELSE TRUE 
		END
		`,
		),
	],
)

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
			"chk_consequence_has_a_trigger_source",
			sql`
			${t.triggerDecisionId} IS NOT NULL OR
			${t.triggerQuestId} IS NOT NULL OR
			${t.triggerConflictId} IS NOT NULL OR
			${t.sourceType} IN ('world_event', 'player_choice', 'time_passage', 'quest_completion_affecting_conflict')
			`,
		),
		check(
			"chk_consequence_has_an_effect_defined",
			sql`
			${t.affectedFactionId} IS NOT NULL OR
			${t.affectedRegionId} IS NOT NULL OR
			${t.affectedAreaId} IS NOT NULL OR
			${t.affectedSiteId} IS NOT NULL OR
			${t.affectedNpcId} IS NOT NULL OR
			${t.affectedDestinationId} IS NOT NULL OR
			${t.affectedConflictId} IS NOT NULL OR
			${t.futureQuestId} IS NOT NULL OR
			${t.consequenceType} IS NOT NULL 
			`,
		),
		check(
			"chk_consequence_conflict_impact_description_if_conflict_affected",
			sql`
			(${t.affectedConflictId} IS NULL) OR (${t.conflictImpactDescription} IS NOT NULL)
			`,
		),
	],
)
