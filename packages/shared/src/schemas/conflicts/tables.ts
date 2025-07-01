// conflicts/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
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
} = enums

export const conflicts = pgTable("conflicts", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	tags: list("tags"),

	regionId: nullableFk("region_id", regions.id),

	cause: string("cause"),
	moralDilemma: string("moral_dilemma"),

	stakes: list("stakes"),
	possibleOutcomes: list("possible_outcomes"),
	hiddenTruths: list("hidden_truths"),

	scope: oneOf("scope", conflictScopes),
	status: oneOf("status", conflictStatuses),
	clarityOfRightWrong: oneOf("clarity_of_right_wrong", conflictClarity),
	currentTensionLevel: oneOf("tension_level", tensionLevels),
	nature: oneOf("nature", conflictNatures),
})

export const conflictParticipants = pgTable(
	"conflict_participants",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		conflictId: cascadeFk("conflict_id", conflicts.id),

		npcId: nullableFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),

		role: oneOf("role", participantRolesInConflict),

		motivation: string("motivation"),
		publicStance: string("public_stance"),

		secretStance: nullableString("secret_stance"),
	},
	(t) => [
		unique().on(t.conflictId, t.npcId),
		unique().on(t.conflictId, t.factionId),
		check(
			"npc_or_faction_participant_exclusive",
			sql`(${t.npcId} IS NOT NULL AND ${t.factionId} IS NULL) OR (${t.npcId} IS NULL AND ${t.factionId} IS NOT NULL)`,
		),
	],
)
