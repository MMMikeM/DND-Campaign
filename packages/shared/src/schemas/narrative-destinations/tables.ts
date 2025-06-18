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
	destinationImportance,
	destinationTypes,
	destinationRelationshipTypes,
	destinationStatuses,
	emotionalShapes,
	narrativeRoles,
} = enums

export const narrativeDestinations = pgTable("narrative_destinations", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	regionId: nullableFk("region_id", regions.id),
	conflictId: nullableFk("conflict_id", conflicts.id),

	type: oneOf("type", destinationTypes),
	status: oneOf("status", destinationStatuses),
	emotionalShape: oneOf("emotional_shape", emotionalShapes),

	promise: string("promise"),
	payoff: string("payoff"),
	stakes: list("stakes"),
	themes: list("themes"),
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

		narrativeRole: oneOf("narrative_role", narrativeRoles),
		sequence: integer("sequence"),

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
		relationshipDetails: list("relationship_details"), // CHANGED to list for more detail
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
		participantType: oneOf("participant_type", ["npc", "faction"]),

		narrativeRole: string("narrative_role"),
		importance: oneOf("importance", destinationImportance),

		involvementDetails: list("involvement_details"),
	},
	(t) => [
		check(
			"npc_or_faction_exclusive_participant",
			sql` (${t.participantType} = 'npc' AND ${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL)
        OR (${t.participantType} = 'faction' AND ${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)
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
