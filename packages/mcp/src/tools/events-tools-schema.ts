import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./tool.utils"

const {
	eventTables: { narrativeEvents, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.eventTables>

export const tableEnum = ["narrativeEvents"] as const satisfies TableNames

export const schemas = {
	narrativeEvents: createInsertSchema(narrativeEvents, {
		id: id.describe("ID of the narrative event to update"),
		name: (s) => s.describe("Unique name for this narrative event"),
		eventType: z.enum(enums.eventTypes).describe("Type of event (complication, escalation, twist)"),
		questStageId: optionalId.describe("ID of the quest stage where this event primarily occurs (if applicable)"),
		triggeringDecisionId: optionalId.describe("ID of the stage decision that triggers this event (if applicable)"),
		relatedQuestId: optionalId.describe("ID of the quest this event relates to broadly (if applicable)"),
		description: (s) => s.describe("Detailed description of the event in point form"),
		narrativePlacement: z
			.enum(enums.narrativePlacements)
			.describe("When the event typically occurs in a narrative arc (early, middle, climax, denouement)"),
		impactSeverity: z.enum(enums.impactSeverities).describe("Magnitude of the event's impact (minor, moderate, major)"),
		complication_details: (s) => s.describe("Specific details if eventType is 'complication'"),
		escalation_details: (s) => s.describe("Specific details if eventType is 'escalation'"),
		twist_reveal_details: (s) => s.describe("Specific details if eventType is 'twist'"),
		creativePrompts: (s) => s.describe("Ideas for GMs to implement or enhance this event"),
		gmNotes: (s) => s.describe("GM-only notes about running this event effectively"),
	})
		.omit({ id: true }) // ID is not part of input data for create/update
		.strict()
		.describe("Narrative events like complications, escalations, or twists that affect the story."),
} as const satisfies Schema<TableNames[number]>
