import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	narrativeDestinationTables: {
		narrativeDestinations,
		narrativeDestinationQuestRoles,
		narrativeDestinationRelations,
		narrativeDestinationParticipants,
		enums,
	},
} = tables

const {
	arcTypes,
	destinationStatuses,
	arcImportanceLevels,
	destinationRelationshipTypes,
	emotionalArcShapes,
	questRolesInArc,
} = enums

type TableNames = CreateTableNames<typeof tables.narrativeDestinationTables>

export const tableEnum = [
	"narrativeDestinations",
	"narrativeDestinationQuestRoles",
	"narrativeDestinationRelations",
	"narrativeDestinationParticipants",
] as const satisfies TableNames

export const schemas = {
	narrativeDestinations: createInsertSchema(narrativeDestinations, {
		name: (s) =>
			s.describe(
				"The 'Chapter Title' of this story arc (e.g., 'The Siege of Blackwood Keep,' 'The Serpent's Deception'). Makes the arc feel distinct and memorable.",
			),
		promise: (s) =>
			s.describe(
				"The core hook presented to the players. What question is being asked, what goal is being set, and what kind of story does this promise? (e.g., 'Can we expose the traitor before the coronation?'). This sets reader expectations.",
			),
		payoff: (s) =>
			s.describe(
				"The climactic resolution to the promise. How is the dramatic question answered in a way that is surprising yet inevitable? This is the emotional and narrative destination of the arc.",
			),
		description: (s) =>
			s.describe(
				"A narrative synopsis of this 'chapter.' Outline the major beats of the journey from Promise to Payoff, focusing on key challenges, turning points, and how Progress will be demonstrated.",
			),
		themes: (s) =>
			s.describe(
				"The central ideas this arc explores (e.g., Loyalty vs. Duty, Sacrifice, The Cost of Power). Use these themes to guide character challenges and moral dilemmas within the arc.",
			),
		intendedEmotionalArcShape: z
			.enum(emotionalArcShapes)
			.describe(
				"The desired emotional trajectory for the players. This is a pacing tool to shape the arc's tone, e.g., building from a low point (Rally from Defeat) or showing the cost of a win (Victory to Consequence).",
			),
		type: z
			.enum(arcTypes)
			.describe(
				"Classifies the arc's primary focus. Is this advancing the Main Plot, a Faction's agenda, a specific Character's personal journey, or an optional Side story? Helps in organizing plot threads.",
			),
		status: z
			.enum(destinationStatuses)
			.describe("The current state of this story arc for the players. Tracks its real-time progress in the campaign."),
		conflictId: optionalId.describe(
			"The overarching Conflict that provides this arc's stakes and thematic context. Why does this 'chapter' matter to the 'novel' as a whole?",
		),
		foreshadowingElements: (s) =>
			s.describe(
				"List the specific clues, symbols, or NPC dialogues planted WITHIN this arc that set up FUTURE arcs. These are the 'Chekhov's Guns' for later payoffs.",
			),
		regionId: optionalId.describe("The primary geographical stage where this story arc unfolds."),
		creativePrompts: (s) =>
			s.describe(
				"Brainstorming seeds: 'What if...' scenarios, potential complications, or interesting NPCs to introduce specifically for this arc.",
			),
		gmNotes: (s) =>
			s.describe(
				"The secret architecture of the arc: hidden truths, key decision points, contingency plans for player deviation, and the 'real' story behind the events.",
			),
		tags: (s) =>
			s.describe("Keywords for filtering and organization (e.g., 'Political Intrigue,' 'Dungeon Crawl,' 'Horror')."),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"A Narrative Destination is a major story arc that functions like a chapter in a novel. It structures the campaign into 'Points on the Map,' each with a clear Promise, a journey of Progress, and a satisfying Payoff.",
		),

	narrativeDestinationQuestRoles: createInsertSchema(narrativeDestinationQuestRoles, {
		narrativeDestinationId: id.describe("The story arc (Chapter) this quest belongs to."),
		questId: id.describe("The specific quest (Scene) being linked to the arc."),
		role: z
			.enum(questRolesInArc) // Using revised enum
			.describe(
				"Defines the quest's structural purpose. 'Setup' establishes the Promise. 'Progress' quests are the Try/Fail cycles. 'Payoff' delivers the arc's climax. 'Epilogue' handles the aftermath.",
			),
		sequenceInArc: (s) =>
			s.describe(
				"The intended chronological placement of this quest within the arc. Essential for building logical progression and escalating stakes towards the payoff.",
			),
		contributionDetails: (s) =>
			s.describe(
				"How does this quest achieve Progress? What specific information, item, or alliance is gained that moves the characters closer to fulfilling the arc's main Promise?",
			),
		description: (s) =>
			s.describe("A brief summary of this quest's specific function and goals within the larger narrative of the arc."),
		creativePrompts: (s) =>
			s.describe(
				"Ideas for linking this quest's events, characters, or discoveries back to the main arc's central promise.",
			),
		gmNotes: (s) =>
			s.describe(
				"Internal notes on how this quest can change based on the outcomes of previous quests in the sequence.",
			),
		tags: (s) => s.describe("Keywords for filtering and organization."),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Links a specific quest to a story arc, defining its role and sequence. These are the concrete milestones and Try/Fail cycles that create the feeling of Progress for the players.",
		),

	narrativeDestinationRelations: createInsertSchema(narrativeDestinationRelations, {
		sourceNarrativeDestinationId: id.describe("The preceding or causal story arc ('Chapter 1')."),
		targetNarrativeDestinationId: id.describe("The subsequent or resulting story arc ('Chapter 2')."),
		relationshipType: z
			.enum(destinationRelationshipTypes) // Using revised enum
			.describe(
				"Defines how the arcs connect causally. 'Leads_To' is a direct consequence. 'Enables' is a prerequisite. 'Complicates' means the source arc's outcome alters the target arc's challenge.",
			),
		relationshipDetails: (s) =>
			s.describe(
				"The narrative bridge. How does the Payoff of the source arc create the Promise for the target arc? (e.g., 'Defeating the Baron reveals he was controlled by a larger entity, promising a new confrontation').",
			),
		creativePrompts: (s) => s.describe("Ideas for seeding hints of the target arc within the source arc."),
		description: (s) => s.describe("A summary of the narrative connection between the two arcs."),
		gmNotes: (s) =>
			s.describe("Notes on how player actions in the source arc might alter the setup of the target arc."),
		tags: (s) => s.describe("Keywords for filtering relationships."),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Defines the causal relationship between two story arcs, weaving the 'chapters' of the campaign into a cohesive, flowing narrative.",
		),

	narrativeDestinationParticipants: createInsertSchema(narrativeDestinationParticipants, {
		narrativeDestinationId: id.describe("The story arc this entity is involved in."),
		npcId: optionalId.describe("ID of the NPC playing a key role in this arc."),
		factionId: optionalId.describe("ID of the faction playing a key role in this arc."),
		roleInArc: (s) =>
			s.describe(
				"The participant's narrative function in THIS chapter (e.g., Mentor, Antagonist, Victim, Quest Giver, Obstacle, False Ally). This role can change in other arcs.",
			),
		arcImportance: z
			.enum(arcImportanceLevels)
			.describe(
				"How central is this participant to the arc's Promise and Payoff? A 'Central' character is indispensable to this arc's plot.",
			),
		involvementDetails: (s) =>
			s.describe(
				"A summary of their specific actions, goals, and impact within this story arc. What do they do, and why does it matter here?",
			),
		creativePrompts: (s) =>
			s.describe("Ideas for scenes or interactions involving this participant that highlight their role in the arc."),
		description: (s) => s.describe("A brief description of the participant's involvement in this part of the story."),
		gmNotes: (s) =>
			s.describe("Secrets about this participant's true motives or hidden actions related specifically to this arc."),
		tags: (s) => s.describe("Keywords for this participant's role."),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Defines which NPCs and factions are the main 'cast members' for a specific story arc, detailing their roles and importance.",
		)
		.refine((data) => (data.npcId !== undefined) !== (data.factionId !== undefined), {
			message: "Either npcId or factionId must be provided, but not both",
			path: ["npcId", "factionId"],
		}),
} as const satisfies Schema<TableNames[number]>
