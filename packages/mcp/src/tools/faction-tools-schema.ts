import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { CreateTableNames, id, Schema } from "./tool.utils"

const {
	factionTables: { factions, factionDiplomacy, factionHeadquarters, factionCulture, factionAgendas, enums },
} = tables

export type TableNames = CreateTableNames<typeof tables.factionTables>

export const tableEnum = [
	"factions",
	"factionDiplomacy",
	"factionCulture",
	"factionHeadquarters",
	"factionAgendas",
] as const satisfies TableNames

export const schemas = {
	factions: createInsertSchema(factions, {
		id: id.describe("ID of faction to manage (omit to create new, include alone to delete)"),
		description: (s) => s.describe("Key characteristics, structure, and public activities in point form"),
		notes: (s) => s.describe("GM-only information and potential plot hooks"),
		resources: (s) => s.describe("Assets, facilities, and special resources under faction control"),
		recruitment: (s) => s.describe("Methods and criteria for bringing in new members"),
		values: (s) => s.describe("Core beliefs and principles driving faction decisions"),
		name: (s) => s.describe("Distinctive identifying name"),
		publicGoal: (s) => s.describe("Officially stated purpose acknowledged to the general populace"),
		history: (s) => s.describe("Origin story and key historical developments"),
		publicPerception: (s) => s.describe("How the general population views this faction"),
		secretGoal: (s) => s.optional().describe("Hidden agenda known only to inner circle members"),
		type: z.enum(enums.factionTypes).describe("Organization category (guild, religious, military, criminal, etc.)"),
		alignment: z.enum(enums.alignments).describe("Moral and ethical stance (lawful good through chaotic evil)"),
		reach: z
			.enum(enums.reachLevels)
			.describe("Geographic influence scope (local, regional, national, continental, global)"),
		size: z.enum(enums.sizeTypes).describe("Membership scale (tiny, small, medium, large, massive)"),
		wealth: z.enum(enums.wealthLevels).describe("Economic status (destitute, poor, moderate, rich, wealthy)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Organized groups with shared goals that act as allies, enemies, or complex forces in the campaign"),

	factionDiplomacy: createInsertSchema(factionDiplomacy, {
		id: id.describe("ID of diplomacy record to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of primary faction in this relationship"),
		otherFactionId: id.describe("ID of secondary faction in this diplomatic relation"),
		description: (s) => s.describe("Interaction details, shared history, and current dynamics in point form"),
		creativePrompts: (s) => s.describe("Story hooks involving this inter-faction relationship"),
		diplomaticStatus: z
			.enum(enums.diplomaticTypes)
			.describe("Relationship type (ally, enemy, neutral, vassal, suzerain, rival, trade)"),
		strength: z
			.enum(enums.relationshipStrengths)
			.describe("Intensity level (weak, moderate, friendly, strong, unbreakable, hostile, war)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines relationships between factions, creating political dynamics that players can navigate"),

	factionCulture: createInsertSchema(factionCulture, {
		id: id.describe("ID of culture record to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of faction this culture belongs to"),
		jargon: (s) => s.describe("Specialized terminology and slang used by members"),
		recognitionSigns: (s) => s.describe("Secret signals members use to identify each other"),
		symbols: (s) => s.describe("Emblems, insignia, and visual identifiers of this faction"),
		rituals: (s) => s.describe("Ceremonies and traditions performed by members"),
		taboos: (s) => s.describe("Forbidden actions or topics within the faction"),
		aesthetics: (s) => s.describe("Visual design, architecture, fashion, and artistic preferences"),
	})
		.omit({ id: true })
		.strict()
		.describe("Cultural elements that give factions distinct identities, behaviors, and recognition features"),

	factionHeadquarters: createInsertSchema(factionHeadquarters, {
		id: id.describe("ID of headquarters to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of faction this headquarters belongs to"),
		siteId: id.describe("ID of site where headquarters is situated"),
		creativePrompts: (s) => s.describe("Adventure hooks and encounter ideas for this site"),
		description: (s) => s.describe("Physical features, notable rooms, and defenses in point form"),
	})
		.omit({ id: true })
		.strict()
		.describe("Key sites that serve as faction bases, providing adventure sites and strategic targets"),

	factionAgendas: createInsertSchema(factionAgendas, {
		id: id.describe("ID of agenda to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of faction this agenda belongs to"),
		name: (s) => s.describe("Name or designation of this agenda"),
		ultimateAim: (s) => s.describe("The long-term goal or desired outcome the faction seeks to achieve"),
		description: (s) => s.describe("Key components and nature of this agenda in point form"),
		agendaType: z.enum(enums.factionAgendaTypes).describe("Category of this agenda's primary focus"),
		currentStage: z.enum(enums.factionAgendaStage).describe("Current phase in the progression of this agenda"),
		importance: z
			.enum(enums.factionAgendaImportance)
			.describe("How central this agenda is to the faction's overall goals"),
		moralAmbiguity: (s) => s.describe("Ethical complexities and moral questions raised by this agenda"),
		hiddenCosts: (s) => s.describe("Unintended consequences or concealed prices of pursuing this agenda"),
		keyOpponents: (s) => s.describe("Major individuals, factions, or forces working against this agenda"),
		internalConflicts: (s) => s.describe("Disagreements or tensions within the faction regarding this agenda"),
		approach: (s) => s.describe("Strategies, tactics, and methodologies employed to advance this agenda"),
		publicImage: (s) => s.describe("How this agenda appears to outsiders or is presented to the public"),
		personalStakes: (s) => s.describe("How individuals within the faction are personally invested in this agenda"),
		storyHooks: (s) => s.describe("Potential quest hooks and adventure ideas related to this agenda"),
		creativePrompts: (s) => s.describe("Ideas for incorporating this agenda into campaign storylines"),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Major objectives, schemes, and narrative drivers that define a faction's purpose and activities in the world",
		),
} as const satisfies Schema<TableNames[number]>
