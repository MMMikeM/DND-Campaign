import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { optionalId, similaritySearchSchema } from "./tool.utils"
import { FactionTools } from "./faction-tools"

const {
	factionTables: { factions, factionDiplomacy, factionRegions, factionHeadquarters, factionCulture, factionOperations },
} = tables

export const idSchema = z.object({
	id: z.number().describe("Unique identifier for factions"),
})

export const schemas = {
	manage_factions: createInsertSchema(factions, {
		id: optionalId.describe("The ID of the faction to manage (Optional)"),
		description: (s) =>
			s.describe(
				"Key characteristics of the faction including structure, notable features, and public activities in point form",
			),
		notes: (s) => s.describe("GM-specific information and plot hooks related to this faction"),
		resources: (s) =>
			s.describe("Assets, facilities, wealth sources, and special resources the faction controls or has access to"),
		recruitment: (s) => s.describe("Methods, criteria, and processes by which the faction brings in new members"),
		values: (s) => s.describe("Core beliefs, principles, and ideological positions that drive faction decisions"),
		name: (s) => s.describe("The unique identifying name of the faction"),
		type: (s) =>
			s.describe(
				"Category of organization (guild, government, religious order, mercenary company, criminal syndicate, etc.)",
			),
		alignment: (s) =>
			s.describe(
				"The moral and ethical stance (lawful good, neutral good, chaotic good, lawful neutral, true neutral, chaotic neutral, lawful evil, neutral evil, chaotic evil)",
			),
		publicGoal: (s) =>
			s.describe("Officially stated purpose or mission the faction acknowledges to the general populace"),
		history: (s) => s.describe("The faction's origin story, key historical events, and evolution over time"),
		publicPerception: (s) => s.describe("How the general population views and interacts with this faction"),
		reach: (s) => s.describe("Geographical scope of influence (local, regional, national, continental, global)"),
		secretGoal: (s) =>
			s.optional().describe("Hidden agenda or true objective known only to inner circle members (optional)"),
		size: (s) => s.describe("Scale of membership and operations (tiny, small, medium, large, massive)"),
		wealth: (s) =>
			s.describe("Economic status and available financial resources (destitute, poor, moderate, rich, wealthy)"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A political, social, or ideological group with shared goals and identity"),

	manage_faction_diplomacy: createInsertSchema(factionDiplomacy, {
		id: optionalId.describe("The ID of the diplomacy record to update (omit to create new)"),
		factionId: optionalId.describe("The ID of the primary faction in this relationship (references factions.id)"),
		otherFactionId: optionalId.describe(
			"The ID of the secondary faction in this diplomatic relation (references factions.id)",
		),
		description: (s) =>
			s.describe(
				"Details about how these factions interact, shared history, and current diplomatic dynamics in point form",
			),
		creativePrompts: (s) => s.describe("Story hooks and campaign ideas involving this inter-faction relationship"),
		diplomaticStatus: (s) =>
			s.describe("Diplomatic status between the factions (ally, enemy, neutral, vassal, suzerain, rival, trade)"),
		strength: (s) =>
			s.describe(
				"Intensity of the diplomatic relation (weak, moderate, friendly, strong, unbreakable, friction, cold, hostile, war)",
			),
	})
		.strict()
		.describe("Defines the diplomatic relationship between two factions"),

	manage_faction_culture: createInsertSchema(factionCulture, {
		id: optionalId.describe("The ID of the culture to update (omit to create new)"),
		factionId: optionalId.describe("The ID of the faction this culture belongs to (references factions.id)"),
		jargon: (s) =>
			s.describe("Specialized terminology, slang, code words and unique expressions used by faction members"),
		recognitionSigns: (s) => s.describe("Secret handshakes, passwords, or signals members use to identify each other"),
		symbols: (s) => s.describe("Emblems, insignia, banners, and visual identifiers associated with this faction"),
		rituals: (s) => s.describe("Ceremonies, traditions, and practices regularly performed by members"),
		taboos: (s) => s.describe("Actions or topics forbidden or strongly discouraged within the faction"),
		aesthetics: (s) => s.describe("Visual design, architectural preferences, fashion, and artistic style"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("The distinctive customs, practices, and identity markers of a faction"),

	manage_faction_headquarters: createInsertSchema(factionHeadquarters, {
		id: optionalId.describe("The ID of the headquarters to update (omit to create new)"),
		factionId: (s) =>
			optionalId.describe("The ID of the faction this headquarters belongs to (references factions.id)"),
		siteId: (s) =>
			optionalId.describe("The ID of the location where this headquarters is situated (references sites.id)"),
		creativePrompts: (s) =>
			s.describe("Story hooks, encounter ideas, and adventure seeds centered around this location"),
		description: (s) => s.describe("Physical characteristics, notable rooms, defenses, and atmosphere in point form"),
	})
		.strict()
		.describe("The primary base of operations for a faction"),

	manage_faction_operations: createInsertSchema(factionOperations, {
		id: optionalId.describe("The ID of the operation to update (omit to create new)"),
		factionId: optionalId.describe("The ID of the faction conducting this operation (references factions.id)"),
		description: (s) => s.describe("Goals, methods, participants, and timeline of the operation in point form"),
		creativePrompts: (s) => s.describe("Story hooks, player involvement opportunities, and potential complications"),
		objectives: (s) => s.describe("Specific outcomes and achievements the faction aims to accomplish"),
		locations: (s) => s.describe("Key sites where the operation takes place or affects"),
		involved_npcs: (s) => s.describe("Named individuals participating in or targeted by this operation"),
		name: (s) => s.describe("The code name or identifier for this operation"),
		type: (s) => s.describe("Category of activity (economic, military, diplomatic, espionage, public works, research)"),
		scale: (s) => s.describe("Scope and magnitude of the operation (minor, moderate, major, massive)"),
		status: (s) => s.describe("Current phase of execution (planning, initial, ongoing, concluding, completed)"),
		priority: (s) => s.describe("Importance to the faction's goals (low, medium, high)"),
	})

		.omit({ embedding: true })
		.strict()
		.describe("A coordinated activity or mission conducted by a faction"),

	manage_faction_regions: createInsertSchema(factionRegions, {
		id: optionalId.describe("The ID of the region association to update (omit to create new)"),
		factionId: optionalId.describe("The ID of the faction with presence in this region (references factions.id)"),
		regionId: optionalId.describe("The ID of the region where the faction is active (references regions.id)"),
		presence: (s) =>
			s.describe("Visible manifestations of the faction in this area (outposts, patrols, agents, symbols)"),
		priorities: (s) => s.describe("Specific interests, resources, or strategic value the faction seeks in this region"),
		controlLevel: (s) => s.describe("Degree of influence and authority (contested, influenced, controlled, dominated)"),
	})
		.strict()
		.describe("Represents a faction's presence, interests and impact in a geographical region"),
	get_all_factions: z.object({}).describe("Get all factions in the campaign world"),
	get_faction_by_id: idSchema.describe("Get a faction by its ID"),
} satisfies Record<FactionTools, z.ZodSchema<unknown>>
