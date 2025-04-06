import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { optionalId } from "./tool.utils"

const {
	foreshadowingTables: { narrativeForeshadowing },
} = tables

// Define ForeshadowingTools type first
export type ForeshadowingTools = "manage_narrative_foreshadowing"

export const schemas = {
	manage_narrative_foreshadowing: createInsertSchema(narrativeForeshadowing, {
		id: optionalId.describe("ID of foreshadowing hint to manage (omit to create new, include alone to delete)"),
		questStageId: (s) => s.optional().describe("ID of quest stage where this hint appears"),
		siteId: (s) => s.optional().describe("ID of site where this hint is encountered"),
		npcId: (s) => s.optional().describe("ID of NPC involved in delivering this hint"),
		factionId: (s) => s.optional().describe("ID of faction connected to this hint"),
		name: (s) => s.describe("Short, evocative title (e.g., 'Mysterious Symbol on Wall')"),
		type: (s) => s.describe("Delivery method (document, conversation, object, environmental, vision)"),
		description: (s) => s.describe("What players observe or experience when encountering this hint"),
		discoveryCondition: (s) => s.describe("How players might find this hint (e.g., 'Perception DC 15')"),
		subtlety: (s) => s.describe("How noticeable the hint is (obvious, moderate, subtle, hidden)"),
		narrativeWeight: (s) => s.describe("Importance to the story (minor, supporting, major, crucial)"),
		foreshadowsQuestId: (s) => s.optional().describe("ID of quest this hint points toward"),
		foreshadowsTwistId: (s) => s.optional().describe("ID of quest twist this hint suggests"),
		foreshadowsNpcId: (s) => s.optional().describe("ID of NPC this hint relates to"),
		foreshadowsArcId: (s) => s.optional().describe("ID of narrative arc this hint connects to"),
		foreshadowsElement: (s) => s.describe("Specific event, trait, or plot point being hinted at"),
		discovered: (s) => s.optional().describe("Whether players have found this hint yet"),
		grantedToPlayers: (s) => s.optional().describe("When the hint was explicitly given to players"),
		playerNotes: (s) => s.optional().describe("Player reactions or theories about this hint"),
		gmNotes: (s) => s.optional().describe("GM-only information about this foreshadowing element"),
	})
		.strict()
		.describe("Subtle clues that hint at future events, creating anticipation and narrative cohesion"),
} satisfies Record<ForeshadowingTools, z.ZodSchema<unknown>>
