// npc/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { alignments, relationshipStrengths, trustLevel, wealthLevels } from "../common"
import { embeddings } from "../embeddings/tables.js"
import { factions } from "../factions/tables"
import { sites } from "../regions/tables"

const genders = ["male", "female", "non-humanoid"] as const
const relationshipTypes = ["ally", "enemy", "family", "rival", "mentor", "student", "friend", "contact"] as const
const adaptability = ["rigid", "reluctant", "flexible", "opportunistic"] as const
const npcFactionRoles = [
	"leader",
	"lieutenant",
	"advisor",
	"enforcer",
	"agent",
	"member",
	"recruit",
	"elder",
	"spy",
	"figurehead",
	"financier",
	"deserter",
	"traitor",
	"exile",
] as const
const races = [
	"human",
	"elf",
	"dwarf",
	"halfling",
	"gnome",
	"half-elf",
	"half-orc",
	"tiefling",
	"dragonborn",
	"other",
] as const

export const npcs = pgTable("npcs", {
	id: pk(),
	name: string("name").unique(),

	alignment: oneOf("alignment", alignments),
	disposition: string("disposition"),
	gender: oneOf("gender", genders),
	race: oneOf("race", races),
	trustLevel: oneOf("trust_level", trustLevel),
	wealth: oneOf("wealth", wealthLevels),
	adaptability: oneOf("adaptability", adaptability),

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
	embeddingId: nullableFk("embedding_id", embeddings.id),
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
		role: oneOf("role", npcFactionRoles),
		rank: string("rank"),

		secrets: list("secrets"),
	},
	(t) => [unique().on(t.npcId, t.factionId)],
)

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

export const enums = {
	adaptability,
	alignments,
	genders,
	races,
	relationshipStrengths,
	relationshipTypes,
	trustLevel,
	wealthLevels,
	npcFactionRoles,
}
