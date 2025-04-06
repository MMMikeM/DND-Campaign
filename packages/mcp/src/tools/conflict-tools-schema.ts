import { createInsertSchema } from "drizzle-zod";
import { tables } from "@tome-master/shared";
import { z } from "zod";
import { optionalId } from "./tool.utils"; // Assuming optionalId might be needed

const {
  conflictTables: { majorConflicts, conflictParticipants, conflictProgression },
} = tables;

// Define ConflictTools type first
export type ConflictTools =
  | "manage_major_conflicts"
  | "manage_conflict_participants"
  | "manage_conflict_progression";

export const schemas = {
  manage_major_conflicts: createInsertSchema(majorConflicts, {
    id: optionalId.describe("The ID of the conflict to update (omit to create new)"),
    description: (s) => s.describe("Detailed narrative description of the conflict in point form"),
    stakes: (s) => s.describe("What is at risk or could be gained/lost in this conflict"),
    possibleOutcomes: (s) => s.describe("Potential resolutions or end states for the conflict"),
    hiddenTruths: (s) => s.describe("Concealed facts or underlying realities about the conflict"),
    creativePrompts: (s) => s.describe("Ideas for GMs to develop or integrate this conflict"),
    name: (s) => s.describe("The unique identifying name of the major conflict"),
    scope: (s) => s.describe("Geographical or influential reach (local, regional, global)"),
    nature: (s) => s.describe("The primary domain of the conflict (political, military, mystical, etc.)"),
    status: (s) => s.describe("Current state of the conflict (brewing, active, resolved, etc.)"),
    cause: (s) => s.describe("The root cause or trigger event for the conflict"),
    primaryRegionId: (s) => s.optional().describe("The ID of the main region affected by this conflict (if any)"),
    moralDilemma: (s) => s.describe("The central ethical question or challenge posed by the conflict"),
  })
    .strict()
    .describe("A large-scale struggle or dispute involving multiple factions or significant stakes"),

  manage_conflict_participants: createInsertSchema(conflictParticipants, {
    id: optionalId.describe("The ID of the participant record to update (omit to create new)"),
    conflictId: (s) => s.describe("The ID of the major conflict this entity is participating in"),
    factionId: (s) => s.describe("The ID of the faction involved in the conflict"),
    role: (s) => s.describe("The faction's role in the conflict (instigator, opponent, ally, etc.)"),
    motivation: (s) => s.describe("The reason or driving force behind this faction's involvement"),
    publicStance: (s) => s.describe("The officially stated position or viewpoint of the faction"),
    secretStance: (s) => s.optional().describe("The faction's true, hidden position or agenda (if different)"),
    resources: (s) => s.describe("Assets, personnel, or influence the faction contributes or utilizes"),
  })
    .strict()
    .describe("Defines a faction's involvement, role, and motivations within a major conflict"),

  manage_conflict_progression: createInsertSchema(conflictProgression, {
    id: optionalId.describe("The ID of the progression record to update (omit to create new)"),
    conflictId: (s) => s.describe("The ID of the major conflict being affected"),
    questId: (s) => s.describe("The ID of the quest that influences the conflict's progression"),
    impact: (s) => s.describe("How the quest's outcome affects the conflict (escalates, deescalates, etc.)"),
    notes: (s) => s.describe("GM notes detailing the connection and impact"),
  })
    .strict()
    .describe("Links a quest to a major conflict, detailing how the quest impacts the conflict's progression"),

} satisfies Record<ConflictTools, z.ZodSchema<unknown>>;
