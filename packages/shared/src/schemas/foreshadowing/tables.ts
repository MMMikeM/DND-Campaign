// foreshadowing/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, manyOf, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { lore } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { discoverySubtlety, narrativeWeight, seedDeliveryMethods } = enums

export const foreshadowing = pgTable(
	"foreshadowing",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		sourceQuestId: cascadeFk("source_quest_id", quests.id),
		sourceQuestStageId: cascadeFk("source_quest_stage_id", questStages.id),
		sourceSiteId: cascadeFk("source_site_id", sites.id),
		sourceNpcId: cascadeFk("source_npc_id", npcs.id),
		sourceLoreId: cascadeFk("source_lore_id", () => lore.id),
		sourceItemId: cascadeFk("source_item_id", () => items.id),

		targetQuestId: cascadeFk("target_quest_id", quests.id),
		targetNpcId: cascadeFk("target_npc_id", npcs.id),
		targetConflictId: cascadeFk("target_conflict_id", conflicts.id),
		targetItemId: cascadeFk("target_item_id", () => items.id),
		targetLoreId: cascadeFk("target_lore_id", () => lore.id),
		targetFactionId: cascadeFk("target_faction_id", factions.id),
		targetConsequenceId: cascadeFk("target_consequence_id", consequences.id),
		targetSiteId: cascadeFk("target_site_id", sites.id),

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
        (case when ${t.targetSiteId} is not null then 1 else 0 end)
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
