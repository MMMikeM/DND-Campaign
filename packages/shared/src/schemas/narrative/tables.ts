// narrative/tables.ts
import { boolean, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { regions, sites } from "../regions/tables"
import { discoverySubtlety, narrativeWeight } from "../shared-enums"

const questRoles = ["introduction", "complication", "rising_action", "climax", "resolution", "epilogue"] as const
const arcTypes = ["main", "faction", "character", "side"] as const

// Fixed enum with correct values
const foreshadowingTypes = ["document", "conversation", "object", "environmental", "vision", "rumor"] as const

const emotionalArcs = [
	"triumph_over_adversity",
	"tragic_fall",
	"bittersweet_resolution",
	"hopeful_new_beginning",
	"cyclical_struggle",
	"moral_awakening",
	"descent_into_darkness",
	"redemption_journey",
] as const

const destinationStatuses = ["planned", "in_progress", "completed", "abandoned"] as const

// Arc relationship types
const destinationRelationshipTypes = [
	"prerequisite",
	"sequel",
	"parallel",
	"alternative",
	"thematic_echo",
	"contrast",
] as const

export const narrativeDestinations = pgTable("narrative_destinations", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	type: oneOf("type", arcTypes),
	status: oneOf("status", destinationStatuses).default("planned"),

	// Core promise/payoff structure
	promise: string("promise").notNull(),
	payoff: string("payoff").notNull(),
	promiseDelivered: boolean("promise_delivered").default(false),
	payoffSatisfying: boolean("payoff_satisfying").default(false),

	intendedEmotionalArc: oneOf("intended_emotional_arc", emotionalArcs),

	// Content
	themes: list("themes"),

	// High-level foreshadowing planning (distinct from specific discoverable elements)
	foreshadowingElements: list("foreshadowing_elements"), // "Recurring dreams", "Ancient prophecies"

	// Arc-level key participants (central to entire arc, not just individual quests)
	keyNpcIds: list("key_npc_ids"), // NPCs central to the entire arc
	keyFactionIds: list("key_faction_ids"), // Factions driving the whole arc

	// World connections
	primaryRegionId: nullableFk("primary_region_id", regions.id),
	relatedConflictId: nullableFk("related_conflict_id", majorConflicts.id),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

// Renamed for clarity and enhanced with sequencing
export const destinationQuestRoles = pgTable(
	"destination_quest_roles",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		destinationId: cascadeFk("destination_id", narrativeDestinations.id),
		questId: cascadeFk("quest_id", quests.id),
		role: oneOf("role", questRoles),

		// Added: Sequencing for multiple quests in same role
		sequenceInArc: integer("sequence_in_arc").default(1), // Order within role (1, 2, 3...)

		// How this quest advances the destination
		contributionDetails: list("contribution_details"),
	},
	(t) => [unique().on(t.destinationId, t.questId)],
)

// Arc-to-arc relationships for complex campaign structure
export const destinationRelationships = pgTable(
	"destination_relationships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		sourceDestinationId: cascadeFk("source_destination_id", narrativeDestinations.id),
		relatedDestinationId: cascadeFk("related_destination_id", narrativeDestinations.id),
		relationshipType: oneOf("relationship_type", destinationRelationshipTypes),

		// Details about how these arcs relate
		relationshipDetails: list("relationship_details"),
	},
	(t) => [unique().on(t.sourceDestinationId, t.relatedDestinationId)],
)

// Structured foreshadowing for specific narrative destinations
export const destinationForeshadowing = pgTable("destination_foreshadowing", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	destinationId: cascadeFk("destination_id", narrativeDestinations.id),

	name: string("name"), // "Mysterious Symbol", "Prophetic Dream"
	foreshadowingType: oneOf("foreshadowing_type", foreshadowingTypes),

	// Content - what players actually encounter
	content: list("content"), // What players observe/experience
	discoveryMethod: list("discovery_method"), // How to encounter it

	// Properties
	subtlety: oneOf("subtlety", discoverySubtlety).default("moderate"),
	narrativeWeight: oneOf("narrative_weight", narrativeWeight).default("supporting"),

	// What it points to
	revealsElement: string("reveals_element"), // What aspect of the destination this hints at

	// Context
	questStageId: nullableFk("quest_stage_id", quests.id), // If tied to specific stage
	siteId: nullableFk("site_id", sites.id), // Where it can be found
	npcId: nullableFk("npc_id", npcs.id), // Who might deliver it

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

// Arc-level NPC involvement (for NPCs central to entire arcs)
export const destinationNpcInvolvement = pgTable(
	"destination_npc_involvement",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		destinationId: cascadeFk("destination_id", narrativeDestinations.id),
		npcId: cascadeFk("npc_id", npcs.id),
		role: oneOf("role", [
			"primary_antagonist",
			"key_ally",
			"mentor_figure",
			"tragic_figure",
			"catalyst",
			"foil",
			"narrator",
		] as const),

		// Their importance to the entire arc
		arcImportance: oneOf("arc_importance", ["central", "supporting", "peripheral"] as const),

		// How they contribute to the emotional arc
		emotionalFunction: list("emotional_function"),
	},
	(t) => [unique().on(t.destinationId, t.npcId)],
)

// Arc-level faction involvement (for factions central to entire arcs)
export const destinationFactionInvolvement = pgTable(
	"destination_faction_involvement",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		destinationId: cascadeFk("destination_id", narrativeDestinations.id),
		factionId: cascadeFk("faction_id", factions.id),
		role: oneOf("role", [
			"primary_opposition",
			"key_ally",
			"power_behind_throne",
			"tragic_victim",
			"catalyst_for_change",
			"status_quo_defender",
		] as const),

		// Their stake in the arc's resolution
		arcStakes: list("arc_stakes"),
		arcImportance: oneOf("arc_importance", ["central", "supporting", "peripheral"] as const),
	},
	(t) => [unique().on(t.destinationId, t.factionId)],
)

export const enums = {
	arcTypes,
	destinationStatuses,
	destinationRelationshipTypes,
	discoverySubtlety,
	emotionalArcs,
	foreshadowingTypes,
	narrativeWeight,
	questRoles,
}
