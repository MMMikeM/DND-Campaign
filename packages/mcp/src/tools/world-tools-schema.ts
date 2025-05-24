import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, optionalId, type Schema } from "./tool.utils"

const {
	worldTables: { worldStateChanges, enums },
} = tables

export type TableNames = CreateTableNames<typeof tables.worldTables>

export const tableEnum = ["worldStateChanges"] as const satisfies TableNames

export const schemas = {
	worldStateChanges: createInsertSchema(worldStateChanges, {
		name: (s) => s.describe("A unique, descriptive title for this world state change"),
		description: (s) => s.describe("Detailed description of the change and its immediate effects in point form"),
		questId: optionalId.describe("ID of the quest that triggered this change (if applicable)"),
		decisionId: optionalId.describe("ID of the stage decision that triggered this change (if applicable)"),
		conflictId: optionalId.describe("ID of the major conflict related to this change (if applicable)"),
		factionId: optionalId.describe("ID of the primary faction affected by this change (if any)"),
		regionId: optionalId.describe("ID of the primary region affected by this change (if any)"),
		areaId: optionalId.describe("ID of the primary area affected by this change (if any)"),
		siteId: optionalId.describe("ID of the primary site affected by this change (if any)"),
		npcId: optionalId.describe("ID of the primary NPC affected by this change (if any)"),
		futureQuestId: optionalId.describe("ID of a future quest planned as a consequence of this change (if any)"),
		recordedDate: (s) => z.string().optional().describe("Timestamp when this change was recorded (defaults to now)"),
		isResolved: (s) =>
			s.describe("Has the impact of this change been fully addressed or concluded? (Defaults to false)"),
		creativePrompts: (s) => s.describe("Ideas for GMs on how to showcase or follow up on this change"),
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
		.omit({ id: true })
		.strict()
		.describe(
			"Represents a significant alteration to the game world resulting from player actions, quest outcomes, or events.",
		),
} as const satisfies Schema<TableNames[number]>
