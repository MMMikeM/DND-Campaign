// items/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { majorConflicts } from "../conflict/tables"
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

const relatedEntityTypes = [
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

	creationPeriod: nullableString("creation_period"),
	placeOfOrigin: nullableString("place_of_origin"),
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
		relatedEntityType: oneOf("related_entity_type", relatedEntityTypes),
		relatedItemId: nullableFk("related_item_id", items.id),
		relatedNpcId: nullableFk("related_npc_id", npcs.id),
		relatedFactionId: nullableFk("related_faction_id", factions.id),
		relatedSiteId: nullableFk("related_site_id", sites.id),
		relatedQuestId: nullableFk("related_quest_id", quests.id),
		relatedConflictId: nullableFk("related_conflict_id", majorConflicts.id),
		relatedNarrativeDestinationId: nullableFk("related_narrative_destination_id", narrativeDestinations.id),
		relatedWorldConceptId: nullableFk("related_world_concept_id", worldConcepts.id),

		relationshipType: oneOf("relationship_type", itemRelationshipTypes),
		relationshipDetails: nullableString("relationship_details"),
	},
	(t) => [
		unique().on(
			t.sourceItemId,
			t.relatedEntityType,
			t.relatedItemId,
			t.relatedNpcId,
			t.relatedFactionId,
			t.relatedSiteId,
			t.relatedQuestId,
			t.relatedConflictId,
			t.relatedNarrativeDestinationId,
			t.relatedWorldConceptId,
			t.relationshipType,
		),
		check(
			"single_related_entity",
			sql`
			(${t.relatedEntityType} = 'item' AND ${t.relatedItemId} IS NOT NULL AND ${t.relatedNpcId} IS NULL AND ${t.relatedFactionId} IS NULL AND ${t.relatedSiteId} IS NULL AND ${t.relatedQuestId} IS NULL AND ${t.relatedConflictId} IS NULL AND ${t.relatedNarrativeDestinationId} IS NULL AND ${t.relatedWorldConceptId} IS NULL) OR
			(${t.relatedEntityType} = 'npc' AND ${t.relatedItemId} IS NULL AND ${t.relatedNpcId} IS NOT NULL AND ${t.relatedFactionId} IS NULL AND ${t.relatedSiteId} IS NULL AND ${t.relatedQuestId} IS NULL AND ${t.relatedConflictId} IS NULL AND ${t.relatedNarrativeDestinationId} IS NULL AND ${t.relatedWorldConceptId} IS NULL) OR
			(${t.relatedEntityType} = 'faction' AND ${t.relatedItemId} IS NULL AND ${t.relatedNpcId} IS NULL AND ${t.relatedFactionId} IS NOT NULL AND ${t.relatedSiteId} IS NULL AND ${t.relatedQuestId} IS NULL AND ${t.relatedConflictId} IS NULL AND ${t.relatedNarrativeDestinationId} IS NULL AND ${t.relatedWorldConceptId} IS NULL) OR
			(${t.relatedEntityType} = 'site' AND ${t.relatedItemId} IS NULL AND ${t.relatedNpcId} IS NULL AND ${t.relatedFactionId} IS NULL AND ${t.relatedSiteId} IS NOT NULL AND ${t.relatedQuestId} IS NULL AND ${t.relatedConflictId} IS NULL AND ${t.relatedNarrativeDestinationId} IS NULL AND ${t.relatedWorldConceptId} IS NULL) OR
			(${t.relatedEntityType} = 'quest' AND ${t.relatedItemId} IS NULL AND ${t.relatedNpcId} IS NULL AND ${t.relatedFactionId} IS NULL AND ${t.relatedSiteId} IS NULL AND ${t.relatedQuestId} IS NOT NULL AND ${t.relatedConflictId} IS NULL AND ${t.relatedNarrativeDestinationId} IS NULL AND ${t.relatedWorldConceptId} IS NULL) OR
			(${t.relatedEntityType} = 'conflict' AND ${t.relatedItemId} IS NULL AND ${t.relatedNpcId} IS NULL AND ${t.relatedFactionId} IS NULL AND ${t.relatedSiteId} IS NULL AND ${t.relatedQuestId} IS NULL AND ${t.relatedConflictId} IS NOT NULL AND ${t.relatedNarrativeDestinationId} IS NULL AND ${t.relatedWorldConceptId} IS NULL) OR
			(${t.relatedEntityType} = 'narrative_destination' AND ${t.relatedItemId} IS NULL AND ${t.relatedNpcId} IS NULL AND ${t.relatedFactionId} IS NULL AND ${t.relatedSiteId} IS NULL AND ${t.relatedQuestId} IS NULL AND ${t.relatedConflictId} IS NULL AND ${t.relatedNarrativeDestinationId} IS NOT NULL AND ${t.relatedWorldConceptId} IS NULL) OR
			(${t.relatedEntityType} = 'world_concept' AND ${t.relatedItemId} IS NULL AND ${t.relatedNpcId} IS NULL AND ${t.relatedFactionId} IS NULL AND ${t.relatedSiteId} IS NULL AND ${t.relatedQuestId} IS NULL AND ${t.relatedConflictId} IS NULL AND ${t.relatedNarrativeDestinationId} IS NULL AND ${t.relatedWorldConceptId} IS NOT NULL)
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
	relatedEntityTypes,
	historyRoles,
}
