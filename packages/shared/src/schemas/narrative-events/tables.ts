// narrative-events/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStageDecisions, questStages } from "../stages/tables"
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
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		eventType: oneOf("event_type", eventTypes),
		intendedRhythmEffect: oneOf("intended_rhythm_effect", rhythmEffects),
		narrativePlacement: oneOf("narrative_placement", narrativePlacements),
		impactSeverity: oneOf("impact_severity", impactSeverity),

		questStageId: nullableFk("quest_stage_id", () => questStages.id),
		triggeringStageDecisionId: nullableFk("triggering_stage_decision_id", () => questStageDecisions.id),
		relatedQuestId: nullableFk("related_quest_id", () => quests.id),

		complication_details: nullableString("complication_details"),
		escalation_details: nullableString("escalation_details"),
		twist_reveal_details: nullableString("twist_reveal_details"),
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
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		consequenceType: oneOf("consequence_type", consequenceTypes),
		severity: oneOf("severity", impactSeverity),
		visibility: oneOf("visibility", consequenceVisibility),
		timeframe: oneOf("timeframe", consequenceTimeframe),
		playerImpactFeel: oneOf("player_impact_feel", playerImpactFeels),
		sourceType: oneOf("source_type", consequenceSources),

		// Trigger Entity Foreign Keys
		triggerQuestId: nullableFk("trigger_quest_id", () => quests.id),
		triggerConflictId: nullableFk("trigger_conflict_id", () => conflicts.id),
		triggerQuestStageDecisionId: nullableFk("trigger_quest_stage_decision_id", () => questStageDecisions.id),

		// Affected Entity Foreign Keys
		affectedFactionId: nullableFk("affected_faction_id", () => factions.id),
		affectedRegionId: nullableFk("affected_region_id", () => regions.id),
		affectedAreaId: nullableFk("affected_area_id", () => areas.id),
		affectedSiteId: nullableFk("affected_site_id", () => sites.id),
		affectedNpcId: nullableFk("affected_npc_id", () => npcs.id),
		affectedNarrativeDestinationId: nullableFk("affected_narrative_destination_id", () => narrativeDestinations.id),
		affectedConflictId: nullableFk("affected_conflict_id", () => conflicts.id),
		affectedQuestId: nullableFk("affected_quest_id", () => quests.id),

		conflictImpactDescription: nullableString("conflict_impact_description"),
	},
	(t) => [
		check(
			"chk_single_trigger",
			sql`(
        (CASE WHEN ${t.triggerQuestId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.triggerConflictId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.triggerQuestStageDecisionId} IS NOT NULL THEN 1 ELSE 0 END)
      ) <= 1`,
		),
		check(
			"chk_single_affected_entity",
			sql`(
        (CASE WHEN ${t.affectedFactionId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedRegionId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedAreaId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedSiteId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedNpcId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedNarrativeDestinationId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedConflictId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedQuestId} IS NOT NULL THEN 1 ELSE 0 END)
      ) = 1`,
		),
		check(
			"chk_conflict_impact_description_required",
			sql`(${t.affectedConflictId} IS NULL) OR (${t.conflictImpactDescription} IS NOT NULL)`,
		),
	],
)
