// narrative/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { quests } from "../quests/tables"

const arcTypes = ["main", "faction", "character", "side"] as const
const arcStatuses = ["planned", "active", "completed", "abandoned"] as const
const questRoles = ["introduction", "complication", "rising_action", "climax", "resolution", "epilogue"] as const

export const narrativeDestinations = pgTable("narrative_destinations", {
	id: pk(),
	name: string("name").unique(),
	type: oneOf("type", arcTypes),

	promise: string("promise").notNull(),
	payoff: string("payoff").notNull(),

	description: list("description"),
	themes: list("themes"),
	foreshadowingElements: list("foreshadowing_elements"),
	creativePrompts: list("creative_prompts"),
	embeddingId: nullableFk("embedding_id", require("../embeddings/tables").embeddings.id),
})

export const destinationContribution = pgTable("destination_contribution", {
	id: pk(),
	destinationId: cascadeFk("destination_id", narrativeDestinations.id),
	questId: cascadeFk("quest_id", quests.id),

	role: oneOf("role", questRoles),

	notes: list("notes"),
})

export const enums = {
	arcTypes,
	arcStatuses,
	questRoles,
}
