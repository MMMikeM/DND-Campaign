// items/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { npcs } from "../npc/tables"
import { sites } from "../regions/tables"

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
		relatedItemId: cascadeFk("related_item_id", items.id),
		relationshipType: oneOf("relationship_type", itemRelationshipTypes),

		relationshipDetails: nullableString("relationship_details"),
	},
	(t) => [unique().on(t.sourceItemId, t.relatedItemId, t.relationshipType)],
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
	historyRoles,
}
