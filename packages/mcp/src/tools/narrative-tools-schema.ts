import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { optionalId } from "./tool.utils" // Assuming optionalId might be needed

const {
	narrativeTables: { narrativeArcs, arcMembership },
} = tables

// Define NarrativeTools type first
export type NarrativeTools = "manage_narrative_arcs" | "manage_arc_membership"

export const schemas = {
	manage_narrative_arcs: createInsertSchema(narrativeArcs, {
		id: optionalId.describe("The ID of the narrative arc to update (omit to create new)"),
		name: (s) => s.describe("The unique identifying name of the narrative arc"),
		type: (s) => s.describe("The category of the arc (main, faction, character, side)"),
		status: (s) => s.describe("Current status of the arc (planned, active, completed, abandoned)"),
		promise: (s) => s.describe("The initial hook, premise, or question that draws players in"),
		payoff: (s) => s.describe("The intended climax, resolution, or answer to the promise"),
		description: (s) => s.describe("Overall summary and key plot points of the arc in point form"),
		themes: (s) => s.describe("Major themes or concepts explored within this arc"),
		foreshadowingElements: (s) => s.describe("Specific hints or clues to plant early in the campaign"),
		creativePrompts: (s) => s.describe("Ideas for GMs to develop or integrate this arc"),
	})
		.strict()
		.describe("A major storyline or sequence of related quests forming a larger narrative structure."),

	manage_arc_membership: createInsertSchema(arcMembership, {
		id: optionalId.describe("The ID of the arc membership record to update (omit to create new)"),
		arcId: (s) => s.describe("The ID of the narrative arc this quest belongs to"),
		questId: (s) => s.describe("The ID of the quest that is part of this arc"),
		role: (s) => s.describe("The quest's narrative function within the arc (introduction, climax, etc.)"),
		notes: (s) => s.optional().describe("GM notes about this quest's specific role or connection to the arc"),
	})
		.strict()
		.describe("Defines how a specific quest fits into a larger narrative arc."),
} satisfies Record<NarrativeTools, z.ZodSchema<unknown>>
