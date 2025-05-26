// conflict/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"

const conflictScopes = ["local", "regional", "global"] as const
const conflictNatures = ["political", "military", "mystical", "social", "economic", "environmental"] as const
const conflictStatuses = ["brewing", "active", "escalating", "deescalating", "resolved"] as const
const factionRoles = ["instigator", "opponent", "ally", "neutral", "mediator", "beneficiary"] as const
const questImpacts = ["escalates", "deescalates", "reveals_truth", "changes_sides", "no_change"] as const
const conflictClarity = [
	"clear_aggressor_victim",
	"competing_legitimate_grievances",
	"mutually_flawed_sides",
	"no_discernible_good_option",
] as const

export const majorConflicts = pgTable("major_conflicts", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	primaryRegionId: nullableFk("primary_region_id", regions.id),
	name: string("name").unique(),
	scope: oneOf("scope", conflictScopes),
	nature: oneOf("nature", conflictNatures),
	status: oneOf("status", conflictStatuses).default("active"),

	cause: string("cause"),
	stakes: list("stakes"),

	moralDilemma: string("moral_dilemma"),
	possibleOutcomes: list("possible_outcomes"),
	hiddenTruths: list("hidden_truths"),

	clarityOfRightWrong: oneOf("clarity_of_right_wrong", conflictClarity),
	currentTensionLevel: oneOf("tension_level", ["low", "building", "high", "breaking"]),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const conflictParticipants = pgTable("conflict_participants", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conflictId: cascadeFk("conflict_id", majorConflicts.id),
	factionId: cascadeFk("faction_id", factions.id),
	role: oneOf("role", factionRoles),

	motivation: string("motivation"),
	publicStance: string("public_stance"),
	secretStance: string("secret_stance"),
	resources: list("resources"),
})

export const conflictProgression = pgTable("conflict_progression", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	conflictId: cascadeFk("conflict_id", majorConflicts.id),
	questId: cascadeFk("quest_id", quests.id),

	impact: oneOf("impact", questImpacts).default("no_change"),

	notes: list("notes"),
})

export const enums = {
	conflictClarity,
	conflictScopes,
	conflictNatures,
	conflictStatuses,
	factionRoles,
	questImpacts,
}
