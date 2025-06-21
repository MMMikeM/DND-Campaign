import { integer, pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, oneOf, pk, string } from "../../db/utils"
import { enums } from "./enums"

export { enums } from "./enums"

const { loreTypes, linkStrengths, targetEntityTypes } = enums

export const lore = pgTable("lore", {
	id: pk(),
	name: string("name").unique(),
	summary: string("summary"),
	loreType: oneOf("lore_type", loreTypes),
	tags: list("tags"),

	surfaceImpression: string("surface_impression"),
	livedReality: string("lived_reality"),
	hiddenTruths: string("hidden_truths"),
	modernRelevance: string("modern_relevance"),

	aesthetics_and_symbols: list("aesthetics_and_symbols"),
	interactions_and_rules: list("interactions_and_rules"),
	connections_to_world: list("connections_to_world"),
	core_tenets_and_traditions: list("core_tenets_and_traditions"),
	history_and_legacy: list("history_and_legacy"),
	conflicting_narratives: list("conflicting_narratives"),
	creativePrompts: list("creative_prompts"),
	gmNotes: list("gm_notes"),
})

export const loreLinks = pgTable("lore_links", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	loreId: cascadeFk("lore_id", lore.id),

	linkStrength: oneOf("link_strength", linkStrengths),
	targetEntityType: oneOf("target_entity_type", targetEntityTypes),
	targetEntityId: integer("target_entity_id"),

	linkRoleOrTypeText: string("link_role_or_type_text"),
	linkDetailsText: string("link_details_text"),
})
