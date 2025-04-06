import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { optionalId } from "./tool.utils" // Assuming optionalId might be needed

const {
	foreshadowingTables: { narrativeForeshadowing },
} = tables

// Define ForeshadowingTools type first
export type ForeshadowingTools = "manage_narrative_foreshadowing"

export const schemas = {
	manage_narrative_foreshadowing: createInsertSchema(narrativeForeshadowing, {
		id: optionalId.describe("The ID of the foreshadowing record to update (omit to create new)"),
		questStageId: (s) => s.optional().describe("ID of the quest stage where this foreshadowing appears (if any)"),
		siteId: (s) => s.optional().describe("ID of the site where this foreshadowing appears (if any)"),
		npcId: (s) => s.optional().describe("ID of the NPC involved in this foreshadowing (if any)"),
		factionId: (s) => s.optional().describe("ID of the faction involved in this foreshadowing (if any)"),
		name: (s) =>
			s.describe("A short, descriptive name for this foreshadowing hint (e.g., 'Mysterious Symbol on Wall')"),
		type: (s) => s.describe("The form the foreshadowing takes (document, conversation, object, etc.)"),
		description: (s) => s.describe("Detailed description of what the players observe or experience"),
		discoveryCondition: (s) =>
			s.describe("How players might discover this hint (e.g., 'Perception DC 15', 'Talk to Innkeeper')"),
		subtlety: (s) => s.describe("How obvious or hidden the hint is (obvious, moderate, subtle, hidden)"),
		narrativeWeight: (s) => s.describe("The importance of this hint to the story (minor, supporting, major, crucial)"),
		foreshadowsQuestId: (s) => s.optional().describe("ID of the quest this hint foreshadows (if any)"),
		foreshadowsTwistId: (s) => s.optional().describe("ID of the quest twist this hint foreshadows (if any)"),
		foreshadowsNpcId: (s) => s.optional().describe("ID of the NPC this hint relates to (if any)"),
		foreshadowsArcId: (s) => s.optional().describe("ID of the narrative arc this hint relates to (if any)"),
		foreshadowsElement: (s) => s.describe("Specific event, character trait, or plot point being hinted at"),
		discovered: (s) => s.optional().describe("Has this hint been discovered by the players yet? (Defaults to false)"),
		grantedToPlayers: (s) =>
			s.optional().describe("Timestamp when the hint was explicitly given to players (if applicable)"),
		playerNotes: (s) => s.optional().describe("GM notes on player reactions or theories about this hint"),
		gmNotes: (s) => s.optional().describe("General GM notes about this foreshadowing element"),
	})
		.strict()
		.describe("A hint or clue planted earlier in the narrative that suggests future events, twists, or revelations."),
} satisfies Record<ForeshadowingTools, z.ZodSchema<unknown>>
