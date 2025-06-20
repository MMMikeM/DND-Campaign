// items/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { worldConcepts } from "../worldbuilding/tables"

const itemTypes = ["weapon", "armor", "tool", "treasure", "document", "key_item", "consumable"] as const
const rarityLevels = ["common", "uncommon", "rare", "very_rare", "legendary", "artifact"] as const
const narrativeRoles = [
	"utility_tool",
	"quest_key",
	"emotional_anchor",
	"thematic_symbol",
	"simple_reward",
	"macguffin",
] as const
const perceivedSimplicityLevels = ["what_it_seems", "deceptively_simple", "obviously_complex"] as const

const itemRelationshipTypes = [
	"part_of_set",
	"key_for",
	"activates",
	"counterpart_to",
	"synergizes_with",
	"opposes",
	"transforms_into",
	"contains",
	"powers",
	"owned_by",
	"created_by",
	"guarded_by",
	"sought_by",
	"connected_to",
	"empowers",
	"weakens",
	"reveals",
	"conceals",
] as const

const targetEntityTypes = [
	"item",
	"npc",
	"faction",
	"site",
	"quest",
	"conflict",
	"narrative_destination",
	"world_concept",
] as const

const historyRoles = [
	"creator",
	"wielder",
	"owner",
	"guardian",
	"thief",
	"trader",
	"destroyer",
	"corrupter",
	"restorer",
	"witness",
	"discoverer",
	"protector",
] as const

export const items = pgTable("items", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	itemType: oneOf("item_type", itemTypes),
	rarity: oneOf("rarity", rarityLevels),

	narrativeRole: oneOf("narrative_role", narrativeRoles),
	perceivedSimplicity: oneOf("perceived_simplicity", perceivedSimplicityLevels),

	significance: string("significance"),
	loreSignificance: string("lore_significance"),
	mechanicalEffects: list("mechanical_effects"),

	creationPeriod: nullableString("creation_period"),
	placeOfOrigin: nullableString("place_of_origin"),
	relatedQuestId: nullableFk("related_quest_id", quests.id),
	embeddingId: nullableFk("embedding_id", embeddings.id),
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

		// Polymorphic relationship - only one of these should be populated
		targetEntityType: oneOf("target_entity_type", targetEntityTypes),
		targetItemId: nullableFk("target_item_id", items.id),
		targetNpcId: nullableFk("target_npc_id", npcs.id),
		targetFactionId: nullableFk("target_faction_id", factions.id),
		targetSiteId: nullableFk("target_site_id", sites.id),
		targetQuestId: nullableFk("target_quest_id", quests.id),
		targetConflictId: nullableFk("target_conflict_id", majorConflicts.id),
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
	eventDescription: string("event_description"),
	timeframe: string("timeframe"),
	keyNpcId: nullableFk("key_npc_id", npcs.id),
	npcRoleInEvent: string("npc_role_in_event"),
	eventLocationSiteId: nullableFk("event_location_site_id", sites.id),
})

export const enums = {
	itemTypes,
	narrativeRoles,
	perceivedSimplicityLevels,
	rarityLevels,
	itemRelationshipTypes,
	targetEntityTypes,
	historyRoles,
}
