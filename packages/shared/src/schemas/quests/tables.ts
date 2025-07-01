// quests/tables.ts

import { sql } from "drizzle-orm"
import { type AnyPgColumn, check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableOneOf, nullableString, oneOf, pk, string } from "../../db/utils"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { sites } from "../regions/tables"
import { enums } from "./enums"

const {
	hookTypes,
	participantImportanceLevels,
	presentationStyles,
	questTypes,
	relationshipTypes,
	trustLevels,
	urgencyLevels,
	questHookSourceTypes,
	impactSeverity,
	eventTypes,
	narrativePlacements,
	rhythmEffects,
	emotionalShapes,
} = enums

export const quests = pgTable("quests", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	tags: list("tags"),

	name: string("name").unique(),
	type: oneOf("type", questTypes),
	urgency: oneOf("urgency", urgencyLevels),
	mood: string("mood"),
	primaryPlayerExperienceGoal: string("primary_player_experience_goal"),

	promise: nullableString("promise"),
	payoff: nullableString("payoff"),
	stakes: list("stakes"),
	emotionalShape: nullableOneOf("emotional_shape", emotionalShapes),

	eventType: oneOf("event_type", eventTypes),
	intendedRhythmEffect: oneOf("intended_rhythm_effect", rhythmEffects),
	narrativePlacement: oneOf("narrative_placement", narrativePlacements),
	impactSeverity: oneOf("impact_severity", impactSeverity),

	objectives: list("objectives"),
	rewards: list("rewards"),

	prerequisiteQuestId: integer("prerequisite_quest_id").references((): AnyPgColumn => quests.id),
	otherUnlockConditionsNotes: nullableString("other_unlock_conditions_notes"),
})

export const questRelations = pgTable(
	"quest_relations",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		sourceQuestId: cascadeFk("source_quest_id", quests.id),
		targetQuestId: cascadeFk("target_quest_id", quests.id),
		relationshipType: oneOf("relationship_type", relationshipTypes),
	},
	(t) => [
		unique().on(t.sourceQuestId, t.targetQuestId),
		check("no_self_relationship", sql`${t.sourceQuestId} != ${t.targetQuestId}`),
	],
)

export const questHooks = pgTable(
	"quest_hooks",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),

		hookSourceType: oneOf("hook_source_type", questHookSourceTypes),
		siteId: nullableFk("site_id", sites.id),
		factionId: nullableFk("faction_id", factions.id),
		deliveryNpcId: nullableFk("delivery_npc_id", npcs.id),

		hookType: oneOf("hook_type", hookTypes),
		presentationStyle: oneOf("presentation_style", presentationStyles),
		trustRequired: oneOf("trust_required", trustLevels),

		source: string("source"),
		npcRelationshipToParty: string("npc_relationship_to_party"),
		dialogueHint: string("dialogue_hint"),

		hookContent: list("hook_content"),
		discoveryConditions: list("discovery_conditions"),
	},
	(t) => [
		unique().on(t.questId, t.source, t.hookType),
		check(
			"chk_quest_hook_source_exclusive",
			sql`
			CASE ${t.hookSourceType}
				WHEN 'site' THEN (${t.siteId} IS NOT NULL AND ${t.factionId} IS NULL AND ${t.deliveryNpcId} IS NULL)
				WHEN 'faction' THEN (${t.siteId} IS NULL AND ${t.factionId} IS NOT NULL AND ${t.deliveryNpcId} IS NULL)
				WHEN 'npc' THEN (${t.siteId} IS NULL AND ${t.factionId} IS NULL AND ${t.deliveryNpcId} IS NOT NULL)
				ELSE FALSE
			END
			`,
		),
	],
)

export const questParticipants = pgTable(
	"quest_participants",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		npcId: nullableFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),

		roleInQuest: string("role_in_quest"),

		importanceInQuest: oneOf("importance_in_quest", participantImportanceLevels),

		involvementDetails: list("involvement_details"),
	},
	(t) => [
		check(
			"chk_quest_participant_exclusive",
			sql`
		(${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL) OR
		(${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)
		`,
		),
	],
)

export { enums }
