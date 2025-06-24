import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	factionTables: { factions, factionAgendas, factionDiplomacy, factionInfluence, enums },
} = tables

const {
	alignments,
	factionSizes,
	wealthLevels,
	reachLevels,
	transparencyLevels,
	agendaImportance,
	agendaStages,
	agendaTypes,
	diplomaticStatuses,
	factionTypes,
	influenceLevels,
	relationshipStrengths,
} = enums

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
		publicAlignment: z.enum(alignments).describe("Publicly known moral stance"),
		secretAlignment: z.enum(alignments).optional().describe("Hidden true alignment (if different from public)"),
		size: z.enum(factionSizes).describe("Membership scale (tiny, small, medium, large, massive)"),
		wealth: z.enum(wealthLevels).describe("Economic resources and financial power"),
		reach: z.enum(reachLevels).describe("Geographic influence (local, regional, national, continental, global)"),
		type: z.array(z.enum(factionTypes)).describe("Faction categories (guild, cult, tribe, noble_house, etc.)"),
		publicGoal: (s) => s.describe("Openly stated objectives and mission"),
		secretGoal: (s) => s.optional().describe("Hidden agenda known only to inner circle"),
		publicPerception: (s) => s.describe("How the general population views this faction"),
		transparencyLevel: z.enum(transparencyLevels).describe("How open the faction is about its activities"),
		values: list.describe("Core beliefs and principles that guide decisions"),
		history: list.describe("Founding story and major historical events"),
		symbols: list.describe("Emblems, colors, and visual identifiers"),
		rituals: list.describe("Ceremonies and traditional practices"),
		taboos: list.describe("Forbidden actions and cultural restrictions"),
		aesthetics: list.describe("Visual style and cultural preferences"),
		jargon: list.describe("Specialized terminology and speech patterns"),
		recognitionSigns: list.describe("Secret signals and identification methods"),
		hqSiteId: optionalId.describe("ID of the faction's main headquarters site"),
		creativePrompts: list.describe("GM ideas for using this faction in campaigns"),
		description: list.describe("Overview of the faction's role and characteristics"),
		gmNotes: list.describe("GM-only information about this faction"),
		tags: list.describe("Tags for this faction"),
	})
		.omit({ id: true })
		.strict()
		.describe("Organizations with shared goals, resources, and influence that shape the political landscape"),

	factionAgendas: createInsertSchema(factionAgendas, {
		factionId: id.describe("ID of the faction this agenda belongs to"),
		name: (s) => s.describe("Name of this specific agenda"),
		agendaType: z.enum(agendaTypes).describe("Category of agenda (economic, military, political, etc.)"),
		currentStage: z.enum(agendaStages).describe("Current progress stage"),
		importance: z.enum(agendaImportance).describe("Priority level within the faction"),
		ultimateAim: (s) => s.describe("Final goal this agenda seeks to achieve"),
		moralAmbiguity: (s) => s.describe("Ethical complexity and moral implications"),
		approach: list.describe("Methods and strategies being used"),
		storyHooks: list.describe("Ways this agenda can involve player characters"),
		creativePrompts: list.describe("GM ideas for developing this agenda"),
		description: list.describe("Details about this agenda"),
		gmNotes: list.describe("GM-only information about this agenda"),
		tags: list.describe("Tags for this agenda"),
	})
		.omit({ id: true })
		.strict()
		.describe("Specific goals and projects that factions are actively pursuing"),

	factionDiplomacy: createInsertSchema(factionDiplomacy, {
		sourceFactionId: id.describe("ID of the primary faction in this relationship"),
		targetFactionId: id.describe("ID of the secondary faction in this relationship"),
		strength: z.enum(relationshipStrengths).describe("Intensity of the relationship"),
		diplomaticStatus: z.enum(diplomaticStatuses).describe("Type of diplomatic relationship"),
		creativePrompts: list.describe("GM ideas for using this relationship"),
		description: list.describe("Details about this diplomatic relationship"),
		gmNotes: list.describe("GM-only information about this relationship"),
		tags: list.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Political relationships between factions that create alliances, rivalries, and conflicts")
		.refine((data) => data.sourceFactionId !== data.targetFactionId, {
			message: "A faction cannot have a diplomatic relationship with itself",
			path: ["targetFactionId"],
		}),

	factionInfluence: createInsertSchema(factionInfluence, {
		factionId: id.describe("ID of the faction exerting influence"),
		areaId: optionalId.describe("ID of the area this influence is exerted on"),
		regionId: optionalId.describe("ID of the region this influence is exerted on"),
		siteId: optionalId.describe("ID of the site this influence is exerted on"),
		influenceLevel: z.enum(influenceLevels).describe("Degree of control or influence"),
		presenceTypes: list.describe("Types of faction presence in this location"),
		presenceDetails: list.describe("Specific details about how the faction operates here"),
		priorities: list.describe("What the faction prioritizes in this location"),
		creativePrompts: list.describe("GM ideas for using this influence"),
		description: list.describe("Details about this influence"),
		gmNotes: list.describe("GM-only information about this influence"),
		tags: list.describe("Tags for this influence"),
	})
		.omit({ id: true })
		.strict()
		.describe("Geographic areas where factions have power, control, or significant presence")
		.refine((data) => ((data.regionId !== undefined) !== (data.areaId !== undefined)) !== (data.siteId !== undefined), {
			message: "Only one of regionId, areaId, or siteId must be provided",
			path: ["regionId", "areaId", "siteId"],
		}),
} as const satisfies Schema<TableNames[number]>
