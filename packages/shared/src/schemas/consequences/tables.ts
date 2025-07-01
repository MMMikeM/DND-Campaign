// consequences/tables.ts

import { sql } from "drizzle-orm"
import { type AnyPgColumn, check, pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStageDecisions } from "../stages/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const {
	consequenceSources,
	consequenceTimeframe,
	consequenceTypes,
	consequenceVisibility,
	impactSeverity,
	playerImpactFeels,
} = enums

export const consequences = pgTable(
	"consequences",
	{
		id: pk(),
		name: string("name").unique(),
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

		triggerQuestId: nullableFk("trigger_quest_id", () => quests.id),
		triggerQuestStageDecisionId: nullableFk("trigger_quest_stage_decision_id", () => questStageDecisions.id),

		affectedFactionId: nullableFk("affected_faction_id", () => factions.id),
		affectedRegionId: nullableFk("affected_region_id", () => regions.id),
		affectedAreaId: nullableFk("affected_area_id", () => areas.id),
		affectedSiteId: nullableFk("affected_site_id", () => sites.id),
		affectedNpcId: nullableFk("affected_npc_id", () => npcs.id),
		affectedConsequenceId: nullableFk("affected_consequence_id", (): AnyPgColumn => consequences.id),
		affectedConflictId: nullableFk("affected_conflict_id", () => conflicts.id),
		affectedQuestId: nullableFk("affected_quest_id", () => quests.id),

		conflictImpactDescription: nullableString("conflict_impact_description"),
	},
	(t) => [
		check(
			"chk_single_trigger",
			sql`(
        (CASE WHEN ${t.triggerQuestId} IS NOT NULL THEN 1 ELSE 0 END) +
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
