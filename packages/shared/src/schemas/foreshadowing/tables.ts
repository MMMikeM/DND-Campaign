// foreshadowing/tables.ts

import { sql } from "drizzle-orm"
import { check, integer, pgTable } from "drizzle-orm/pg-core"
import { list, manyOf, oneOf, pk, string } from "../../db/utils"
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
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		targetQuestId: integer("target_quest_id"),
		targetNpcId: integer("target_npc_id"),
		targetNarrativeEventId: integer("target_narrative_event_id"),
		targetConflictId: integer("target_conflict_id"),
		targetItemId: integer("target_item_id"),
		targetNarrativeDestinationId: integer("target_narrative_destination_id"),
		targetLoreId: integer("target_lore_id"),
		targetFactionId: integer("target_faction_id"),
		targetSiteId: integer("target_site_id"),

		sourceQuestId: integer("source_quest_id"),
		sourceQuestStageId: integer("source_quest_stage_id"),
		sourceSiteId: integer("source_site_id"),
		sourceNpcId: integer("source_npc_id"),
		sourceItemDescriptionId: integer("source_item_description_id"),
		sourceLoreId: integer("source_lore_id"),

		subtlety: oneOf("subtlety", discoverySubtlety),
		narrativeWeight: oneOf("narrative_weight", narrativeWeight),
		suggestedDeliveryMethods: manyOf("suggested_delivery_methods", seedDeliveryMethods),
	},
	(t) => [
		check(
			"single_target_fk_check",
			sql`(
        (case when ${t.targetQuestId} is not null then 1 else 0 end) +
        (case when ${t.targetNpcId} is not null then 1 else 0 end) +
        (case when ${t.targetNarrativeEventId} is not null then 1 else 0 end) +
        (case when ${t.targetConflictId} is not null then 1 else 0 end) +
        (case when ${t.targetItemId} is not null then 1 else 0 end) +
        (case when ${t.targetNarrativeDestinationId} is not null then 1 else 0 end) +
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
        (case when ${t.sourceItemDescriptionId} is not null then 1 else 0 end) +
        (case when ${t.sourceLoreId} is not null then 1 else 0 end)
      ) = 1`,
		),
	],
)
