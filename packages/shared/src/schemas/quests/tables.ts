// quests/tables.ts

import { sql } from "drizzle-orm"
import { type AnyPgColumn, check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { regions, sites } from "../regions/tables"
import { enums as questEnums } from "./enums"
import * as stageModule from "./stages/tables"

const { enums: stageEnums, questStages, stageDecisions, npcStageInvolvement } = stageModule
export { questStages, stageDecisions, npcStageInvolvement }

const {
	hookTypes,
	moralSpectrumFocus,
	pacingRoles,
	participantImportanceLevels,
	playerExperienceGoals,
	presentationStyles,
	questTypes,
	relationshipTypes,
	trustLevels,
	urgencyLevels,
	visibilityLevels,
} = questEnums

export const quests = pgTable("quests", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	regionId: nullableFk("region_id", regions.id),
	type: oneOf("type", questTypes),
	urgency: oneOf("urgency", urgencyLevels),
	visibility: oneOf("visibility", visibilityLevels),
	mood: string("mood"),

	moralSpectrumFocus: oneOf("moral_spectrum_focus", moralSpectrumFocus),
	intendedPacingRole: oneOf("intended_pacing_role", pacingRoles),
	primaryPlayerExperienceGoal: oneOf("primary_player_experience_goal", playerExperienceGoals),

	failureOutcomes: list("failure_outcomes"),
	successOutcomes: list("success_outcomes"),
	objectives: list("objectives"),
	rewards: list("rewards"),
	themes: list("themes"),
	inspirations: list("inspirations"),

	prerequisiteQuestId: integer("parent_id").references((): AnyPgColumn => quests.id),
	otherUnlockConditionsNotes: nullableString("other_unlock_conditions_notes"),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const questRelationships = pgTable(
	"quest_relationships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		relatedQuestId: nullableFk("related_quest_id", quests.id),
		relationshipType: oneOf("relationship_type", relationshipTypes),
	},
	(t) => [unique().on(t.questId, t.relatedQuestId)],
)

export const questHooks = pgTable(
	"quest_hooks",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", quests.id),
		siteId: nullableFk("site_id", sites.id),
		factionId: nullableFk("faction_id", factions.id),
		source: string("source"),
		hookType: oneOf("hook_type", hookTypes),
		presentationStyle: oneOf("presentation_style", presentationStyles),
		hookContent: list("hook_content"),
		discoveryConditions: list("discovery_conditions"),
		deliveryNpcId: nullableFk("delivery_npc_id", npcs.id),
		npcRelationshipToParty: string("npc_relationship_to_party"),
		trustRequired: oneOf("trust_required", trustLevels),
		dialogueHint: string("dialogue_hint"),
	},
	(t) => [unique().on(t.questId, t.source, t.hookType)],
)

export const questParticipantInvolvement = pgTable(
	"quest_participant_involvement",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
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

export const enums = {
	...stageEnums,
	...questEnums,
}
