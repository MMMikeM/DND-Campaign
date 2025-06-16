// narrative-destinations/tables.ts

import { sql } from "drizzle-orm"
import { check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { consequences } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const {
	arcImportanceLevels,
	arcTypes,
	destinationRelationshipTypes,
	destinationStatuses,
	emotionalArcShapes,
	questRolesInArc,
} = enums

export const narrativeDestinations = pgTable("narrative_destinations", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	regionId: nullableFk("region_id", regions.id),
	conflictId: nullableFk("related_conflict_id", conflicts.id),

	type: oneOf("type", arcTypes),
	status: oneOf("status", destinationStatuses),
	intendedEmotionalArcShape: oneOf("intended_emotional_arc_shape", emotionalArcShapes),

	promise: string("promise"),
	payoff: string("payoff"),
	stakes: list("stakes"),

	themes: list("themes"),
	foreshadowingElements: list("foreshadowing_elements"),
})

export const narrativeDestinationQuestRoles = pgTable(
	"narrative_destination_quest_roles",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		narrativeDestinationId: cascadeFk("narrative_destination_id", narrativeDestinations.id),
		questId: cascadeFk("quest_id", quests.id),

		role: oneOf("role", questRolesInArc),

		sequenceInArc: integer("sequence_in_arc"),

		contributionDetails: list("contribution_details"),
	},
	(t) => [unique().on(t.narrativeDestinationId, t.questId)],
)

export const narrativeDestinationRelations = pgTable(
	"narrative_destination_relations",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		sourceNarrativeDestinationId: cascadeFk("source_destination_id", narrativeDestinations.id),
		targetNarrativeDestinationId: cascadeFk("target_destination_id", narrativeDestinations.id),

		relationshipType: oneOf("relationship_type", destinationRelationshipTypes),

		relationshipDetails: list("relationship_details"),
	},
	(t) => [
		unique().on(t.sourceNarrativeDestinationId, t.targetNarrativeDestinationId),
		check(
			"chk_no_self_destination_relationship",
			sql`${t.sourceNarrativeDestinationId} != ${t.targetNarrativeDestinationId}`,
		),
	],
)

export const narrativeDestinationParticipants = pgTable(
	"narrative_destination_participants",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		narrativeDestinationId: cascadeFk("narrative_destination_id", narrativeDestinations.id),

		npcId: nullableFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),
		npcOrFaction: oneOf("npc_or_faction", ["npc", "faction"]),

		roleInArc: string("role_in_arc"),

		arcImportance: oneOf("arc_importance", arcImportanceLevels),

		involvementDetails: list("involvement_details"),
	},
	(t) => [
		check(
			"npc_or_faction_exclusive_participant",
			sql` (${t.npcOrFaction} = 'npc' AND ${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL)
        OR (${t.npcOrFaction} = 'faction' AND ${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)
            `,
		),
	],
)

export const narrativeDestinationOutcomes = pgTable("narrative_destination_outcomes", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),
	narrativeDestinationId: cascadeFk("narrative_destination_id", narrativeDestinations.id),
	consequenceId: cascadeFk("consequence_id", consequences.id),
	outcomeType: oneOf("outcome_type", ["Success", "Failure", "Mixed"]),
})
