// conflict/tables.ts
import { sql } from "drizzle-orm"
import { check, pgTable } from "drizzle-orm/pg-core"
import { cascadeFk, list, manyOf, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npc/tables"
import { regions } from "../regions/tables"
import { enums } from "./enums"

const { conflictClarity, conflictNatures, conflictScopes, conflictStatuses, participantRolesInConflict } = enums

export const majorConflicts = pgTable("major_conflicts", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	primaryRegionId: nullableFk("primary_region_id", regions.id),
	name: string("name").unique(),
	scope: oneOf("scope", conflictScopes),
	natures: manyOf("natures", conflictNatures),
	status: oneOf("status", conflictStatuses),

	cause: string("cause"),
	stakes: list("stakes"),

	moralDilemma: string("moral_dilemma"),
	possibleOutcomes: list("possible_outcomes"),
	hiddenTruths: list("hidden_truths"),

	clarityOfRightWrong: oneOf("clarity_of_right_wrong", conflictClarity),
	currentTensionLevel: oneOf("tension_level", ["low", "building", "high", "breaking"]),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const conflictParticipants = pgTable(
	"conflict_participants",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		conflictId: cascadeFk("conflict_id", majorConflicts.id),

		npcId: nullableFk("npc_id", npcs.id),
		factionId: nullableFk("faction_id", factions.id),

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

export { enums } from "./enums"
