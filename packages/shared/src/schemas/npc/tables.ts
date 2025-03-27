// npc/tables.ts
import { sqliteTable } from "drizzle-orm/sqlite-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { alignments, genders, races, trustLevel, wealthLevels } from "../common"
import { factions } from "../factions/tables"
import { locations } from "../regions/tables"

export const npcs = sqliteTable("npcs", {
	id: pk(),
	name: string("name").unique(),

	alignment: oneOf("alignment", alignments),
	disposition: string("disposition"),
	gender: oneOf("gender", genders),
	race: oneOf("race", races),
	trustLevel: oneOf("trust_level", trustLevel),
	wealth: oneOf("wealth", wealthLevels),
	adaptability: oneOf("adaptability", ["rigid", "reluctant", "flexible", "opportunistic"]),
	// Add to npcs table

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
})

export const npcLocations = sqliteTable("npc_locations", {
	id: pk(),
	npcId: cascadeFk("npc_id", npcs.id),
	locationId: nullableFk("location_id", locations.id),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
})

export const npcFactions = sqliteTable("npc_factions", {
	id: pk(),
	npcId: cascadeFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),
	loyalty: oneOf("loyalty", trustLevel),

	justification: string("justification"),
	role: string("role"),
	rank: string("rank"),

	secrets: list("secrets"),
})

export const npcRelationships = sqliteTable("npc_relationships", {
	id: pk(),
	npcId: cascadeFk("npc_id", npcs.id),
	relatedNpcId: nullableFk("related_npc_id", npcs.id),
	relationsshipStrength: oneOf("relationship_strength", ["weak", "moderate", "strong", "unbreakable"]),
	type: string("type"),
	strength: string("strength"),
	history: list("history"),
	description: list("description"),
	creativePrompts: list("creative_prompts"),
	narrativeTensions: list("narrative_tensions"),
	sharedViews: list("shared_goals"),
	relationshipDynamics: list("relationship_dynamics"),
})
