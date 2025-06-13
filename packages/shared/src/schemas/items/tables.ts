// items/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflict/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../worldbuilding/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { itemRelationshipTypes, itemTypes, narrativeRoles, perceivedSimplicityLevels, rarityLevels, targetEntityTypes } =
	enums

export const items = pgTable("items", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	relatedQuestId: nullableFk("related_quest_id", quests.id),

	itemType: oneOf("item_type", itemTypes),
	rarity: oneOf("rarity", rarityLevels),
	narrativeRole: oneOf("narrative_role", narrativeRoles),
	perceivedSimplicity: oneOf("perceived_simplicity", perceivedSimplicityLevels),

	significance: string("significance"),
	loreSignificance: string("lore_significance"),

	creationPeriod: nullableString("creation_period"),
	placeOfOrigin: nullableString("place_of_origin"),

	mechanicalEffects: list("mechanical_effects"),
})

export const itemRelationships = pgTable(
	"item_relationships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		sourceItemId: cascadeFk("source_item_id", items.id),

		targetEntityType: oneOf("target_entity_type", targetEntityTypes),

		targetItemId: nullableFk("target_item_id", items.id),
		targetNpcId: nullableFk("target_npc_id", npcs.id),
		targetFactionId: nullableFk("target_faction_id", factions.id),
		targetSiteId: nullableFk("target_site_id", sites.id),
		targetQuestId: nullableFk("target_quest_id", quests.id),
		targetConflictId: nullableFk("target_conflict_id", conflicts.id),
		targetNarrativeDestinationId: nullableFk("target_narrative_destination_id", narrativeDestinations.id),
		targetWorldConceptId: nullableFk("target_world_concept_id", worldConcepts.id),

		relationshipType: oneOf("relationship_type", itemRelationshipTypes),
		relationshipDetails: nullableString("relationship_details"),
	},
	(t) => [
		unique().on(
			t.sourceItemId,
			t.targetEntityType,
			t.targetItemId,
			t.targetNpcId,
			t.targetFactionId,
			t.targetSiteId,
			t.targetQuestId,
			t.targetConflictId,
			t.targetNarrativeDestinationId,
			t.targetWorldConceptId,
			t.relationshipType,
		),
		check(
			"single_related_entity_exclusive_and_correct",
			sql`
			CASE ${t.targetEntityType}
				WHEN 'item' THEN (${t.targetItemId} IS NOT NULL AND ${t.targetNpcId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetQuestId} IS NULL AND ${t.targetConflictId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL)
				WHEN 'npc' THEN (${t.targetItemId} IS NULL AND ${t.targetNpcId} IS NOT NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetQuestId} IS NULL AND ${t.targetConflictId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL)
				WHEN 'faction' THEN (${t.targetItemId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetFactionId} IS NOT NULL AND ${t.targetSiteId} IS NULL AND ${t.targetQuestId} IS NULL AND ${t.targetConflictId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL)
				WHEN 'site' THEN (${t.targetItemId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NOT NULL AND ${t.targetQuestId} IS NULL AND ${t.targetConflictId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL)
				WHEN 'quest' THEN (${t.targetItemId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetQuestId} IS NOT NULL AND ${t.targetConflictId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL)
				WHEN 'conflict' THEN (${t.targetItemId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetQuestId} IS NULL AND ${t.targetConflictId} IS NOT NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NULL)
				WHEN 'narrative_destination' THEN (${t.targetItemId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetQuestId} IS NULL AND ${t.targetConflictId} IS NULL AND ${t.targetNarrativeDestinationId} IS NOT NULL AND ${t.targetWorldConceptId} IS NULL)
				WHEN 'world_concept' THEN (${t.targetItemId} IS NULL AND ${t.targetNpcId} IS NULL AND ${t.targetFactionId} IS NULL AND ${t.targetSiteId} IS NULL AND ${t.targetQuestId} IS NULL AND ${t.targetConflictId} IS NULL AND ${t.targetNarrativeDestinationId} IS NULL AND ${t.targetWorldConceptId} IS NOT NULL)
				ELSE FALSE
			END
			`,
		),
	],
)

export const itemNotableHistory = pgTable("item_notable_history", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	itemId: cascadeFk("item_id", items.id),
	keyNpcId: nullableFk("key_npc_id", npcs.id),
	eventLocationSiteId: nullableFk("event_location_site_id", sites.id),

	eventDescription: string("event_description"),
	timeframe: string("timeframe"),
	npcRoleInEvent: string("npc_role_in_event"),
})
