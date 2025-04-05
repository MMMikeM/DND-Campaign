// foreshadowing/tables.ts
import { boolean, pgTable, timestamp } from "drizzle-orm/pg-core"
import { list, pk, string, oneOf, nullableFk } from "../../db/utils"
import { quests, questStages, questTwists } from "../quests/tables"
import { npcs } from "../npc/tables"
import { factions } from "../factions/tables"
import { locations } from "../regions/tables"
import { narrativeArcs } from "../narrative/tables"

const foreshadowingSubtlety = ["obvious", "moderate", "subtle", "hidden"] as const
const narrativeWeight = ["minor", "supporting", "major", "crucial"] as const
const foreshadowingTypes = ["document", "conversation", "object", "environmental", "vision", "rumor"] as const

export const narrativeForeshadowing = pgTable("narrative_foreshadowing", {
	id: pk(),

	// Where this foreshadowing appears
	questStageId: nullableFk("quest_stage_id", questStages.id),
	locationId: nullableFk("location_id", locations.id),
	npcId: nullableFk("npc_id", npcs.id),
	factionId: nullableFk("faction_id", factions.id),

	// Foreshadowing content
	name: string("name").notNull(), // Identifier (e.g., "Bloody Dagger in Baron's Study")
	type: oneOf("type", foreshadowingTypes), // Form of the foreshadowing
	description: list("description").notNull(), // What players observe

	// Discovery information
	discoveryCondition: list("discovery_condition"), // How players find it
	subtlety: oneOf("subtlety", foreshadowingSubtlety).default("moderate"),
	narrativeWeight: oneOf("narrative_weight", narrativeWeight).default("supporting"),

	// What this foreshadows
	foreshadowsQuestId: nullableFk("foreshadows_quest_id", quests.id),
	foreshadowsTwistId: nullableFk("foreshadows_twist_id", questTwists.id),
	foreshadowsNpcId: nullableFk("foreshadows_npc_id", npcs.id),
	foreshadowsArcId: nullableFk("foreshadows_arc_id", narrativeArcs.id),
	foreshadowsElement: string("foreshadows_element"), // What this hints at (e.g., "Baron's secret identity")

	// GM tracking
	discovered: boolean("discovered").default(false),
	grantedToPlayers: timestamp("granted_to_players"),
	playerNotes: list("player_notes"), // Record player theories/reactions
	gmNotes: list("gm_notes"),
})
