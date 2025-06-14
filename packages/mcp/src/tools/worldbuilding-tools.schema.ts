import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	worldbuildingTables: { worldConcepts, worldConceptRelationships, worldConceptLinks, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.worldbuildingTables>

const {
	complexityProfiles,
	conceptLinkStrengths,
	conceptRelationshipTypes,
	conceptScopes,
	conceptStatuses,
	conceptTypes,
	currentEffectivenessLevels,
	moralClarity,
} = enums

export const tableEnum = [
	"worldConcepts",
	"worldConceptRelationships",
	"worldConceptLinks",
] as const satisfies TableNames

export const schemas = {
	worldConcepts: createInsertSchema(worldConcepts, {
		name: (s) => s.describe("Distinctive name for this world concept"),
		conceptType: z.enum(conceptTypes).describe("Category of concept (cultural, political, religious, etc.)"),
		complexityProfile: z.enum(complexityProfiles).describe("How complex this concept is"),
		moralClarity: z.enum(moralClarity).describe("Moral clarity of this concept"),
		summary: (s) => s.describe("Brief overview of this concept"),
		surfaceImpression: (s) => s.optional().describe("What people initially think about this concept"),
		livedRealityDetails: (s) => s.optional().describe("What it's actually like to experience this concept"),
		hiddenTruthsOrDepths: (s) => s.optional().describe("Hidden aspects or deeper truths about this concept"),
		additionalDetails: (s) => s.describe("Additional details about this concept"),
		socialStructure: (s) => s.optional().describe("Social structure related to this concept"),
		coreValues: (s) => s.describe("Core values associated with this concept"),
		traditions: (s) => s.describe("Traditions related to this concept"),
		languages: (s) => s.describe("Languages associated with this concept"),
		adaptationStrategies: (s) => s.describe("How this concept adapts to change"),
		definingCharacteristics: (s) => s.describe("Key characteristics that define this concept"),
		majorEvents: (s) => s.describe("Major historical events related to this concept"),
		lastingInstitutions: (s) => s.describe("Institutions that have lasted from this concept"),
		conflictingNarratives: (s) => s.describe("Different stories told about this concept"),
		historicalGrievances: (s) => s.describe("Historical grievances related to this concept"),
		endingCauses: (s) => s.describe("What caused this concept to end (if applicable)"),
		historicalLessons: (s) => s.describe("Lessons learned from this concept"),
		purpose: (s) => s.optional().describe("Purpose of this concept"),
		structure: (s) => s.optional().describe("Structure of this concept"),
		membership: (s) => s.describe("Who belongs to or participates in this concept"),
		rules: (s) => s.describe("Rules or guidelines associated with this concept"),
		modernAdaptations: (s) => s.describe("How this concept has adapted to modern times"),
		currentEffectiveness: z.enum(currentEffectivenessLevels).describe("Current effectiveness of this concept"),
		institutionalChallenges: (s) => s.describe("Current challenges facing this concept"),
		culturalEvolution: (s) => s.describe("How this concept has evolved culturally"),
		scope: z.enum(conceptScopes).describe("Geographic scope of this concept"),
		status: z.enum(conceptStatuses).describe("Current status of this concept"),
		timeframe: (s) => s.describe("Time period this concept relates to"),
		startYear: (s) => s.optional().describe("Year this concept began"),
		endYear: (s) => s.optional().describe("Year this concept ended"),
		modernRelevance: (s) => s.describe("How this concept is relevant today"),
		currentChallenges: (s) => s.describe("Current challenges related to this concept"),
		modernConsequences: (s) => s.describe("Modern consequences of this concept"),
		questHooks: (s) => s.describe("Quest hooks related to this concept"),
		creativePrompts: (s) => s.describe("GM ideas for using this concept"),
		description: (s) => s.describe("Detailed description of this concept"),
		gmNotes: (s) => s.describe("GM-only information about this concept"),
		tags: (s) => s.describe("Tags for this concept"),
	})
		.omit({ id: true })
		.strict()
		.describe("Cultural, political, religious, and historical concepts that shape the world"),

	worldConceptRelationships: createInsertSchema(worldConceptRelationships, {
		sourceWorldConceptId: id.describe("ID of the source concept in this relationship"),
		targetWorldConceptId: id.describe("ID of the target concept in this relationship"),
		relationshipType: z.enum(conceptRelationshipTypes).describe("Type of relationship between concepts"),
		relationshipDetails: (s) => s.optional().describe("Details about the relationship"),
		strength: z.enum(["weak", "moderate", "strong"] as const).describe("Strength of the relationship"),
		creativePrompts: (s) => s.describe("GM ideas for using this relationship"),
		description: (s) => s.describe("Description of this relationship"),
		gmNotes: (s) => s.describe("GM-only information about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Relationships between world concepts")
		.refine((data) => data.sourceWorldConceptId !== data.targetWorldConceptId, {
			message: "A concept cannot have a relationship with itself",
			path: ["targetWorldConceptId"],
		}),

	worldConceptLinks: createInsertSchema(worldConceptLinks, {
		worldConceptId: id.describe("ID of the world concept being linked"),
		regionId: optionalId.describe("ID of region linked to this concept"),
		factionId: optionalId.describe("ID of faction linked to this concept"),
		npcId: optionalId.describe("ID of NPC linked to this concept"),
		conflictId: optionalId.describe("ID of conflict linked to this concept"),
		questId: optionalId.describe("ID of quest linked to this concept"),
		linkRoleOrTypeText: (s) => s.describe("Description of the link role or type"),
		linkStrength: z.enum(conceptLinkStrengths).describe("Strength of the link"),
		linkDetailsText: (s) => s.describe("Details about the link"),
		creativePrompts: (s) => s.describe("GM ideas for using this link"),
		description: (s) => s.describe("Description of this link"),
		gmNotes: (s) => s.describe("GM-only information about this link"),
		tags: (s) => s.describe("Tags for this link"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links between world concepts and other entities")
		.refine((data) => data.regionId || data.factionId || data.npcId || data.conflictId || data.questId, {
			message: "At least one entity must be linked",
			path: ["regionId", "factionId", "npcId", "conflictId", "questId"],
		}),
} as const satisfies Schema<TableNames[number]>
