import { pgTable } from "drizzle-orm/pg-core"
import { list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { clueTypes, discoverySubtlety, narrativeWeight, reliabilityLevels } from "../common"
import { embeddings } from "../embeddings/tables"
import { narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"

const investigationStatuses = ["active", "solved", "cold", "abandoned"] as const
const targetTypes = ["person", "organization", "event", "mystery"] as const

// New enums for discoverableElements
const purposeTypes = ["investigation_clue", "narrative_foreshadowing", "world_building"] as const

export const investigations = pgTable("investigations", {
	id: pk(),
	name: string("name"),
	status: oneOf("status", investigationStatuses),
	targetType: oneOf("target_type", targetTypes),

	// Core context
	questId: nullableFk("quest_id", quests.id),
	leadInvestigatorIds: list("lead_investigator_ids"), // NPC IDs

	// Investigation details
	description: list("description"),
	objectives: list("objectives"),
	findings: list("findings"),

	// Progress tracking
	discoveredElementIds: list("discovered_element_ids"), // References to discoverableElements
	remainingLeads: list("remaining_leads"),

	creativePrompts: list("creative_prompts"),
})

export const discoverableElements = pgTable("discoverable_elements", {
	id: pk(),
	name: string("name"),

	// Purpose and discovery mechanics
	purposeType: oneOf("purpose_type", purposeTypes),
	discoveryMethod: list("discovery_method"),

	// Content and significance
	description: list("description"),
	revealsInformation: list("reveals_information"),
	foreshadowsElement: string("foreshadows_element"),

	// Narrative properties
	subtlety: oneOf("subtlety", discoverySubtlety).default("moderate"),
	narrativeWeight: oneOf("narrative_weight", narrativeWeight).default("supporting"),

	// Investigation properties
	clueType: oneOf("clue_type", clueTypes),
	reliability: oneOf("reliability", reliabilityLevels),

	// Location and context
	questStageId: nullableFk("quest_stage_id", questStages.id),
	siteId: nullableFk("site_id", sites.id),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),

	// What this points to
	foreshadowsQuestId: nullableFk("foreshadows_quest_id", quests.id),
	foreshadowsEventId: nullableFk("foreshadows_event_id", narrativeEvents.id),
	foreshadowsNpcId: nullableFk("foreshadows_npc_id", npcs.id),
	foreshadowsDestinationId: nullableFk("foreshadows_destination_id", narrativeDestinations.id),
	relatedItemId: nullableFk("related_item_id", items.id),

	// Investigation context
	investigationId: nullableFk("investigation_id", investigations.id),

	// Meta
	playerNotes: list("player_notes"),
	gmNotes: list("gm_notes"),
	creativePrompts: list("creative_prompts"),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const enums = {
	clueTypes,
	reliabilityLevels,
	investigationStatuses,
	targetTypes,
	purposeTypes,
	discoverySubtlety,
	narrativeWeight,
}
