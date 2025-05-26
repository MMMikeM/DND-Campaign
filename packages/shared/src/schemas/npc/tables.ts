import { sql } from "drizzle-orm"
import { boolean, check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { sites } from "../regions/tables"
import { alignments, relationshipStrengths, trustLevels, wealthLevels } from "../shared-enums"

const genders = ["male", "female", "non-humanoid"] as const
const relationshipTypes = ["ally", "enemy", "family", "rival", "mentor", "student", "friend", "contact"] as const
const adaptabilityLevels = ["rigid", "reluctant", "flexible", "opportunistic"] as const
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

const cprScores = ["low", "medium", "high"] as const

const characterComplexityProfiles = [
	"moral_anchor_good",
	"moral_anchor_evil",
	"contextual_flawed_understandable",
	"deeply_complex_contradictory",
	"simple_what_you_see",
] as const

const playerPerceptionGoals = [
	"trustworthy_ally_anchor",
	"clear_villain_foil",
	"intriguing_mystery_figure",
	"comic_relief_levity",
	"tragic_figure_empathy",
	"relatable_everyman",
] as const

const npcStatuses = ["alive", "dead", "missing", "imprisoned", "exiled", "unknown"] as const
const availabilityLevels = ["always", "often", "sometimes", "rarely", "unavailable"] as const

const siteAssociationTypes = [
	"residence",
	"workplace",
	"frequent_visitor",
	"secret_meeting_spot",
	"hideout",
	"place_of_power",
	"sentimental_location",
] as const

export const npcs = pgTable("npcs", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),

	alignment: oneOf("alignment", alignments),
	disposition: string("disposition"),
	gender: oneOf("gender", genders),
	race: oneOf("race", races),
	trustLevel: oneOf("trust_level", trustLevels),
	wealth: oneOf("wealth", wealthLevels),
	adaptability: oneOf("adaptability", adaptabilityLevels),

	complexityProfile: oneOf("complexity_profile", characterComplexityProfiles),
	playerPerceptionGoal: oneOf("player_perception_goal", playerPerceptionGoals),

	age: string("age"),
	attitude: string("attitude"),
	occupation: string("occupation"),
	quirk: string("quirk"),
	socialStatus: string("social_status"),

	availability: oneOf("availability", availabilityLevels),
	currentLocationId: nullableFk("current_location_id", sites.id),

	currentGoals: list("current_goals"),

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

	capability: oneOf("capability", cprScores),
	proactivity: oneOf("proactivity", cprScores),
	relatability: oneOf("relatability", cprScores),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const npcSites = pgTable(
	"npc_sites",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		npcId: cascadeFk("npc_id", npcs.id),
		siteId: cascadeFk("site_id", sites.id),

		associationType: oneOf("association_type", siteAssociationTypes),
	},
	(t) => [unique().on(t.npcId, t.siteId, t.associationType)],
)

export const npcFactions = pgTable(
	"npc_factions",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		npcId: cascadeFk("npc_id", npcs.id),
		factionId: cascadeFk("faction_id", factions.id),
		loyalty: oneOf("loyalty", trustLevels),

		justification: string("justification"),
		role: oneOf("role", npcFactionRoles),
		rank: string("rank"),

		secrets: list("secrets"),
	},
	(t) => [unique().on(t.npcId, t.factionId)],
)

export const npcRelationships = pgTable(
	"npc_relationships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		npcId: cascadeFk("npc_id", npcs.id),
		relatedNpcId: cascadeFk("related_npc_id", npcs.id),
		relationshipType: oneOf("relationship_type", relationshipTypes),
		strength: oneOf("strength", relationshipStrengths),

		history: list("history"),
		narrativeTensions: list("narrative_tensions"),
		sharedGoals: list("shared_goals"),
		relationshipDynamics: list("relationship_dynamics"),

		isBidirectional: boolean("is_bidirectional").default(true),
	},
	(t) => [
		unique().on(t.npcId, t.relatedNpcId, t.relationshipType),
		check("no_self_relationship", sql`${t.npcId} != ${t.relatedNpcId}`),
	],
)

export const enums = {
	adaptabilityLevels,
	alignments,
	availabilityLevels,
	characterComplexityProfiles,
	cprScores,
	genders,
	npcFactionRoles,
	npcStatuses,
	playerPerceptionGoals,
	races,
	relationshipStrengths,
	relationshipTypes,
	siteAssociationTypes,
	trustLevels,
	wealthLevels,
}
