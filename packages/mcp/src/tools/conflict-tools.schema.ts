import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	conflictTables: { majorConflicts, conflictParticipants, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.conflictTables>

export const tableEnum = ["majorConflicts", "conflictParticipants"] as const satisfies TableNames

export const schemas = {
	majorConflicts: createInsertSchema(majorConflicts, {
		gmNotes: (s) => s.describe("GM notes for this conflict"),
		tags: (s) => s.describe("Tags for this conflict"),
		description: (s) => s.describe("Core conflict elements and dynamics in point form"),
		stakes: (s) => s.describe("What each side stands to gain or lose"),
		possibleOutcomes: (s) => s.describe("Potential resolutions and their consequences"),
		hiddenTruths: (s) => s.describe("Secret factors unknown to most participants"),
		creativePrompts: (s) => s.describe("GM ideas for involving players in this conflict"),
		name: (s) => s.describe("Distinctive title for this conflict"),
		scope: (s) => s.describe("Geographic reach (local, regional, global)"),
		clarityOfRightWrong: (s) => s.describe("How clear the conflict is about right and wrong"),
		currentTensionLevel: (s) => s.describe("How tense the conflict is currently"),
		natures: (s) => s.describe("List of types (political, military, mystical, social, etc.)"),
		status: z
			.enum(enums.conflictStatuses)
			.describe("Current state (brewing, active, escalating, deescalating, resolved)"),
		cause: (s) => s.describe("Root event or situation that triggered the conflict"),
		primaryRegionId: optionalId.describe("ID of main region affected by this conflict"),
		moralDilemma: (s) => s.describe("Central ethical question posed by the conflict"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Large-scale struggles between factions that shape the campaign world and provide complex moral choices"),

	conflictParticipants: createInsertSchema(conflictParticipants, {
		gmNotes: (s) => s.describe("GM notes for this participant"),
		tags: (s) => s.describe("Tags for this participant"),
		conflictId: id.describe("ID of the major conflict this participant is involved in"),
		factionId: optionalId.describe(
			"ID of faction participating in the conflict (either factionId or npcId must be provided)",
		),
		npcId: optionalId.describe("ID of NPC participating in the conflict (either factionId or npcId must be provided)"),
		role: z
			.enum(enums.participantRolesInConflict)
			.describe("Role of the participant in the conflict (instigator, opponent, ally, neutral, etc.)"),
		creativePrompts: (s) => s.describe("GM ideas for involving players with this participant"),
		description: (s) => s.describe("Participant's involvement and dynamics in point form"),
		motivation: (s) => s.describe("Participant's reason for involvement in this conflict"),
		publicStance: (s) => s.describe("Officially stated position on the conflict"),
		secretStance: (s) => s.optional().describe("True hidden agenda, if different from public stance"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how factions or NPCs engage in conflicts, their allegiances, motivations, and roles")
		.refine((data) => (data.factionId !== undefined) !== (data.npcId !== undefined), {
			message: "Either factionId or npcId must be provided, but not both",
			path: ["factionId", "npcId"],
		}),
} as const satisfies Schema<TableNames[number]>
