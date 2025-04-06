import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { optionalId } from "./tool.utils"

const {
	narrativeTables: { narrativeArcs, arcMembership },
} = tables

export type NarrativeTools = "manage_narrative_arcs" | "manage_arc_membership"

export const schemas = {
	manage_narrative_arcs: createInsertSchema(narrativeArcs, {
		id: optionalId.describe("ID of narrative arc to manage (omit to create new, include alone to delete)"),
		name: (s) => s.describe("Distinctive identifying title for this storyline"),
		type: (s) => s.describe("Category of arc (main, faction, character, side)"),
		status: (s) => s.describe("Current progress (planned, active, completed, abandoned)"),
		promise: (s) => s.describe("Initial hook or premise that engages players"),
		payoff: (s) => s.describe("Intended climax or resolution that fulfills the promise"),
		description: (s) => s.describe("Key plot points and narrative beats in point form"),
		themes: (s) => s.describe("Major concepts and motifs explored in this arc"),
		foreshadowingElements: (s) => s.describe("Hints and clues to plant early in the campaign"),
		creativePrompts: (s) => s.describe("Ideas for developing and integrating this arc"),
	})
		.strict()
		.describe("Major storylines that span multiple quests, providing campaign structure and thematic depth"),

	manage_arc_membership: createInsertSchema(arcMembership, {
		id: optionalId.describe("ID of membership record to manage (omit to create new, include alone to delete)"),
		arcId: (s) => s.describe("ID of narrative arc this quest belongs to"),
		questId: (s) => s.describe("ID of quest that forms part of this arc"),
		role: (s) => s.describe("Quest's function in the arc (introduction, complication, climax, etc.)"),
		notes: (s) => s.optional().describe("How this quest connects to the arc's broader themes"),
	})
		.strict()
		.describe("Links quests to narrative arcs, defining how individual adventures build toward larger stories"),
} satisfies Record<NarrativeTools, z.ZodSchema<unknown>>
