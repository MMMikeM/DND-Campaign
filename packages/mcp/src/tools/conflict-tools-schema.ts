import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, type Schema } from "./tool.utils"

const {
	conflictTables: { majorConflicts, conflictParticipants, conflictProgression, enums },
} = tables

export type TableNames = CreateTableNames<typeof tables.conflictTables>

export const tableEnum = ["majorConflicts", "conflictParticipants", "conflictProgression"] as const satisfies TableNames

export const schemas = {
	majorConflicts: createInsertSchema(majorConflicts, {
		id: id.describe("ID of conflict to update"),
		description: (s) => s.describe("Core conflict elements and dynamics in point form"),
		stakes: (s) => s.describe("What each side stands to gain or lose"),
		possibleOutcomes: (s) => s.describe("Potential resolutions and their consequences"),
		hiddenTruths: (s) => s.describe("Secret factors unknown to most participants"),
		creativePrompts: (s) => s.describe("GM ideas for involving players in this conflict"),
		name: (s) => s.describe("Distinctive title for this conflict"),
		scope: (s) => s.describe("Geographic reach (local, regional, global)"),
		nature: z.enum(enums.conflictNatures).describe("Primary type (political, military, mystical, social, etc.)"),
		status: z
			.enum(enums.conflictStatuses)
			.describe("Current state (brewing, active, escalating, deescalating, resolved)"),
		cause: (s) => s.describe("Root event or situation that triggered the conflict"),
		primaryRegionId: id.describe("ID of main region affected by this conflict"),
		moralDilemma: (s) => s.describe("Central ethical question posed by the conflict"),
	})
		.omit({ id: true })
		.strict()
		.describe("Large-scale struggles between factions that shape the campaign world and provide complex moral choices"),

	conflictParticipants: createInsertSchema(conflictParticipants, {
		id: id.describe("ID of participant record to update"),
		conflictId: id.describe("ID of the major conflict this faction is involved in"),
		factionId: id.describe("ID of faction participating in the conflict"),
		role: z.enum(enums.factionRoles).describe("Faction's position (instigator, opponent, ally, neutral, mediator)"),
		motivation: (s) => s.describe("Faction's reason for involvement in this conflict"),
		publicStance: (s) => s.describe("Officially stated position on the conflict"),
		secretStance: (s) => s.optional().describe("True hidden agenda, if different from public stance"),
		resources: (s) => s.describe("Assets and capabilities the faction commits to this conflict"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how factions engage in conflicts, their allegiances, motivations, and committed resources"),

	conflictProgression: createInsertSchema(conflictProgression, {
		id: id.describe("ID of progression record to update"),
		conflictId: id.describe("ID of major conflict being affected"),
		questId: id.describe("ID of quest that influences this conflict"),
		impact: z
			.enum(enums.questImpacts)
			.describe("Effect on conflict (escalates, deescalates, reveals_truth, changes_sides)"),
		notes: (s) => s.describe("GM details on how quest outcomes affect conflict dynamics"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links quests to conflicts, showing how player actions shift the balance of larger struggles"),
} as const satisfies Schema<TableNames[number]>
