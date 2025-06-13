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

	regionId: nullableFk("primary_region_id", regions.id),
	conflictId: nullableFk("related_conflict_id", conflicts.id),

	type: oneOf("type", arcTypes),
	status: oneOf("status", destinationStatuses),
	intendedEmotionalArc: oneOf("intended_emotional_arc", emotionalArcs),

	promise: string("promise"),
	payoff: string("payoff"),

	themes: list("themes"),
	foreshadowingElements: list("foreshadowing_elements"),
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

		sequenceInArc: integer("sequence_in_arc"),

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
		targetDestinationId: cascadeFk("target_destination_id", narrativeDestinations.id),

		relationshipType: oneOf("relationship_type", destinationRelationshipTypes),

		relationshipDetails: list("relationship_details"),
	},
	(t) => [
		unique().on(t.sourceDestinationId, t.targetDestinationId),
		check("chk_no_self_destination_relationship", sql`${t.sourceDestinationId} != ${t.targetDestinationId}`),
	],
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
			"npc_or_faction_exclusive_participant",
			sql`(${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL)
			 OR (${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)`,
		),
	],
)
