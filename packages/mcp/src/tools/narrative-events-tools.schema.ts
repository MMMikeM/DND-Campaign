import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	narrativeEventTables: { narrativeEvents, consequences, enums },
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

type TableNames = CreateTableNames<typeof tables.narrativeEventTables>

export const tableEnum = ["narrativeEvents", "consequences"] as const satisfies TableNames

export const schemas = {
	narrativeEvents: createInsertSchema(narrativeEvents, {
		name: (s) =>
			s.describe("A short, evocative name for the event (e.g., 'The Oracle's Gambit', 'Ambush at the Crossroads')."),
		description: list.describe("The objective facts of the event, like stage directions. What happens, step-by-step?"),
		creativePrompts: list.describe(
			"Flavor and execution ideas. What sensory details, dialogue snippets, or specific character actions can make this moment pop?",
		),
		gmNotes: list.describe(
			"The 'why' behind the event. What is its narrative purpose? What are potential player reactions and your contingencies? What secrets does it protect or reveal?",
		),
		eventType: z
			.enum(eventTypes)
			.describe(
				"The mechanical function of this plot beat. Is it a 'Yes, but...' (Complication), a 'No, and...' (Escalation), or a re-framing of the goal (Twist)?",
			),
		complication_details: (s) =>
			s
				.optional()
				.describe(
					"The '...but' part of the 'Yes, but...' equation. The unexpected problem that arises from a success.",
				),
		escalation_details: (s) =>
			s
				.optional()
				.describe("The '...and' part of the 'No, and...' equation. The new problem that makes a failure even worse."),
		twist_reveal_details: (s) =>
			s
				.optional()
				.describe(
					"The new reality or changed context. How does this moment alter the nature of the quest, the characters' goals, or the payoff they are seeking?",
				),
		intendedRhythmEffect: z
			.enum(rhythmEffects)
			.describe("The intended emotional and pacing goal for the players. What should this moment make them *feel*?"),
		narrativePlacement: z
			.enum(narrativePlacements)
			.describe(
				"Where in the story's structure this beat belongs. Early (Inciting Incident), Middle (Rising Action/Midpoint), Climax (Final Confrontation), or Denouement (Falling Action).",
			),
		impactSeverity: z
			.enum(impactSeverity)
			.describe(
				"How much this event disrupts the story. Minor (a scene), Moderate (a quest), or Major (an entire narrative arc).",
			),
		relatedQuestId: optionalId.describe("Links this event to the overall Quest it serves, providing context."),
		questStageId: optionalId.describe(
			"Pinpoints the specific stage/scene of a Quest where this event is most likely to occur.",
		),
		triggeringStageDecisionId: optionalId.describe(
			"The specific player choice that directly causes this event to happen.",
		),

		tags: (s) => s.describe("Keywords for searching and filtering (e.g., 'combat', 'social', 'betrayal', 'mystery')."),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"A micro-level plot beat. The 'Oh shit!' moments, revelations, and setbacks that create progress and drive the story forward within a quest.",
		)
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
		name: (s) =>
			s.describe(
				"A clear, descriptive name for the outcome (e.g., 'The City Guard's Grudge', 'Famine in the West', 'The Iron Pact is Broken').",
			),
		description: (s) =>
			s.describe("The objective outcome of the consequence. What is the new state of the world, NPC, or faction?"),
		creativePrompts: (s) =>
			s.describe(
				"Ideas for showing, not just telling, this consequence. How do players encounter this change in the world? Through rumors, a changed NPC attitude, a new environmental effect?",
			),
		gmNotes: (s) =>
			s.describe(
				"Mechanical impacts and long-term plans. What stat blocks change? What new events might this consequence trigger later? What is the secret fallout?",
			),

		consequenceType: z
			.enum(consequenceTypes)
			.describe("The *domain* of the change. What aspect of the game world is being altered?"),
		severity: z
			.enum(impactSeverity)
			.describe(
				"The magnitude of the change. Is it a minor inconvenience, a regional issue, or a world-altering shift?",
			),
		visibility: z
			.enum(consequenceVisibility)
			.describe(
				"How apparent the consequence is to the players. Obvious (they see it happen), Subtle (they might notice if they're perceptive), or Hidden (a 'time bomb' for a later reveal).",
			),
		timeframe: z
			.enum(consequenceTimeframe)
			.describe(
				"When the consequence manifests. Immediately, soon, or much later? 'Specific Trigger' allows it to be contingent on another future event.",
			),

		sourceType: z
			.enum(consequenceSources)
			.describe(
				"The ultimate cause of this change. Was it a specific 'Decision', the result of a 'Quest Completion', or an autonomous 'World Event' that happens regardless of player action?",
			),
		playerImpactFeel: z
			.enum(playerImpactFeels)
			.describe(
				"The intended emotional reaction for the players. Is this an 'Empowering Reward', a 'Challenging Setback', or a 'Just Consequence' for their actions?",
			),

		triggerEntityType: z
			.enum(consequenceTriggerTypes)
			.describe("The specific type of in-game element that caused this consequence."),

		affectedEntityType: z
			.enum(consequenceAffectedEntityTypes)
			.describe("The specific type of in-game element that this consequence impacts."),
		affectedEntityId: id.describe("The ID of the entity that this consequence impacts."),
		triggerEntityId: id.describe("The ID of the entity that caused this consequence."),
		conflictImpactDescription: (s) =>
			s
				.optional()
				.describe(
					"Crucial link: How does this consequence specifically affect the 'Big P Plot' of the main conflict? (e.g., 'This gives the Shadow Empire a new staging ground for their invasion').",
				),
		tags: (s) =>
			s.describe(
				"Keywords for searching and filtering (e.g., 'political', 'environmental', 'reputation', 'faction_A').",
			),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"The ripple effects of player actions and world events. Consequences are how the world responds to the story, making player choices feel meaningful and the world feel alive.",
		)
		.refine(
			(data) => {
				if (data.triggerEntityType === "conflict") return data.conflictImpactDescription !== undefined
				return true
			},
			{
				message: "Conflict impact description is required when trigger entity type is conflict",
				path: ["triggerEntityType"],
			},
		),
} as const satisfies Schema<TableNames[number]>
