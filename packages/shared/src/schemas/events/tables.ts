// events/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, nullableOneOf, nullableString, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflict/tables"
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
	consequenceTriggerTypes,
	consequenceAffectedEntityTypes,
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

		questStageId: nullableFk("quest_stage_id", questStages.id),
		triggeringDecisionId: nullableFk("triggering_decision_id", stageDecisions.id),
		relatedQuestId: nullableFk("related_quest_id", quests.id),

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

		triggerEntityType: nullableOneOf("trigger_entity_type", consequenceTriggerTypes),
		triggerDecisionId: nullableFk("trigger_decision_id", stageDecisions.id),
		triggerQuestId: nullableFk("trigger_quest_id", quests.id),
		triggerConflictId: nullableFk("trigger_conflict_id", conflicts.id),

		affectedEntityType: nullableOneOf("affected_entity_type", consequenceAffectedEntityTypes),
		affectedFactionId: nullableFk("affected_faction_id", factions.id),
		affectedRegionId: nullableFk("affected_region_id", regions.id),
		affectedAreaId: nullableFk("affected_area_id", areas.id),
		affectedSiteId: nullableFk("affected_site_id", sites.id),
		affectedNpcId: nullableFk("affected_npc_id", npcs.id),
		affectedDestinationId: nullableFk("affected_destination_id", narrativeDestinations.id),
		affectedConflictId: nullableFk("affected_conflict_id", conflicts.id),
		futureQuestId: nullableFk("future_quest_id", quests.id),

		conflictImpactDescription: nullableString("conflict_impact_description"),
	},
	(t) => [
		check(
			"chk_consequence_trigger_exclusive",
			sql`
			CASE ${t.triggerEntityType}
				WHEN 'decision' THEN (${t.triggerDecisionId} IS NOT NULL AND ${t.triggerQuestId} IS NULL AND ${t.triggerConflictId} IS NULL)
				WHEN 'quest' THEN (${t.triggerDecisionId} IS NULL AND ${t.triggerQuestId} IS NOT NULL AND ${t.triggerConflictId} IS NULL)
				WHEN 'conflict' THEN (${t.triggerDecisionId} IS NULL AND ${t.triggerQuestId} IS NULL AND ${t.triggerConflictId} IS NOT NULL)
				ELSE (${t.triggerDecisionId} IS NULL AND ${t.triggerQuestId} IS NULL AND ${t.triggerConflictId} IS NULL)
			END
			`,
		),
		check(
			"chk_consequence_affected_exclusive",
			sql`
			CASE ${t.affectedEntityType}
				WHEN 'faction' THEN (${t.affectedFactionId} IS NOT NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NULL)
				WHEN 'region' THEN (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NOT NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NULL)
				WHEN 'area' THEN (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NOT NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NULL)
				WHEN 'site' THEN (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NOT NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NULL)
				WHEN 'npc' THEN (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NOT NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NULL)
				WHEN 'narrative_destination' THEN (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NOT NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NULL)
				WHEN 'conflict' THEN (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NOT NULL AND ${t.futureQuestId} IS NULL)
				WHEN 'quest' THEN (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NOT NULL)
				ELSE (${t.affectedFactionId} IS NULL AND ${t.affectedRegionId} IS NULL AND ${t.affectedAreaId} IS NULL AND ${t.affectedSiteId} IS NULL AND ${t.affectedNpcId} IS NULL AND ${t.affectedDestinationId} IS NULL AND ${t.affectedConflictId} IS NULL AND ${t.futureQuestId} IS NULL)
			END
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
