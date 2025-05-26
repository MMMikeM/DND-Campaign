import { pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { narrativeEvents } from "../events/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative/tables"
import { npcs } from "../npc/tables"
import { questStages, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { discoverySubtlety, narrativeWeight } from "../shared-enums"

const reliabilityLevels = ["verified", "likely", "uncertain", "suspect"] as const
const investigationStatuses = ["active", "solved", "cold", "abandoned"] as const
const targetTypes = ["person", "organization", "event", "mystery"] as const
const purposeTypes = ["investigation_clue", "narrative_foreshadowing", "world_building"] as const
const clueTypes = ["physical", "testimonial", "documentary", "circumstantial"] as const
const informationClarity = ["direct_fact", "strong_implication", "ambiguous_hint", "misleading_if_unanalyzed"] as const
const intendedPlayerFeelings = [
	"empowerment_through_discovery",
	"dread_of_implications",
	"intrigue_deepening_mystery",
] as const

export const investigations = pgTable("investigations", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name"),
	status: oneOf("status", investigationStatuses),
	targetType: oneOf("target_type", targetTypes),
	intendedPlayerFeeling: oneOf("intended_player_feeling", intendedPlayerFeelings),

	questId: nullableFk("quest_id", quests.id),
	findings: list("findings"),
	remainingLeads: list("remaining_leads"),
})

export const discoverableElements = pgTable("discoverable_elements", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name"),
	purposeType: oneOf("purpose_type", purposeTypes),
	clueType: oneOf("clue_type", clueTypes),

	// Content
	revealsInformation: list("reveals_information"),
	discoveryMethod: list("discovery_method"),

	// Added: Structured difficulty for easier querying
	discoveryDifficulty: oneOf("discovery_difficulty", ["trivial", "easy", "moderate", "hard", "very_hard"]),

	// Properties
	reliability: oneOf("reliability", reliabilityLevels),
	informationClarity: oneOf("information_clarity", informationClarity),
	subtlety: oneOf("subtlety", discoverySubtlety).default("moderate"),
	narrativeWeight: oneOf("narrative_weight", narrativeWeight).default("supporting"),

	// Context
	questStageId: nullableFk("quest_stage_id", questStages.id),
	siteId: nullableFk("site_id", sites.id),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),

	// Simplified foreshadowing - ONLY for abstract concepts not yet defined as entities
	abstractForeshadowing: nullableString("abstract_foreshadowing"), // "a coming war", "betrayal by a trusted ally"

	// Specific entity foreshadowing (keep these)
	foreshadowsQuestId: nullableFk("foreshadows_quest_id", quests.id),
	foreshadowsEventId: nullableFk("foreshadows_event_id", narrativeEvents.id),
	foreshadowsNpcId: nullableFk("foreshadows_npc_id", npcs.id),
	foreshadowsDestinationId: nullableFk("foreshadows_destination_id", narrativeDestinations.id),
	relatedItemId: nullableFk("related_item_id", items.id),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

// Fixed: Proper relationship tables
export const investigationLeads = pgTable("investigation_leads", {
	id: pk(),
	investigationId: cascadeFk("investigation_id", investigations.id),
	leadInvestigatorId: cascadeFk("lead_investigator_id", npcs.id),
	role: oneOf("role", ["primary", "secondary", "consultant"]),
})

// Many-to-many: elements can belong to multiple investigations
export const investigationElements = pgTable("investigation_elements", {
	id: pk(),
	investigationId: cascadeFk("investigation_id", investigations.id),
	elementId: cascadeFk("element_id", discoverableElements.id),
	discoveryStatus: oneOf("discovery_status", ["undiscovered", "discovered", "analyzed"]),
	discoveryDate: nullableString("discovery_date"),
})

export const enums = {
	clueTypes,
	discoverySubtlety,
	informationClarity,
	intendedPlayerFeelings,
	investigationStatuses,
	narrativeWeight,
	purposeTypes,
	reliabilityLevels,
	targetTypes,
}
