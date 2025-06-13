// conflicts/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, manyOf, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { regions } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const {
	conflictClarity,
	conflictNatures,
	conflictScopes,
	conflictStatuses,
	participantRolesInConflict,
	tensionLevels,
	questImpacts,
} = enums

export const conflicts = pgTable("conflicts", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	regionId: nullableFk("primary_region_id", regions.id),

	cause: string("cause"),
	moralDilemma: string("moral_dilemma"),

	stakes: list("stakes"),
	possibleOutcomes: list("possible_outcomes"),
	hiddenTruths: list("hidden_truths"),

	scope: oneOf("scope", conflictScopes),
	status: oneOf("status", conflictStatuses),
	clarityOfRightWrong: oneOf("clarity_of_right_wrong", conflictClarity),
	currentTensionLevel: oneOf("tension_level", tensionLevels),

	natures: manyOf("natures", conflictNatures),
	questImpacts: manyOf("quest_impacts", questImpacts),
})

export const conflictParticipants = pgTable(
	"conflict_participants",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		npcId: nullableFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),

		conflictId: cascadeFk("conflict_id", conflicts.id),

		role: oneOf("role", participantRolesInConflict),

		motivation: string("motivation"),
		publicStance: string("public_stance"),

		secretStance: nullableString("secret_stance"),
	},
	(t) => [
		check(
			"npc_or_faction_participant_exclusive",
			sql`(${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL) OR (${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)`,
		),
	],
)
