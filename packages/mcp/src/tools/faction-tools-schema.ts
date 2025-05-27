import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./tool.utils"

const {
	factionTables: { factions, factionAgendas, factionDiplomacy, factionInfluence, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.factionTables>

export const tableEnum = [
	"factions",
	"factionAgendas",
	"factionDiplomacy",
	"factionInfluence",
] as const satisfies TableNames

export const schemas = {
	factions: createInsertSchema(factions, {
		name: (s) => s.describe("Distinctive name for this faction"),
		publicAlignment: z.enum(enums.alignments).describe("Publicly known moral stance"),
		secretAlignment: z.enum(enums.alignments).optional().describe("Hidden true alignment (if different from public)"),
		size: z.enum(enums.factionSizes).describe("Membership scale (tiny, small, medium, large, massive)"),
		wealth: z.enum(enums.wealthLevels).describe("Economic resources and financial power"),
		reach: z.enum(enums.reachLevels).describe("Geographic influence (local, regional, national, continental, global)"),
		type: (s) => s.describe("Faction categories (guild, cult, tribe, noble_house, etc.)"),
		publicGoal: (s) => s.describe("Openly stated objectives and mission"),
		secretGoal: (s) => s.optional().describe("Hidden agenda known only to inner circle"),
		publicPerception: (s) => s.describe("How the general population views this faction"),
		transparencyLevel: z.enum(enums.transparencyLevels).describe("How open the faction is about its activities"),
		values: (s) => s.describe("Core beliefs and principles that guide decisions"),
		history: (s) => s.describe("Founding story and major historical events"),
		symbols: (s) => s.describe("Emblems, colors, and visual identifiers"),
		rituals: (s) => s.describe("Ceremonies and traditional practices"),
		taboos: (s) => s.describe("Forbidden actions and cultural restrictions"),
		aesthetics: (s) => s.describe("Visual style and cultural preferences"),
		jargon: (s) => s.describe("Specialized terminology and speech patterns"),
		recognitionSigns: (s) => s.describe("Secret signals and identification methods"),
		primaryHqSiteId: optionalId.describe("ID of the faction's main headquarters site"),
		creativePrompts: (s) => s.describe("GM ideas for using this faction in campaigns"),
		description: (s) => s.describe("Overview of the faction's role and characteristics"),
		gmNotes: (s) => s.describe("GM-only information about this faction"),
		tags: (s) => s.describe("Tags for this faction"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Organizations with shared goals, resources, and influence that shape the political landscape"),

	factionAgendas: createInsertSchema(factionAgendas, {
		factionId: id.describe("ID of the faction this agenda belongs to"),
		name: (s) => s.describe("Name of this specific agenda"),
		agendaType: z.enum(enums.agendaTypes).describe("Category of agenda (economic, military, political, etc.)"),
		currentStage: z.enum(enums.agendaStages).describe("Current progress stage"),
		importance: z.enum(enums.agendaImportance).describe("Priority level within the faction"),
		ultimateAim: (s) => s.describe("Final goal this agenda seeks to achieve"),
		moralAmbiguity: (s) => s.describe("Ethical complexity and moral implications"),
		approach: (s) => s.describe("Methods and strategies being used"),
		storyHooks: (s) => s.describe("Ways this agenda can involve player characters"),
		creativePrompts: (s) => s.describe("GM ideas for developing this agenda"),
		description: (s) => s.describe("Details about this agenda"),
		gmNotes: (s) => s.describe("GM-only information about this agenda"),
		tags: (s) => s.describe("Tags for this agenda"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Specific goals and projects that factions are actively pursuing"),

	factionDiplomacy: createInsertSchema(factionDiplomacy, {
		factionId: id.describe("ID of the primary faction in this relationship"),
		otherFactionId: id.describe("ID of the secondary faction in this relationship"),
		strength: z.enum(enums.relationshipStrengths).describe("Intensity of the relationship"),
		diplomaticStatus: z.enum(enums.diplomaticStatuses).describe("Type of diplomatic relationship"),
		creativePrompts: (s) => s.describe("GM ideas for using this relationship"),
		description: (s) => s.describe("Details about this diplomatic relationship"),
		gmNotes: (s) => s.describe("GM-only information about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Political relationships between factions that create alliances, rivalries, and conflicts")
		.refine((data) => data.factionId !== data.otherFactionId, {
			message: "A faction cannot have a diplomatic relationship with itself",
			path: ["otherFactionId"],
		}),

	factionInfluence: createInsertSchema(factionInfluence, {
		factionId: id.describe("ID of the faction exerting influence"),
		regionId: optionalId.describe(
			"ID of region where influence is exerted (mutually exclusive with areaId and siteId)",
		),
		areaId: optionalId.describe("ID of area where influence is exerted (mutually exclusive with regionId and siteId)"),
		siteId: optionalId.describe("ID of site where influence is exerted (mutually exclusive with regionId and areaId)"),
		influenceLevel: z.enum(enums.influenceLevels).describe("Degree of control or influence"),
		presenceTypes: (s) => s.describe("Types of faction presence in this location"),
		presenceDetails: (s) => s.describe("Specific details about how the faction operates here"),
		priorities: (s) => s.describe("What the faction prioritizes in this location"),
		creativePrompts: (s) => s.describe("GM ideas for using this influence"),
		description: (s) => s.describe("Details about this influence"),
		gmNotes: (s) => s.describe("GM-only information about this influence"),
		tags: (s) => s.describe("Tags for this influence"),
	})
		.omit({ id: true })
		.strict()
		.describe("Geographic areas where factions have power, control, or significant presence")
		.refine((data) => [data.regionId, data.areaId, data.siteId].filter(Boolean).length === 1, {
			message: "Exactly one of regionId, areaId, or siteId must be provided",
			path: ["regionId", "areaId", "siteId"],
		}),
} as const satisfies Schema<TableNames[number]>
