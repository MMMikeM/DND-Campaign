import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	narrativeTables: {
		narrativeDestinations,
		narrativeDestinationQuestRoles,
		narrativeDestinationRelationships,
		narrativeDestinationParticipants,
		enums,
	},
} = tables

const { arcTypes, destinationStatuses, emotionalArcs, arcImportanceLevels, destinationRelationshipTypes, questRoles } =
	enums

type TableNames = CreateTableNames<typeof tables.narrativeTables>

export const tableEnum = [
	"narrativeDestinations",
	"narrativeDestinationQuestRoles",
	"narrativeDestinationRelationships",
	"narrativeDestinationParticipants",
] as const satisfies TableNames

export const schemas = {
	narrativeDestinations: createInsertSchema(narrativeDestinations, {
		name: (s) => s.describe("Distinctive identifying title for this storyline"),
		type: z.enum(arcTypes).describe("Category of arc (main, faction, character, side)"),
		status: z.enum(destinationStatuses).describe("Current status of this narrative destination"),
		promise: (s) => s.describe("Initial hook or premise that engages players"),
		payoff: (s) => s.describe("Intended climax or resolution that fulfills the promise"),
		description: (s) => s.describe("Key plot points and narrative beats in point form"),
		themes: (s) => s.describe("Major concepts and motifs explored in this arc"),
		foreshadowingElements: (s) => s.describe("Hints and clues to plant early in the campaign"),
		intendedEmotionalArc: z.enum(emotionalArcs).describe("The emotional journey intended for players"),
		regionId: optionalId.describe("ID of the primary region where this arc takes place"),
		conflictId: optionalId.describe("ID of the major conflict this arc relates to"),
		creativePrompts: (s) => s.describe("Ideas for developing and integrating this arc"),
		gmNotes: (s) => s.describe("GM-only notes about this narrative destination"),
		tags: (s) => s.describe("Tags for this narrative destination"),
	})
		.omit({ id: true })
		.strict()
		.describe("Major storylines that span multiple quests, providing campaign structure and thematic depth"),

	narrativeDestinationQuestRoles: createInsertSchema(narrativeDestinationQuestRoles, {
		narrativeDestinationId: id.describe("ID of the narrative destination"),
		questId: id.describe("ID of quest that forms part of this arc"),
		role: z.enum(questRoles).describe("Quest's function in the arc (introduction, complication, climax, etc.)"),
		sequenceInArc: (s) => s.describe("Order of this quest within the narrative arc"),
		contributionDetails: (s) => s.describe("How this quest connects to the arc's broader themes"),
		creativePrompts: (s) => s.describe("Ideas for integrating this quest into the arc"),
		description: (s) => s.describe("Description of this quest's role in the arc"),
		gmNotes: (s) => s.describe("GM-only notes about this quest role"),
		tags: (s) => s.describe("Tags for this quest role"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links quests to narrative arcs, defining how individual adventures build toward larger stories"),

	narrativeDestinationRelationships: createInsertSchema(narrativeDestinationRelationships, {
		sourceNarrativeDestinationId: id.describe("ID of the source narrative destination"),
		targetNarrativeDestinationId: id.describe("ID of the target narrative destination"),
		relationshipType: z.enum(destinationRelationshipTypes).describe("Type of relationship between destinations"),
		relationshipDetails: (s) => s.describe("Details about the relationship between destinations"),
		creativePrompts: (s) => s.describe("Ideas for using this relationship"),
		description: (s) => s.describe("Description of the relationship"),
		gmNotes: (s) => s.describe("GM-only notes about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Relationships between narrative destinations"),

	narrativeDestinationParticipants: createInsertSchema(narrativeDestinationParticipants, {
		narrativeDestinationId: id.describe("ID of the narrative destination"),
		npcId: optionalId.describe("ID of the NPC involved (either npcId or factionId must be provided)"),
		factionId: optionalId.describe("ID of the faction involved (either npcId or factionId must be provided)"),
		roleInArc: (s) => s.describe("Role of the participant in the narrative arc"),
		arcImportance: z.enum(arcImportanceLevels).describe("Importance level of this participant in the arc"),
		involvementDetails: (s) => s.describe("Details about how this participant is involved"),
		creativePrompts: (s) => s.describe("Ideas for using this participant"),
		description: (s) => s.describe("Description of the participant's involvement"),
		gmNotes: (s) => s.describe("GM-only notes about this participant"),
		tags: (s) => s.describe("Tags for this participant involvement"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how NPCs and factions are involved in narrative destinations")
		.refine((data) => (data.npcId !== undefined) !== (data.factionId !== undefined), {
			message: "Either npcId or factionId must be provided, but not both",
			path: ["npcId", "factionId"],
		}),
} as const satisfies Schema<TableNames[number]>
