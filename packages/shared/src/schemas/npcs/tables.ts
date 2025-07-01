// npcs/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable, primaryKey, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { factions } from "../factions/tables"
import { sites } from "../regions/tables"
import { enums } from "./enums"

export { enums }

const {
	adaptabilityLevels,
	alignments,
	availabilityLevels,
	characterComplexityProfiles,
	cprScores,
	genders,
	npcFactionRoles,
	races,
	trustLevels,
	wealthLevels,
} = enums

export const npcs = pgTable("npcs", {
	id: pk(),
	name: string("name").unique(),
	summary: list("summary"),
	tags: list("tags"),

	siteId: nullableFk("site_id", sites.id),

	gender: oneOf("gender", genders),
	race: oneOf("race", races),
	age: string("age"),

	attitude: string("attitude"),
	occupation: string("occupation"),
	socialStatusAndReputation: string("social_status_and_reputation"),

	roleplayingGuide: list("roleplaying_guide"),
	appearance: list("appearance"),
	quirk: string("quirk"),
	conversationHook: string("conversation_hooks"),
	voiceNotes: string("voice_notes"),
})

export const npcDetails = pgTable("npc_details", {
	npcId: cascadeFk("npc_id", npcs.id).primaryKey(),

	alignment: oneOf("alignment", alignments),
	wealth: oneOf("wealth", wealthLevels),

	availability: oneOf("availability", availabilityLevels),
	adaptability: oneOf("adaptability", adaptabilityLevels),
	complexity: oneOf("complexity", characterComplexityProfiles),

	goalsAndFears: list("goals_and_fears"),
	secretsAndHistory: list("secrets_and_history"),

	capability: oneOf("capability", cprScores),
	proactivity: oneOf("proactivity", cprScores),
	relatability: oneOf("relatability", cprScores),

	biases: list("biases"),
	preferredTopics: list("preferred_topics"),
	avoidTopics: list("avoid_topics"),

	knowledge: list("knowledge"),
	rumours: list("rumours"),
})

export const npcFactionMemberships = pgTable(
	"npc_faction_memberships",
	{
		id: pk(),
		npcId: cascadeFk("npc_id", npcs.id),
		factionId: cascadeFk("faction_id", factions.id),

		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		loyalty: oneOf("loyalty", trustLevels),
		role: oneOf("role", npcFactionRoles),

		justification: string("justification"),
		rank: string("rank"),

		secrets: list("secrets"),
	},
	(t) => [unique().on(t.npcId)],
)

export const npcRelations = pgTable(
	"npc_relations",
	{
		id: pk(),
		sourceNpcId: cascadeFk("source_npc_id", npcs.id),
		targetNpcId: cascadeFk("target_npc_id", npcs.id),

		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		relationship: string("relationship"),
		dynamicsAndHistory: list("dynamics_and_history"),
	},
	(t) => [
		unique("unique_npc_relationship").on(t.sourceNpcId, t.targetNpcId),
		check("no_self_relationship", sql`${t.sourceNpcId} != ${t.targetNpcId}`),
	],
)
