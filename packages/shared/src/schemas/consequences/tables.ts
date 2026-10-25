// consequences/tables.ts

import { sql } from "drizzle-orm"
import { type AnyPgColumn, check, pgTable } from "drizzle-orm/pg-core"
import { arcFk, list, nullableString, oneOf, pk, slug, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStageDecisions } from "../stages/tables"
import {
	consequenceSources,
	consequenceTimeframe,
	consequenceTypes,
	consequenceVisibility,
	impactSeverity,
	playerImpactFeels,
} from "./enums"

export const consequences = pgTable(
	"consequences",
	{
		id: pk(),
		name: string("name").unique(),
		slug: slug(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		consequenceType: oneOf("consequence_type", consequenceTypes),
		severity: oneOf("severity", impactSeverity),
		visibility: oneOf("visibility", consequenceVisibility),
		timeframe: oneOf("timeframe", consequenceTimeframe),
		playerImpactFeel: oneOf("player_impact_feel", playerImpactFeels),
		sourceType: oneOf("source_type", consequenceSources),

		complicationDetails: nullableString("complication_details"),
		escalationDetails: nullableString("escalation_details"),
		twistRevealDetails: nullableString("twist_reveal_details"),

		triggerQuestId: arcFk("trigger_quest_id", () => quests.id),
		triggerQuestStageDecisionId: arcFk("trigger_quest_stage_decision_id", () => questStageDecisions.id),

		affectedFactionId: arcFk("affected_faction_id", () => factions.id),
		affectedRegionId: arcFk("affected_region_id", () => regions.id),
		affectedAreaId: arcFk("affected_area_id", () => areas.id),
		affectedSiteId: arcFk("affected_site_id", () => sites.id),
		affectedNpcId: arcFk("affected_npc_id", () => npcs.id),
		affectedConsequenceId: arcFk("affected_consequence_id", (): AnyPgColumn => consequences.id),
		affectedConflictId: arcFk("affected_conflict_id", () => conflicts.id),
		affectedQuestId: arcFk("affected_quest_id", () => quests.id),

		conflictImpactDescription: nullableString("conflict_impact_description"),
	},
	(t) => [
		check(
			"chk_trigger_matches_source",
			sql`CASE
        WHEN ${t.sourceType} = 'decision'
          THEN ${t.triggerQuestStageDecisionId} IS NOT NULL AND ${t.triggerQuestId} IS NULL
        WHEN ${t.sourceType} IN ('quest_completion', 'quest_completion_affecting_conflict')
          THEN ${t.triggerQuestId} IS NOT NULL AND ${t.triggerQuestStageDecisionId} IS NULL
        WHEN ${t.sourceType} = 'player_choice'
          THEN ${t.triggerQuestId} IS NULL
        WHEN ${t.sourceType} IN ('world_event', 'time_passage')
          THEN ${t.triggerQuestId} IS NULL AND ${t.triggerQuestStageDecisionId} IS NULL
        ELSE FALSE
      END`,
		),
		check(
			"chk_single_affected_entity",
			sql`(
        (CASE WHEN ${t.affectedFactionId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedRegionId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedAreaId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedSiteId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedNpcId} IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ${t.affectedConsequenceId} IS NOT NULL THEN 1 ELSE 0 END) +
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
