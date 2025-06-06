import { sql } from "drizzle-orm"
import { boolean, check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { sites } from "../regions/tables"
import { enums } from "./enums"

const {
	adaptabilityLevels,
	alignments,
	availabilityLevels,
	characterComplexityProfiles,
	cprScores,
	genders,
	npcFactionRoles,
	playerPerceptionGoals,
	races,
	relationshipStrengths,
	relationshipTypes,
	siteAssociationTypes,
	trustLevels,
	wealthLevels,
} = enums

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

		isBidirectional: boolean("is_bidirectional").notNull().default(false),
	},
	(t) => [
		unique().on(t.npcId, t.relatedNpcId, t.relationshipType),
		check("no_self_relationship", sql`${t.npcId} != ${t.relatedNpcId}`),
	],
)

export { enums } from "./enums"
