import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

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
	relatedEntityTypes,
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
		type: z.enum(factionTypes).describe("Faction categories (guild, cult, tribe, noble_house, etc.)"),
		publicGoal: (s) => s.describe("Openly stated objectives and mission"),
		secretGoal: (s) => s.optional().describe("Hidden agenda known only to inner circle"),
		publicPerception: (s) => s.describe("How the general population views this faction"),
		transparencyLevel: z.enum(transparencyLevels).describe("How open the faction is about its activities"),
		values: (s) => s.describe("Core beliefs and principles that guide decisions"),
		history: (s) => s.describe("Founding story and major historical events"),
		symbols: (s) => s.describe("Emblems, colors, and visual identifiers"),
		rituals: (s) => s.describe("Ceremonies and traditional practices"),
		taboos: (s) => s.describe("Forbidden actions and cultural restrictions"),
		aesthetics: (s) => s.describe("Visual style and cultural preferences"),
		jargon: (s) => s.describe("Specialized terminology and speech patterns"),
		recognitionSigns: (s) => s.describe("Secret signals and identification methods"),
		hqSiteId: optionalId.describe("ID of the faction's main headquarters site"),
		creativePrompts: (s) => s.describe("GM ideas for using this faction in campaigns"),
		description: (s) => s.describe("Overview of the faction's role and characteristics"),
		gmNotes: (s) => s.describe("GM-only information about this faction"),
		tags: (s) => s.describe("Tags for this faction"),
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
		approach: (s) => s.describe("Methods and strategies being used"),
		storyHooks: (s) => s.describe("Ways this agenda can involve player characters"),
		creativePrompts: (s) => s.describe("GM ideas for developing this agenda"),
		description: (s) => s.describe("Details about this agenda"),
		gmNotes: (s) => s.describe("GM-only information about this agenda"),
		tags: (s) => s.describe("Tags for this agenda"),
	})
		.omit({ id: true })
		.strict()
		.describe("Specific goals and projects that factions are actively pursuing"),

	factionDiplomacy: createInsertSchema(factionDiplomacy, {
		sourceFactionId: id.describe("ID of the primary faction in this relationship"),
		targetFactionId: id.describe("ID of the secondary faction in this relationship"),
		strength: z.enum(relationshipStrengths).describe("Intensity of the relationship"),
		diplomaticStatus: z.enum(diplomaticStatuses).describe("Type of diplomatic relationship"),
		creativePrompts: (s) => s.describe("GM ideas for using this relationship"),
		description: (s) => s.describe("Details about this diplomatic relationship"),
		gmNotes: (s) => s.describe("GM-only information about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
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
		relatedEntityType: z.enum(relatedEntityTypes).describe("Type of entity this influence is exerted on"),
		relatedEntityId: id.describe("ID of the entity this influence is exerted on"),
		influenceLevel: z.enum(influenceLevels).describe("Degree of control or influence"),
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
		.refine(
			(data) =>
				data.relatedEntityType === "region" || data.relatedEntityType === "area" || data.relatedEntityType === "site",
			{
				message: "relatedEntityType must be one of region, area, or site",
				path: ["relatedEntityType"],
			},
		),
} as const satisfies Schema<TableNames[number]>
