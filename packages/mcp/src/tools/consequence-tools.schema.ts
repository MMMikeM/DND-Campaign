import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	consequenceTables: { consequences, enums },
} = tables

const {
	consequenceSources,
	consequenceTimeframe,
	consequenceVisibility,
	impactSeverity,
	consequenceTypes,
	playerImpactFeels,
} = enums

type TableNames = CreateTableNames<typeof tables.consequenceTables>

export const tableEnum = ["consequences"] as const satisfies TableNames

export const schemas = {
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
		affectedAreaId: optionalId.describe("The ID of the area that this consequence impacts."),
		affectedRegionId: optionalId.describe("The ID of the region that this consequence impacts."),
		affectedSiteId: optionalId.describe("The ID of the site that this consequence impacts."),
		affectedFactionId: optionalId.describe("The ID of the faction that this consequence impacts."),
		affectedNpcId: optionalId.describe("The ID of the NPC that this consequence impacts."),
		affectedQuestId: optionalId.describe("The ID of the quest that this consequence impacts."),
		affectedConflictId: optionalId.describe("The ID of the conflict that this consequence impacts."),
		affectedConsequenceId: optionalId.describe("The ID of the consequence that this consequence impacts."),
		complicationDetails: list.describe("The details of the complication that this consequence impacts."),
		escalationDetails: list.describe("The details of the escalation that this consequence impacts."),
		twistRevealDetails: list.describe("The details of the twist reveal that this consequence impacts."),

		triggerQuestId: optionalId.describe("The ID of the quest that caused this consequence."),
		triggerQuestStageDecisionId: optionalId.describe(
			"The ID of the quest stage decision that caused this consequence.",
		),
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
		),
} as const satisfies Schema<TableNames[number]>
