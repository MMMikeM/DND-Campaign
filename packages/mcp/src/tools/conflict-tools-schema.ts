import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { optionalId } from "./tool.utils"

const {
	conflictTables: { majorConflicts, conflictParticipants, conflictProgression },
} = tables

// Define ConflictTools type first
export type ConflictTools = "manage_major_conflicts" | "manage_conflict_participants" | "manage_conflict_progression"

export const schemas = {
	manage_major_conflicts: createInsertSchema(majorConflicts, {
		id: optionalId.describe("ID of conflict to manage (omit to create new, include alone to delete)"),
		description: (s) => s.describe("Core conflict elements and dynamics in point form"),
		stakes: (s) => s.describe("What each side stands to gain or lose"),
		possibleOutcomes: (s) => s.describe("Potential resolutions and their consequences"),
		hiddenTruths: (s) => s.describe("Secret factors unknown to most participants"),
		creativePrompts: (s) => s.describe("GM ideas for involving players in this conflict"),
		name: (s) => s.describe("Distinctive title for this conflict"),
		scope: (s) => s.describe("Geographic reach (local, regional, global)"),
		nature: (s) => s.describe("Primary type (political, military, mystical, social, etc.)"),
		status: (s) => s.describe("Current state (brewing, active, escalating, deescalating, resolved)"),
		cause: (s) => s.describe("Root event or situation that triggered the conflict"),
		primaryRegionId: (s) => s.optional().describe("ID of main region affected by this conflict"),
		moralDilemma: (s) => s.describe("Central ethical question posed by the conflict"),
	})
		.strict()
		.describe("Large-scale struggles between factions that shape the campaign world and provide complex moral choices"),

	manage_conflict_participants: createInsertSchema(conflictParticipants, {
		id: optionalId.describe("ID of participant record to manage (omit to create new, include alone to delete)"),
		conflictId: (s) => s.describe("ID of the major conflict this faction is involved in"),
		factionId: (s) => s.describe("ID of faction participating in the conflict"),
		role: (s) => s.describe("Faction's position (instigator, opponent, ally, neutral, mediator)"),
		motivation: (s) => s.describe("Faction's reason for involvement in this conflict"),
		publicStance: (s) => s.describe("Officially stated position on the conflict"),
		secretStance: (s) => s.optional().describe("True hidden agenda, if different from public stance"),
		resources: (s) => s.describe("Assets and capabilities the faction commits to this conflict"),
	})
		.strict()
		.describe("Defines how factions engage in conflicts, their allegiances, motivations, and committed resources"),

	manage_conflict_progression: createInsertSchema(conflictProgression, {
		id: optionalId.describe("ID of progression record to manage (omit to create new, include alone to delete)"),
		conflictId: (s) => s.describe("ID of major conflict being affected"),
		questId: (s) => s.describe("ID of quest that influences this conflict"),
		impact: (s) => s.describe("Effect on conflict (escalates, deescalates, reveals_truth, changes_sides)"),
		notes: (s) => s.describe("GM details on how quest outcomes affect conflict dynamics"),
	})
		.strict()
		.describe("Links quests to conflicts, showing how player actions shift the balance of larger struggles"),
} satisfies Record<ConflictTools, z.ZodSchema<unknown>>
