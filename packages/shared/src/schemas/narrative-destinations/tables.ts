// narrative-destinations/tables.ts

import { sql } from "drizzle-orm"
import { check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { arcImportanceLevels, arcTypes, destinationRelationshipTypes, destinationStatuses, emotionalArcs, questRoles } =
	enums

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
	intendedEmotionalArc: oneOf("intended_emotional_arc", emotionalArcs),

	promise: string("promise"),
	payoff: string("payoff"),

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

		narrativeDestinationId: cascadeFk("destination_id", narrativeDestinations.id),
		questId: cascadeFk("quest_id", quests.id),

		role: oneOf("role", questRoles),

		sequenceInArc: integer("sequence_in_arc"),

		contributionDetails: list("contribution_details"),
	},
	(t) => [unique().on(t.narrativeDestinationId, t.questId)],
)

export const narrativeDestinationRelationships = pgTable(
	"narrative_destination_relationships",
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

		roleInArc: string("role_in_arc"),

		arcImportance: oneOf("arc_importance", arcImportanceLevels),

		involvementDetails: list("involvement_details"),
	},
	(t) => [
		check(
			"npc_or_faction_exclusive_participant",
			sql`(${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL)
			 OR (${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)`,
		),
	],
)
