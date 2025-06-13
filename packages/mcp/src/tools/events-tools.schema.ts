import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, optionalId, type Schema } from "./utils/tool.utils"

const {
	eventTables: { narrativeEvents, consequences, enums },
} = tables

const {
	consequenceAffectedEntityTypes,
	consequenceSources,
	consequenceTimeframe,
	consequenceVisibility,
	impactSeverity,
	rhythmEffects,
	consequenceTriggerTypes,
	consequenceTypes,
	eventTypes,
	narrativePlacements,
	playerImpactFeels,
} = enums

type TableNames = CreateTableNames<typeof tables.eventTables>

export const tableEnum = ["narrativeEvents", "consequences"] as const satisfies TableNames

export const schemas = {
	narrativeEvents: createInsertSchema(narrativeEvents, {
		complication_details: (s) => s.optional().describe("Specific details if eventType is 'complication'"),
		creativePrompts: (s) => s.describe("Ideas for GMs to implement or enhance this event"),
		description: (s) => s.describe("Detailed description of the event in point form"),
		escalation_details: (s) => s.optional().describe("Specific details if eventType is 'escalation'"),
		eventType: z.enum(eventTypes).describe("Type of event (complication, escalation, twist)"),
		gmNotes: (s) => s.describe("GM-only notes about running this event effectively"),
		impactSeverity: z.enum(impactSeverity).describe("Magnitude of the event's impact (minor, moderate, major)"),
		intendedRhythmEffect: z.enum(rhythmEffects).describe("The intended rhythm effect of the event"),
		name: (s) => s.describe("Unique name for this narrative event"),
		narrativePlacement: z
			.enum(narrativePlacements)
			.describe("When the event typically occurs in a narrative arc (early, middle, climax, denouement)"),
		questStageId: optionalId.describe("ID of the quest stage where this event primarily occurs (if applicable)"),
		relatedQuestId: optionalId.describe("ID of the quest this event relates to broadly (if applicable)"),
		tags: (s) => s.describe("Tags for this narrative event"),
		triggeringDecisionId: optionalId.describe("ID of the stage decision that triggers this event (if applicable)"),
		twist_reveal_details: (s) => s.optional().describe("Specific details if eventType is 'twist'"),
	})
		.omit({ id: true })
		.strict()
		.describe("Narrative events like complications, escalations, or twists that affect the story")
		.refine(
			(data) => {
				if (data.eventType === "complication") return data.complication_details !== undefined
				if (data.eventType === "escalation") return data.escalation_details !== undefined
				if (data.eventType === "twist") return data.twist_reveal_details !== undefined
				return true
			},
			{
				message: "Event type must have corresponding details field populated",
				path: ["eventType"],
			},
		),

	consequences: createInsertSchema(consequences, {
		affectedEntityType: z.enum(consequenceAffectedEntityTypes).describe("Type of entity affected by this consequence"),
		triggerEntityType: z.enum(consequenceTriggerTypes).describe("Type of entity that triggers this consequence"),
		affectedAreaId: optionalId.describe("ID of the area that is affected by this consequence"),
		affectedConflictId: optionalId.describe("ID of the conflict that is affected by this consequence"),
		affectedDestinationId: optionalId.describe("ID of the narrative destination that is affected by this consequence"),
		affectedFactionId: optionalId.describe("ID of the faction that is affected by this consequence"),
		affectedNpcId: optionalId.describe("ID of the NPC that is affected by this consequence"),
		affectedRegionId: optionalId.describe("ID of the region that is affected by this consequence"),
		affectedSiteId: optionalId.describe("ID of the site that is affected by this consequence"),
		conflictImpactDescription: (s) =>
			s
				.optional()
				.describe(
					"Description of the impact of this consequence on the conflict (required if affectedConflictId is set)",
				),
		consequenceType: z.enum(consequenceTypes).describe("Type of the consequence"),
		creativePrompts: (s) => s.describe("Ideas for GMs to implement or enhance this consequence"),
		description: (s) => s.describe("Detailed description of the consequence in point form"),
		futureQuestId: optionalId.describe("ID of the future quest that is affected by this consequence"),
		gmNotes: (s) => s.describe("GM-only notes about running this consequence effectively"),
		name: (s) => s.describe("Name of the consequence"),
		playerImpactFeel: z.enum(playerImpactFeels).describe("How the player feels about this consequence"),
		severity: z.enum(impactSeverity).describe("Severity of the consequence"),
		sourceType: z.enum(consequenceSources).describe("Type of the source of the consequence"),
		tags: (s) => s.describe("Tags for this consequence"),
		timeframe: z.enum(consequenceTimeframe).describe("Timeframe of the consequence"),
		triggerConflictId: optionalId.describe("ID of the conflict that triggers this consequence"),
		triggerDecisionId: optionalId.describe("ID of the decision that triggers this consequence"),
		triggerQuestId: optionalId.describe("ID of the quest that triggers this consequence"),
		visibility: z.enum(consequenceVisibility).describe("Visibility of the consequence"),
	})
		.omit({ id: true })
		.strict()
		.describe("Consequences that affect the game world")
		.refine(
			(data) => {
				// Must have at least one trigger source or be a world event/player choice/time passage
				const hasTrigger = data.triggerDecisionId || data.triggerQuestId || data.triggerConflictId
				const isWorldEvent = [
					"world_event",
					"player_choice",
					"time_passage",
					"quest_completion_affecting_conflict",
				].includes(data.sourceType)
				return hasTrigger || isWorldEvent
			},
			{
				message: "Consequence must have a trigger source or be a world event type",
				path: ["sourceType"],
			},
		)
		.refine(
			(data) => {
				// Must have at least one effect defined
				return (
					data.affectedFactionId ||
					data.affectedRegionId ||
					data.affectedAreaId ||
					data.affectedSiteId ||
					data.affectedNpcId ||
					data.affectedDestinationId ||
					data.affectedConflictId ||
					data.futureQuestId
				)
			},
			{
				message: "Consequence must have at least one effect defined",
				path: ["consequenceType"],
			},
		)
		.refine(
			(data) => {
				// If affecting a conflict, must have impact description
				return !data.affectedConflictId || data.conflictImpactDescription
			},
			{
				message: "Conflict impact description required when affecting a conflict",
				path: ["conflictImpactDescription"],
			},
		),
} as const satisfies Schema<TableNames[number]>
