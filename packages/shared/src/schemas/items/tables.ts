// items/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
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

// New enums for relationships and history
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

	// Philosophy-aligned narrative fields
	narrativeRole: oneOf("narrative_role", narrativeRoles),
	perceivedSimplicity: oneOf("perceived_simplicity", perceivedSimplicityLevels),

	// Three levels of significance (all justified for significant story items)
	significance: string("significance"), // Executive summary of current importance
	loreSignificance: string("lore_significance"), // Historical/background importance
	mechanicalEffects: list("mechanical_effects"),

	// Origin information (fundamental for significant items)
	creatorName: nullableString("creator_name"), // "Master Smith Aldric", "The Forge of Stars"
	creationPeriod: nullableString("creation_period"), // "First Age", "During King Alaric's Reign"
	placeOfOrigin: nullableString("place_of_origin"), // "Lost City of Eldoria", "The Sunken Temple"

	// Current location and ownership
	currentLocationId: nullableFk("current_location_id", sites.id),
	ownerNpcId: nullableFk("owner_npc_id", npcs.id),
	controllingFactionId: nullableFk("controlling_faction_id", factions.id),

	// Quest relevance
	questId: nullableFk("quest_id", quests.id),
	stageId: nullableFk("stage_id", questStages.id),

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
		relatedItemId: cascadeFk("related_item_id", items.id),
		relationshipType: oneOf("relationship_type", itemRelationshipTypes),

		// Details about the relationship
		relationshipDetails: nullableString("relationship_details"), // How they interact specifically
	},
	(t) => [unique().on(t.sourceItemId, t.relatedItemId, t.relationshipType)],
)

export const itemHistory = pgTable("item_history", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	itemId: cascadeFk("item_id", items.id),
	historicalEvent: string("historical_event"), // What happened
	timeframe: string("timeframe"), // When it occurred
	significance: string("significance"), // Why this event matters to the item's story

	// Location context for the event
	eventLocationId: nullableFk("event_location_id", sites.id),
})

export const itemHistoryParticipants = pgTable(
	"item_history_participants",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		historyEventId: cascadeFk("history_event_id", itemHistory.id),
		npcId: cascadeFk("npc_id", npcs.id),
		role: oneOf("role", historyRoles), // Structured enum for better querying

		// Additional context about their involvement
		involvementDetails: nullableString("involvement_details"),
	},
	(t) => [unique().on(t.historyEventId, t.npcId, t.role)],
)

export const enums = {
	itemTypes,
	narrativeRoles,
	perceivedSimplicityLevels,
	rarityLevels,
	itemRelationshipTypes,
	historyRoles,
}
