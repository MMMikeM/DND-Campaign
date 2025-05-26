// narrative/tables.ts

import { sql } from "drizzle-orm"
import { check, integer, pgTable, unique } from "drizzle-orm/pg-core"
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
const destinationRelationshipTypes = [
	"prerequisite",
	"sequel",
	"parallel",
	"alternative",
	"thematic_echo",
	"contrast",
] as const
const arcImportanceLevels = ["minor", "supporting", "major", "central"] as const

export const narrativeDestinations = pgTable("narrative_destinations", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	type: oneOf("type", arcTypes),
	status: oneOf("status", destinationStatuses).default("planned"),

	promise: string("promise"),
	payoff: string("payoff"),

	themes: list("themes"),
	foreshadowingElements: list("foreshadowing_elements"),
	intendedEmotionalArc: oneOf("intended_emotional_arc", emotionalArcs),
	primaryRegionId: nullableFk("primary_region_id", regions.id),
	relatedConflictId: nullableFk("related_conflict_id", majorConflicts.id),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

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
		sequenceInArc: integer("sequence_in_arc").default(1),
		contributionDetails: list("contribution_details"),
	},
	(t) => [unique().on(t.destinationId, t.questId)],
)

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
		relationshipDetails: list("relationship_details"),
	},
	(t) => [unique().on(t.sourceDestinationId, t.relatedDestinationId)],
)

export const destinationParticipantInvolvement = pgTable(
	"destination_participant_involvement",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		destinationId: cascadeFk("destination_id", narrativeDestinations.id),
		npcId: nullableFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),
		roleInArc: string("role_in_arc"),
		arcImportance: oneOf("arc_importance", arcImportanceLevels),
		involvementDetails: list("involvement_details"),
	},
	(t) => [
		check(
			"npc_or_faction",
			sql`(${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL)
			 OR (${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)`,
		),
	],
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
	arcImportanceLevels,
}
