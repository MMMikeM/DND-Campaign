// foreshadowing/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { list, manyOf, nullableFk, oneOf, pk, slug, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { lore } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { discoverySubtlety, narrativeWeight, seedDeliveryMethods } from "./enums"

export const foreshadowing = pgTable(
	"foreshadowing",
	{
		id: pk(),
		name: string("name").unique(),
		slug: slug(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		sourceQuestId: nullableFk("source_quest_id", quests.id),
		sourceQuestStageId: nullableFk("source_quest_stage_id", questStages.id),
		sourceSiteId: nullableFk("source_site_id", sites.id),
		sourceNpcId: nullableFk("source_npc_id", npcs.id),
		sourceLoreId: nullableFk("source_lore_id", () => lore.id),
		sourceItemId: nullableFk("source_item_id", () => items.id),

		targetQuestId: nullableFk("target_quest_id", quests.id),
		targetNpcId: nullableFk("target_npc_id", npcs.id),
		targetConflictId: nullableFk("target_conflict_id", conflicts.id),
		targetItemId: nullableFk("target_item_id", () => items.id),
		targetLoreId: nullableFk("target_lore_id", () => lore.id),
		targetFactionId: nullableFk("target_faction_id", factions.id),
		targetConsequenceId: nullableFk("target_consequence_id", consequences.id),
		targetSiteId: nullableFk("target_site_id", sites.id),
		targetRegionId: nullableFk("target_region_id", regions.id),
		targetAreaId: nullableFk("target_area_id", () => areas.id),

		subtlety: oneOf("subtlety", discoverySubtlety),
		narrativeWeight: oneOf("narrative_weight", narrativeWeight),
		suggestedDeliveryMethods: manyOf("suggested_delivery_methods", seedDeliveryMethods),
	},
	(t) => [
		check(
			"single_target_fk_check",
			sql`(
        (case when ${t.targetQuestId} is not null then 1 else 0 end) +
        (case when ${t.targetConsequenceId} is not null then 1 else 0 end) +
        (case when ${t.targetNpcId} is not null then 1 else 0 end) +
        (case when ${t.targetConflictId} is not null then 1 else 0 end) +
        (case when ${t.targetItemId} is not null then 1 else 0 end) +
        (case when ${t.targetLoreId} is not null then 1 else 0 end) +
        (case when ${t.targetFactionId} is not null then 1 else 0 end) +
        (case when ${t.targetSiteId} is not null then 1 else 0 end) +
        (case when ${t.targetRegionId} is not null then 1 else 0 end) +
        (case when ${t.targetAreaId} is not null then 1 else 0 end)
      ) = 1`,
		),
		check(
			"single_source_fk_check",
			sql`(
        (case when ${t.sourceQuestId} is not null then 1 else 0 end) +
        (case when ${t.sourceQuestStageId} is not null then 1 else 0 end) +
        (case when ${t.sourceSiteId} is not null then 1 else 0 end) +
        (case when ${t.sourceNpcId} is not null then 1 else 0 end) +
        (case when ${t.sourceLoreId} is not null then 1 else 0 end) +
        (case when ${t.sourceItemId} is not null then 1 else 0 end)
      ) = 1`,
		),
	],
)
