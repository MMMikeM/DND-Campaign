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

	promise: string("promise").notNull(),
	payoff: string("payoff").notNull(),

	description: list("description"),
	themes: list("themes"),
	foreshadowingElements: list("foreshadowing_elements"),
	creativePrompts: list("creative_prompts"),
})

export const arcMembership = pgTable("arc_membership", {
	id: pk(),
	arcId: cascadeFk("arc_id", narrativeArcs.id),
	questId: cascadeFk("quest_id", quests.id),

	role: oneOf("role", questRoles),

	notes: list("notes"),
})

export const enums = {
	arcTypes,
	arcStatuses,
	questRoles,
}
