import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	conflictTables: { conflicts, conflictParticipants, enums },
} = tables

const {
	conflictClarity,
	conflictNatures,
	conflictScopes,
	conflictStatuses,
	participantRolesInConflict,
	questImpacts,
	tensionLevels,
} = enums

type TableNames = CreateTableNames<typeof tables.conflictTables>

export const tableEnum = ["conflicts", "conflictParticipants"] as const satisfies TableNames

export const schemas = {
	conflicts: createInsertSchema(conflicts, {
		name: (s) =>
			s.describe(
				"A short, evocative title that sets the tone for the entire struggle (e.g., 'The Silent War,' 'The Sunken Crown Succession').",
			),
		description: (s) =>
			s.describe(
				"A high-level summary outlining the central struggle, key players, and the fundamental tension driving the conflict.",
			),
		creativePrompts: (s) =>
			s.describe("Ideas for Narrative Destinations or specific quests that stem directly from this conflict."),
		gmNotes: (s) =>
			s.describe(
				"Behind-the-scenes notes, potential future escalations, or mechanical considerations for running this conflict.",
			),
		tags: (s) => s.describe("Keywords for filtering and organization (e.g., 'War for the Throne,' 'Magical Plague')."),

		cause: (s) =>
			s.describe(
				"The inciting incident or long-brewing situation that ignited this struggle. The 'first domino' to fall.",
			),
		stakes: (s) =>
			s.describe(
				"The tangible and intangible consequences of victory or defeat for all involved. What is truly on the line?",
			),
		moralDilemma: (s) =>
			s.describe(
				"The core, often unanswerable, ethical question the conflict forces upon the players and the world. The 'Sophie's Choice' at the heart of the struggle.",
			),
		possibleOutcomes: (s) =>
			s.describe(
				"A few potential resolutions, ranging from clear victory/defeat to messy stalemates. How could the world change based on the outcome?",
			),
		hiddenTruths: (s) =>
			s.describe(
				"Crucial secrets or unknown variables that, if revealed, could drastically alter the conflict's dynamics. The core of the investigative/mystery element.",
			),

		scope: z
			.enum(conflictScopes)
			.describe(
				"The scale of the conflict's impact. Does it affect a single city, an entire region, or the fate of the world?",
			),
		status: z
			.enum(conflictStatuses)
			.describe(
				"The conflict's current phase. Is it a cold war of simmering tension, an open and bloody war, or a resolved issue with lingering consequences?",
			),
		clarityOfRightWrong: z
			.enum(conflictClarity)
			.describe(
				"The moral landscape of the conflict. Is it a clear 'good vs. evil' struggle (Heroic), or a tangled web of grey-on-grey motivations (Intrigue/Grimdark)?",
			),
		currentTensionLevel: z
			.enum(tensionLevels)
			.describe(
				"The 'emotional temperature' of the conflict. Does it create an atmosphere of background anxiety, immediate danger, or open panic?",
			),
		natures: z
			.enum(conflictNatures)
			.describe(
				"The dominant arenas where the conflict plays out. Determines the types of challenges players will face (e.g., battles for Military, diplomacy for Political, investigation for Mystical).",
			),
		questImpacts: z
			.enum(questImpacts)
			.describe(
				"The way this overarching conflict actively shapes or disrupts quests, providing context, urgency, or obstacles.",
			),

		regionId: optionalId.describe("ID of the primary region where the conflict's effects are most deeply felt."),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"The thematic and narrative engine of the campaign. A Conflict is the 'Big P Plot' that provides the overarching stakes, context, and 'why' for the players' adventures.",
		),

	conflictParticipants: createInsertSchema(conflictParticipants, {
		description: (s) =>
			s.describe(
				"Key actions, resources, and influence this participant brings to the conflict. What are they *doing* to win?",
			),
		creativePrompts: (s) =>
			s.describe(
				"Ideas for how players might interact with, be hired by, or come into opposition with this specific participant.",
			),
		gmNotes: (s) =>
			s.describe("GM notes about this participant's secret weaknesses, hidden resources, or likely future moves."),
		tags: (s) => s.describe("Keywords for this participant's role (e.g., 'Traitor,' 'Financier,' 'Propagandist')."),

		conflictId: id.describe("ID of the major conflict this participant is involved in."),
		factionId: optionalId.describe(
			"ID of a faction participating in the conflict (provide either factionId or npcId).",
		),
		npcId: optionalId.describe("ID of an NPC participating in the conflict (provide either factionId or npcId)."),

		role: z
			.enum(participantRolesInConflict)
			.describe(
				"The participant's primary function in the conflict. Are they the one who started it (Instigator), the one trying to stop it (Peacemaker), or someone profiting from it (Opportunist)?",
			),
		motivation: (s) =>
			s.describe(
				"The core drive compelling this participant's involvement. What do they personally want to achieve, protect, or avenge?",
			),
		publicStance: (s) =>
			s.describe("The official, carefully crafted narrative they present to the world about their role and goals."),
		secretStance: (s) =>
			s
				.optional()
				.describe(
					"Their true, hidden objective. The mask-off agenda that drives their covert actions. A prime source for mystery and intrigue hooks.",
				),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Links a character or faction to the 'Big P Plot.' Defines their goals, motivations, and allegiances within the grand struggle, creating the cast for your political and military drama.",
		)
		.refine((data) => (data.factionId !== undefined) !== (data.npcId !== undefined), {
			message: "Either factionId or npcId must be provided, but not both",
			path: ["factionId", "npcId"],
		}),
} as const satisfies Schema<TableNames[number]>
