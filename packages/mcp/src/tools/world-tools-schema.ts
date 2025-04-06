import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { optionalId } from "./tool.utils"

const {
	worldTables: { worldStateChanges, enums },
} = tables

// Define WorldTools type first
export type WorldTools = "manage_world_state_changes"

export const schemas = {
	manage_world_state_changes: createInsertSchema(worldStateChanges, {
		id: optionalId.describe("The ID of the world state change record to update (omit to create new)"),
		name: (s) => s.describe("A unique, descriptive title for this world state change"),
		description: (s) => s.describe("Detailed description of the change and its immediate effects in point form"),

		questId: (s) => s.optional().describe("ID of the quest that triggered this change (if applicable)"),
		decisionId: (s) => s.optional().describe("ID of the stage decision that triggered this change (if applicable)"),
		conflictId: (s) => s.optional().describe("ID of the major conflict related to this change (if applicable)"),
		factionId: (s) => s.optional().describe("ID of the primary faction affected by this change (if any)"),
		regionId: (s) => s.optional().describe("ID of the primary region affected by this change (if any)"),
		areaId: (s) => s.optional().describe("ID of the primary area affected by this change (if any)"),
		siteId: (s) => s.optional().describe("ID of the primary site affected by this change (if any)"),
		npcId: (s) => s.optional().describe("ID of the primary NPC affected by this change (if any)"),
		recordedDate: (s) => s.optional().describe("Timestamp when this change was recorded (defaults to now)"),
		futureQuestId: (s) =>
			s.optional().describe("ID of a future quest planned as a consequence of this change (if any)"),
		isResolved: optionalId.describe(
			"Has the impact of this change been fully addressed or concluded? (Defaults to false)",
		),
		creativePrompts: (s) => s.optional().describe("Ideas for GMs on how to showcase or follow up on this change"),
		gmNotes: (s) => s.optional().describe("General GM notes about this world state change"),
		changeType: z
			.enum(enums.changeTypes)
			.describe("The category of change (faction power shift, environmental, political, etc.)"),
		severity: z
			.enum(enums.changeSeverity)
			.describe("The magnitude of the change's impact (minor, moderate, major, campaign-defining)"),
		visibility: z
			.enum(enums.changeVisibility)
			.describe("How apparent the change is to players (obvious, subtle, hidden)"),
		timeframe: z
			.enum(enums.changeTimeframe)
			.describe("When the change takes effect (immediate, next session, later, etc.)"),
		sourceType: z
			.enum(enums.sourcesOfChange)
			.describe("What triggered the change (decision, quest completion, world event, etc.)"),
	})
		.strict()
		.describe(
			"Represents a significant alteration to the game world resulting from player actions, quest outcomes, or events.",
		),
} satisfies Record<WorldTools, z.ZodSchema<unknown>>
