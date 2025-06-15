import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { loreTypes, loreRelationshipTypes, loreLinkStrengths, targetEntityTypes } = enums

export const lore = pgTable("lore", {
	// --- Core Identity ---
	id: pk(),
	name: string("name").unique(),
	summary: string("summary"), // The one-sentence pitch.
	loreType: oneOf("lore_type", loreTypes),
	tags: list("tags"),

	// --- Layered Revelation (The Core Storytelling Engine) ---
	surfaceImpression: string("surface_impression"), // What it seems to be at a glance.
	livedReality: string("lived_reality"), // How people actually interact with it.
	hiddenTruths: string("hidden_truths"), // The secret origin or true purpose.

	// --- NEW: Actionable & Evocative Details ---
	/** What does this look, sound, and feel like? Key symbols, colors, textures, sounds, smells. */
	aesthetics_and_symbols: list("aesthetics_and_symbols"),

	/** How can it be interacted with? Defines its mechanics, vulnerabilities, rituals, or laws. */
	interactions_and_rules: list("interactions_and_rules"),

	/** How is it linked to factions, NPCs, places, or other lore? */
	connections_to_world: list("connections_to_world"),

	// --- Consolidated Lore Buckets (Revised for Clarity) ---
	/** The core beliefs, values, and key traditions. What do followers believe and do? */
	core_tenets_and_traditions: list("core_tenets_and_traditions"),

	/** Key historical moments, origins, and lasting impact on the world. */
	history_and_legacy: list("history_and_legacy"),

	/** Different viewpoints or propaganda about the concept. Prime source for intrigue. */
	conflicting_narratives: list("conflicting_narratives"),

	// --- Actionable Hooks ---
	modernRelevance: string("modern_relevance"), // Why does this matter to the campaign *right now*?
	questHooks: list("quest_hooks"),

	// --- GM-Facing Tools ---
	creativePrompts: list("creative_prompts"),
	gmNotes: list("gm_notes"),
})

export const loreLinks = pgTable(
	"lore_links",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		loreId: cascadeFk("lore_id", lore.id),

		targetEntityType: oneOf("target_entity_type", targetEntityTypes),
		regionId: nullableFk("region_id", regions.id),
		factionId: nullableFk("faction_id", factions.id),
		npcId: nullableFk("npc_id", npcs.id),
		conflictId: nullableFk("conflict_id", conflicts.id),
		questId: nullableFk("quest_id", quests.id),

		linkRoleOrTypeText: string("link_role_or_type_text"),
		linkStrength: oneOf("link_strength", loreLinkStrengths),
		linkDetailsText: string("link_details_text"),
	},
	(t) => [
		check(
			"chk_lore_link_has_target",
			sql`
			${t.regionId} IS NOT NULL OR
			${t.factionId} IS NOT NULL OR
			${t.npcId} IS NOT NULL OR
			${t.conflictId} IS NOT NULL OR
			${t.questId} IS NOT NULL
		`,
		),
	],
)
