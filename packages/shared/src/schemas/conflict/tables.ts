// conflict/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { list, pk, string, oneOf, nullableFk, cascadeFk } from "../../db/utils"
import { quests } from "../quests/tables"
import { factions } from "../factions/tables"
import { regions } from "../regions/tables"

const conflictScopes = ["local", "regional", "global"] as const
const conflictNatures = ["political", "military", "mystical", "social", "economic", "environmental"] as const
const conflictStatuses = ["brewing", "active", "escalating", "deescalating", "resolved"] as const
const factionRoles = ["instigator", "opponent", "ally", "neutral", "mediator", "beneficiary"] as const
const questImpacts = ["escalates", "deescalates", "reveals_truth", "changes_sides", "no_change"] as const

export const majorConflicts = pgTable("major_conflicts", {
	id: pk(),
	name: string("name").unique(),
	scope: oneOf("scope", conflictScopes),
	nature: oneOf("nature", conflictNatures),
	status: oneOf("status", conflictStatuses).default("active"),

	// Core details
	cause: string("cause").notNull(), // Root cause or trigger
	description: list("description"),
	stakes: list("stakes"), // What's at risk

	// Regional focus
	primaryRegionId: nullableFk("primary_region_id", regions.id),

	// Story elements
	moralDilemma: string("moral_dilemma"), // Central ethical question
	possibleOutcomes: list("possible_outcomes"),
	hiddenTruths: list("hidden_truths"), // Facts unknown to most participants
	creativePrompts: list("creative_prompts"),
})

export const conflictParticipants = pgTable("conflict_participants", {
	id: pk(),
	conflictId: cascadeFk("conflict_id", majorConflicts.id),
	factionId: cascadeFk("faction_id", factions.id),
	role: oneOf("role", factionRoles),

	// Additional context
	motivation: string("motivation").notNull(), // Why they're involved
	publicStance: string("public_stance"), // What they claim publicly
	secretStance: string("secret_stance"), // Their true position (if different)
	resources: list("resources"), // What they're contributing
})

export const conflictProgression = pgTable("conflict_progression", {
	id: pk(),
	conflictId: cascadeFk("conflict_id", majorConflicts.id),
	questId: cascadeFk("quest_id", quests.id),

	// How the quest affects the conflict
	impact: oneOf("impact", questImpacts).default("no_change"),

	// Additional context
	notes: list("notes"),
})

export const enums = {
	conflictScopes,
	conflictNatures,
	conflictStatuses,
	factionRoles,
	questImpacts,
}
