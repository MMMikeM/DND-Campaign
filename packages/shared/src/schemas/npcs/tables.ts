// npcs/tables.ts
import { sql } from "drizzle-orm"
import { boolean, check, pgTable, unique, uniqueIndex } from "drizzle-orm/pg-core"
import { cascadeFk, list, oneOf, pk, string } from "../../db/utils"
import { factions } from "../factions/tables"
import { sites } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

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
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	alignment: oneOf("alignment", alignments),
	gender: oneOf("gender", genders),
	race: oneOf("race", races),
	trustLevel: oneOf("trust_level", trustLevels),
	wealth: oneOf("wealth", wealthLevels),
	adaptability: oneOf("adaptability", adaptabilityLevels),
	complexityProfile: oneOf("complexity_profile", characterComplexityProfiles),
	playerPerceptionGoal: oneOf("player_perception_goal", playerPerceptionGoals),
	availability: oneOf("availability", availabilityLevels),
	capability: oneOf("capability", cprScores),
	proactivity: oneOf("proactivity", cprScores),
	relatability: oneOf("relatability", cprScores),

	disposition: string("disposition"),
	age: string("age"),
	attitude: string("attitude"),
	occupation: string("occupation"),
	quirk: string("quirk"),
	socialStatus: string("social_status"),

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
})

export const npcSiteAssociations = pgTable(
	"npc_site_associations",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		npcId: cascadeFk("npc_id", npcs.id),
		siteId: cascadeFk("site_id", sites.id),

		associationType: oneOf("association_type", siteAssociationTypes),

		isCurrent: boolean("is_current").notNull().default(false),
	},
	(t) => [
		unique().on(t.npcId, t.siteId, t.associationType),
		uniqueIndex("unique_current_per_npc").on(t.npcId).where(sql`${t.isCurrent} = true`),
	],
)

export const npcFactionMemberships = pgTable(
	"npc_faction_memberships",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		npcId: cascadeFk("npc_id", npcs.id),
		factionId: cascadeFk("faction_id", factions.id),

		loyalty: oneOf("loyalty", trustLevels),
		role: oneOf("role", npcFactionRoles),

		justification: string("justification"),
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

		sourceNpcId: cascadeFk("source_npc_id", npcs.id),
		targetNpcId: cascadeFk("target_npc_id", npcs.id),

		relationshipType: oneOf("relationship_type", relationshipTypes),
		strength: oneOf("strength", relationshipStrengths),

		history: list("history"),
		narrativeTensions: list("narrative_tensions"),
		sharedGoals: list("shared_goals"),
		relationshipDynamics: list("relationship_dynamics"),
	},
	(t) => [
		unique().on(t.sourceNpcId, t.targetNpcId, t.relationshipType),
		check("no_self_relationship", sql`${t.sourceNpcId} != ${t.targetNpcId}`),
	],
)
