// npc/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string, embeddingVector } from "../../db/utils"
import { alignments, genders, races, trustLevel, wealthLevels } from "../common"
import { factions } from "../factions/tables"
import { sites } from "../regions/tables"

export const npcs = pgTable("npcs", {
	id: pk(),
	name: string("name").unique(),

	alignment: oneOf("alignment", alignments),
	disposition: string("disposition"),
	gender: oneOf("gender", genders),
	race: oneOf("race", races),
	trustLevel: oneOf("trust_level", trustLevel),
	wealth: oneOf("wealth", wealthLevels),
	adaptability: oneOf("adaptability", ["rigid", "reluctant", "flexible", "opportunistic"]),

	age: string("age"),
	attitude: string("attitude"),
	occupation: string("occupation"),
	quirk: string("quirk"),
	socialStatus: string("social_status"),

	appearance: list("appearance"),
	avoidTopics: list("avoid_topics"),
	background: list("background"),
	biases: list("biases"),
	dialogue: list("dialogue"),
	drives: list("drives"),
	fears: list("fears"),
	knowledge: list("knowledge"),
	mannerisms: list("mannerisms"),
	personalityTraits: list("personality_traits"),
	preferredTopics: list("preferred_topics"),
	rumours: list("rumours"),
	secrets: list("secrets"),
	voiceNotes: list("voice_notes"),
	embedding: embeddingVector("embedding"),
})

export const npcSites = pgTable(
	"npc_sites",
	{
		id: pk(),
		npcId: cascadeFk("npc_id", npcs.id),
		siteId: nullableFk("site_id", sites.id),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.npcId, t.siteId)],
)

export const npcFactions = pgTable(
	"npc_factions",
	{
		id: pk(),
		npcId: cascadeFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),
		loyalty: oneOf("loyalty", trustLevel),

		justification: string("justification"),
		role: string("role"),
		rank: string("rank"),

		secrets: list("secrets"),
	},
	(t) => [unique().on(t.npcId, t.factionId)],
)

const relationshipTypes = ["ally", "enemy", "family", "rival", "mentor", "student", "friend", "contact"] as const
const relationshipStrengths = [
	"weak",
	"moderate",
	"friendly",
	"strong",
	"unbreakable",
	"friction",
	"cold",
	"hostile",
	"war",
] as const

export const characterRelationships = pgTable(
	"character_relationships",
	{
		id: pk(),
		npcId: cascadeFk("npc_id", npcs.id),
		relatedNpcId: nullableFk("related_npc_id", npcs.id),
		type: oneOf("type", relationshipTypes),
		strength: oneOf("strength", relationshipStrengths),
		history: list("history"),
		description: list("description"),
		narrativeTensions: list("narrative_tensions"),
		sharedGoals: list("shared_goals"),
		relationshipDynamics: list("relationship_dynamics"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.npcId, t.relatedNpcId)],
)
