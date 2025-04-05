// narrative/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { list, pk, string, oneOf, cascadeFk } from "../../db/utils"
import { quests } from "../quests/tables"

const arcTypes = ["main", "faction", "character", "side"] as const
const arcStatuses = ["planned", "active", "completed", "abandoned"] as const
const questRoles = ["introduction", "complication", "rising_action", "climax", "resolution", "epilogue"] as const

export const narrativeArcs = pgTable("narrative_arcs", {
	id: pk(),
	name: string("name").unique(),
	type: oneOf("type", arcTypes),
	status: oneOf("status", arcStatuses).default("planned"),

	// Sanderson storytelling elements
	promise: string("promise").notNull(), // The initial hook or premise
	payoff: string("payoff").notNull(), // The intended climax or resolution

	// Rich content fields
	description: list("description"),
	themes: list("themes"), // Major themes explored
	foreshadowingElements: list("foreshadowing_elements"), // Elements to plant early
	creativePrompts: list("creative_prompts"),
})

export const arcMembership = pgTable("arc_membership", {
	id: pk(),
	arcId: cascadeFk("arc_id", narrativeArcs.id),
	questId: cascadeFk("quest_id", quests.id),

	// Quest's narrative function within this arc
	role: oneOf("role", questRoles),

	// Optional additional context
	notes: list("notes"),
})
