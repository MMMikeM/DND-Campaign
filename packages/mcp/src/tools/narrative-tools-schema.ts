import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { id, optionalId } from "./tool.utils" // Added id import
import { NarrativeTools } from "./narrative-tools"

const {
	narrativeTables: { narrativeArcs, arcMembership, enums },
} = tables

export const schemas = {
	get_narrative_entity: z
		.object({
			type: z.enum(["narrative_arc", "arc_membership"]).describe("Type of narrative entity to retrieve"),
			id: optionalId.describe("ID of the entity to retrieve (optional)"),
		})
		.strict()
		.describe("Retrieve information about narrative arcs and their membership"),
	manage_narrative_arcs: createInsertSchema(narrativeArcs, {
		id: optionalId.describe("ID of narrative arc to manage (omit to create new, include alone to delete)"),
		name: (s) => s.describe("Distinctive identifying title for this storyline"),
		type: z.enum(enums.arcTypes).describe("Category of arc (main, faction, character, side)"),
		status: z.enum(enums.arcStatuses).describe("Current progress (planned, active, completed, abandoned)"),
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
		id: optionalId.describe("ID of membership record to manage (omit to create new, include alone to delete)"), // Already correct
		arcId: id.describe("ID of narrative arc this quest belongs to"),
		questId: id.describe("ID of quest that forms part of this arc"),
		role: z.enum(enums.questRoles).describe("Quest's function in the arc (introduction, complication, climax, etc.)"),
		notes: (s) => s.optional().describe("How this quest connects to the arc's broader themes"),
	})
		.strict()
		.describe("Links quests to narrative arcs, defining how individual adventures build toward larger stories"),
} satisfies Record<NarrativeTools, z.ZodSchema<unknown>>
