// narrative/tables.ts
import { boolean, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
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

export const destinationParticipantInvolvement = pgTable("destination_participant_involvement", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	destinationId: cascadeFk("destination_id", narrativeDestinations.id),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),
	roleInArc: string("role_in_arc"),
	arcImportance: string("arc_importance"),
	involvementDetails: list("involvement_details"),
})

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
