// foreshadowing/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { list, manyOf, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflict/tables"
import { narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../worldbuilding/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { discoverySubtlety, foreshadowedEntityType, narrativeWeight, seedDeliveryMethods } = enums

export const foreshadowing = pgTable(
	"foreshadowing_seeds",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		targetEntityType: oneOf("target_entity_type", foreshadowedEntityType),

		targetQuestId: nullableFk("target_quest_id", quests.id),
		targetNpcId: nullableFk("target_npc_id", npcs.id),
		targetNarrativeEventId: nullableFk("target_narrative_event_id", narrativeEvents.id),
		targetMajorConflictId: nullableFk("target_major_conflict_id", conflicts.id),
		targetItemId: nullableFk("target_item_id", items.id),
		targetNarrativeDestinationId: nullableFk("target_narrative_destination_id", narrativeDestinations.id),
		targetWorldConceptId: nullableFk("target_world_concept_id", worldConcepts.id),
		targetFactionId: nullableFk("target_faction_id", factions.id),
		targetSiteId: nullableFk("target_site_id", sites.id),
		targetAbstractDetail: nullableString("target_abstract_detail"),

		sourceQuestId: nullableFk("source_quest_id", quests.id),
		sourceQuestStageId: nullableFk("source_quest_stage_id", questStages.id),
		sourceSiteId: nullableFk("source_site_id", sites.id),
		sourceNpcId: nullableFk("source_npc_id", npcs.id),

		subtlety: oneOf("subtlety", discoverySubtlety),
		narrativeWeight: oneOf("narrative_weight", narrativeWeight),
		suggestedDeliveryMethods: manyOf("suggested_delivery_methods", seedDeliveryMethods),
	},
	(t) => [
		check(
			"chk_foreshadowing_target_exclusive_and_correct",
			sql`
		CASE ${t.targetEntityType}
			WHEN 'quest' THEN (${t.targetQuestId} IS NOT NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'npc' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NOT NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'narrative_event' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NOT NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'major_conflict' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NOT NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'item' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NOT NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'narrative_destination' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NOT NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'world_concept' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NOT NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'faction' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NOT NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'site' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NOT NULL AND ${t.targetAbstractDetail} IS NULL)
			WHEN 'abstract_theme' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NOT NULL)
			WHEN 'specific_reveal' THEN (${t.targetQuestId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetNarrativeEventId} IS NULL AND ${t.targetMajorConflictId} IS NULL AND ${t.targetItemId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetAbstractDetail} IS NOT NULL)
			ELSE FALSE
		END
		`,
		),
	],
)
