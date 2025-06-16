// items/tables.ts
import { integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
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

	questId: nullableFk("quest_id", quests.id),
	questStageId: nullableFk("quest_stage_id", questStages.id),

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

export const itemRelations = pgTable(
	"item_relations",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		sourceItemId: cascadeFk("source_item_id", items.id),

		relationshipType: oneOf("relationship_type", itemRelationshipTypes),
		targetEntityType: oneOf("target_entity_type", targetEntityTypes),

		targetEntityId: integer("target_entity_id"),

		relationshipDetails: nullableString("relationship_details"),
	},
	(t) => [unique().on(t.sourceItemId, t.targetEntityType, t.targetEntityId, t.relationshipType)],
)

export const itemNotableHistory = pgTable("item_notable_history", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	itemId: cascadeFk("item_id", items.id),
	keyNpcId: nullableFk("key_npc_id", npcs.id),
	locationSiteId: nullableFk("location_site_id", sites.id),

	eventDescription: string("event_description"),
	timeframe: string("timeframe"),
	npcRoleInEvent: string("npc_role_in_event"),
})
