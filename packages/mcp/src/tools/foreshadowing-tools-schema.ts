import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./tool.utils"

const {
	foreshadowingTables: { narrativeForeshadowing, enums },
} = tables

export type TableNames = CreateTableNames<typeof tables.foreshadowingTables>

export const tableEnum = ["narrativeForeshadowing"] as const satisfies TableNames

export const schemas = {
	narrativeForeshadowing: createInsertSchema(narrativeForeshadowing, {
		id: id.describe("ID of foreshadowing hint to update"),
		questStageId: optionalId.describe("ID of quest stage where this hint appears"),
		siteId: optionalId.describe("ID of site where this hint is encountered"),
		npcId: optionalId.describe("ID of NPC involved in delivering this hint"),
		factionId: optionalId.describe("ID of faction connected to this hint"),
		name: (s) => s.describe("Short, evocative title (e.g., 'Mysterious Symbol on Wall')"),
		type: z
			.enum(enums.foreshadowingTypes)
			.describe("Delivery method (document, conversation, object, environmental, vision)"),
		description: (s) => s.describe("What players observe or experience when encountering this hint"),
		discoveryCondition: (s) => s.describe("How players might find this hint (e.g., 'Perception DC 15')"),
		subtlety: z
			.enum(enums.foreshadowingSubtlety)
			.describe("How noticeable the hint is (obvious, moderate, subtle, hidden)"),
		narrativeWeight: z
			.enum(enums.narrativeWeight)
			.describe("Importance to the story (minor, supporting, major, crucial)"),
		foreshadowsQuestId: optionalId.describe("ID of quest this hint points toward"),
		foreshadowsTwistId: optionalId.describe("ID of quest twist this hint suggests"),
		foreshadowsNpcId: optionalId.describe("ID of NPC this hint relates to"),
		foreshadowsArcId: optionalId.describe("ID of narrative arc this hint connects to"),
		foreshadowsElement: (s) => s.describe("Specific event, trait, or plot point being hinted at"),
		discovered: (s) => s.optional().describe("Whether players have found this hint yet"),
		grantedToPlayers: (s) => s.optional().describe("When the hint was explicitly given to players"),
		playerNotes: (s) => s.optional().describe("Player reactions or theories about this hint"),
		gmNotes: (s) => s.optional().describe("GM-only information about this foreshadowing element"),
	})
		.omit({ id: true })
		.strict()
		.describe("Subtle clues that hint at future events, creating anticipation and narrative cohesion"),
} as const satisfies Schema<TableNames[number]>
