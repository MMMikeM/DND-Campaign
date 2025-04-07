import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { id, optionalId } from "./tool.utils"
import { FactionTools } from "./faction-tools"

const {
	factionTables: {
		factions,
		factionDiplomacy,
		factionRegions,
		factionHeadquarters,
		factionCulture,
		factionOperations,
		enums,
	},
} = tables

export const schemas = {
	manage_factions: createInsertSchema(factions, {
		id: optionalId.describe("ID of faction to manage (omit to create new, include alone to delete)"),
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
		.omit({ embedding: true })
		.strict()
		.describe("Organized groups with shared goals that act as allies, enemies, or complex forces in the campaign"),

	manage_faction_diplomacy: createInsertSchema(factionDiplomacy, {
		id: optionalId.describe("ID of diplomacy record to manage (omit to create new, include alone to delete)"),
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
		.strict()
		.describe("Defines relationships between factions, creating political dynamics that players can navigate"),

	manage_faction_culture: createInsertSchema(factionCulture, {
		id: optionalId.describe("ID of culture record to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of faction this culture belongs to"),
		jargon: (s) => s.describe("Specialized terminology and slang used by members"),
		recognitionSigns: (s) => s.describe("Secret signals members use to identify each other"),
		symbols: (s) => s.describe("Emblems, insignia, and visual identifiers of this faction"),
		rituals: (s) => s.describe("Ceremonies and traditions performed by members"),
		taboos: (s) => s.describe("Forbidden actions or topics within the faction"),
		aesthetics: (s) => s.describe("Visual design, architecture, fashion, and artistic preferences"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("Cultural elements that give factions distinct identities, behaviors, and recognition features"),

	manage_faction_headquarters: createInsertSchema(factionHeadquarters, {
		id: optionalId.describe("ID of headquarters to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of faction this headquarters belongs to"),
		siteId: id.describe("ID of site where headquarters is situated"),
		creativePrompts: (s) => s.describe("Adventure hooks and encounter ideas for this site"),
		description: (s) => s.describe("Physical features, notable rooms, and defenses in point form"),
	})
		.strict()
		.describe("Key sites that serve as faction bases, providing adventure sites and strategic targets"),

	manage_faction_operations: createInsertSchema(factionOperations, {
		id: optionalId.describe("ID of operation to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of faction conducting this operation"),
		description: (s) => s.describe("Methods, participants, and timeline in point form"),
		creativePrompts: (s) => s.describe("Story hooks and player involvement opportunities"),
		objectives: (s) => s.describe("Specific outcomes the faction aims to accomplish"),
		site: (s) => s.describe("Key sites where operation takes place"),
		involved_npcs: (s) => s.describe("Named individuals participating or targeted"),
		name: (s) => s.describe("Operation code name or identifier"),
		type: z
			.enum(enums.factionOperationTypes)
			.describe("Activity category (economic, military, diplomatic, espionage, etc.)"),
		scale: z.enum(enums.factionOperationScales).describe("Scope and magnitude (minor, moderate, major, massive)"),
		status: z
			.enum(enums.factionOperationStatuses)
			.describe("Current phase (planning, initial, ongoing, concluding, completed)"),
		priority: z.enum(enums.factionPriorities).describe("Importance to faction goals (low, medium, high)"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("Active missions and plots that factions undertake, creating opportunities for player intervention"),

	manage_faction_regions: createInsertSchema(factionRegions, {
		id: optionalId.describe("ID of region association to manage (omit to create new, include alone to delete)"),
		factionId: id.describe("ID of faction with presence in this region"),
		regionId: id.describe("ID of region where faction is active"),
		presence: (s) => s.describe("Visible manifestations (outposts, patrols, agents, symbols)"),
		priorities: (s) => s.describe("Specific interests or resources the faction seeks here"),
		controlLevel: z
			.enum(enums.controlLevels)
			.describe("Authority level (contested, influenced, controlled, dominated)"),
	})
		.strict()
		.describe("Maps faction territorial influence, showing where power struggles occur in the campaign world"),
} satisfies Record<FactionTools, z.ZodSchema<unknown>>
