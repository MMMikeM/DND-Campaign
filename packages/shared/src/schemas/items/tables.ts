// items/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { lore } from "../lore/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { questStages } from "../quests/stages/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
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

		itemId: cascadeFk("item_id", items.id),

		entityType: oneOf("entity_type", targetEntityTypes),

		relatedItemId: nullableFk("related_item_id", items.id),
		npcId: nullableFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),
		siteId: nullableFk("site_id", sites.id),
		questId: nullableFk("quest_id", quests.id),
		conflictId: nullableFk("conflict_id", conflicts.id),
		narrativeDestinationId: nullableFk("narrative_destination_id", narrativeDestinations.id),
		loreId: nullableFk("lore_id", lore.id),

		relationshipType: oneOf("relationship_type", itemRelationshipTypes),
		relationshipDetails: nullableString("relationship_details"),
	},
	(t) => [
		unique().on(
			t.itemId,
			t.entityType,
			t.relatedItemId,
			t.npcId,
			t.factionId,
			t.siteId,
			t.questId,
			t.conflictId,
			t.narrativeDestinationId,
			t.loreId,
			t.relationshipType,
		),
		check(
			"single_related_entity_exclusive_and_correct",
			sql`
			CASE ${t.entityType}
				WHEN 'item' THEN (${t.relatedItemId} IS NOT NULL AND ${t.npcId} IS NULL AND ${t.factionId} IS NULL AND ${t.siteId} IS NULL AND ${t.questId} IS NULL AND ${t.conflictId} IS NULL AND ${t.narrativeDestinationId} IS NULL AND ${t.loreId} IS NULL)
				WHEN 'npc' THEN (${t.relatedItemId} IS NULL AND ${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL AND ${t.siteId} IS NULL AND ${t.questId} IS NULL AND ${t.conflictId} IS NULL AND ${t.narrativeDestinationId} IS NULL AND ${t.loreId} IS NULL)
				WHEN 'faction' THEN (${t.relatedItemId} IS NULL AND ${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL AND ${t.siteId} IS NULL AND ${t.questId} IS NULL AND ${t.conflictId} IS NULL AND ${t.narrativeDestinationId} IS NULL AND ${t.loreId} IS NULL)
				WHEN 'site' THEN (${t.relatedItemId} IS NULL AND ${t.npcId} IS NULL AND ${t.factionId} IS NULL AND ${t.siteId} IS NOT NULL AND ${t.questId} IS NULL AND ${t.conflictId} IS NULL AND ${t.narrativeDestinationId} IS NULL AND ${t.loreId} IS NULL)
				WHEN 'quest' THEN (${t.relatedItemId} IS NULL AND ${t.npcId} IS NULL AND ${t.factionId} IS NULL AND ${t.siteId} IS NULL AND ${t.questId} IS NOT NULL AND ${t.conflictId} IS NULL AND ${t.narrativeDestinationId} IS NULL AND ${t.loreId} IS NULL)
				WHEN 'conflict' THEN (${t.relatedItemId} IS NULL AND ${t.npcId} IS NULL AND ${t.factionId} IS NULL AND ${t.siteId} IS NULL AND ${t.questId} IS NULL AND ${t.conflictId} IS NOT NULL AND ${t.narrativeDestinationId} IS NULL AND ${t.loreId} IS NULL)
				WHEN 'narrative_destination' THEN (${t.relatedItemId} IS NULL AND ${t.npcId} IS NULL AND ${t.factionId} IS NULL AND ${t.siteId} IS NULL AND ${t.questId} IS NULL AND ${t.conflictId} IS NULL AND ${t.narrativeDestinationId} IS NOT NULL AND ${t.loreId} IS NULL)
				WHEN 'lore' THEN (${t.relatedItemId} IS NULL AND ${t.npcId} IS NULL AND ${t.factionId} IS NULL AND ${t.siteId} IS NULL AND ${t.questId} IS NULL AND ${t.conflictId} IS NULL AND ${t.narrativeDestinationId} IS NULL AND ${t.loreId} IS NOT NULL)
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
	locationSiteId: nullableFk("location_site_id", sites.id),

	eventDescription: string("event_description"),
	timeframe: string("timeframe"),
	npcRoleInEvent: string("npc_role_in_event"),
})
