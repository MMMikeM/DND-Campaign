import { pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"

const itemTypes = ["weapon", "armor", "tool", "treasure", "document", "key_item", "consumable"] as const
const rarityLevels = ["common", "uncommon", "rare", "very_rare", "legendary", "artifact"] as const

export const items = pgTable("items", {
	id: pk(),
	name: string("name").unique(),
	itemType: oneOf("item_type", itemTypes),
	rarity: oneOf("rarity", rarityLevels),
	description: list("description"),
	mechanicalEffects: list("mechanical_effects"),
	loreSignificance: string("lore_significance"),

	// Current location and ownership
	currentLocationId: nullableFk("current_location_id", sites.id),
	ownerNpcId: nullableFk("owner_npc_id", npcs.id),
	controllingFactionId: nullableFk("controlling_faction_id", factions.id),

	// Quest relevance
	questId: nullableFk("quest_id", quests.id),
	stageId: nullableFk("stage_id", questStages.id),

	significance: string("significance"),
	creativePrompts: list("creative_prompts"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const itemHistory = pgTable("item_history", {
	id: pk(),
	itemId: cascadeFk("item_id", items.id),
	event: string("event"),
	timeframe: string("timeframe"),
	significance: string("significance"),
})

export const itemHistoryParticipants = pgTable("item_history_participants", {
	id: pk(),
	historyId: cascadeFk("history_id", itemHistory.id),
	npcId: cascadeFk("npc_id", npcs.id),
	role: string("role"), // "previous_owner", "witness", "thief", "trader", etc.
})

export const enums = {
	itemTypes,
	rarityLevels,
}
