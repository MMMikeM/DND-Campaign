import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { db, logger } from "../index"
import {
	createEntityHandler,
	createEntityActionDescription,
	jsonArray,
	type ToolDefinition,
	type CamelToSnakeCase,
} from "./tool.utils"
import { zodToMCP } from "../zodToMcp"

const {
	factionTables: {
		factions,
		factionRelationships,
		factionRegions,
		factionHeadquarters,
		factionCulture,
		factionOperations,
	},
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.factionTables>}`

/**
 * Tool names for faction-related operations
 */
export type FactionToolNames = "get_all_factions" | "get_faction_by_id" | TableTools

export const schemas = {
	idSchema: z.object({
		id: z.number().describe("Unique identifier for database records"),
	}),

	manage_factions: createInsertSchema(factions, {
		id: z.coerce.number().optional().describe("The ID of the faction to manage (Optional)"),
		description: jsonArray.describe(
			"Key characteristics of the faction including structure, notable features, and public activities in point form",
		),
		notes: jsonArray.describe("GM-specific information and plot hooks related to this faction"),
		resources: jsonArray.describe(
			"Assets, facilities, wealth sources, and special resources the faction controls or has access to",
		),
		recruitment: jsonArray.describe("Methods, criteria, and processes by which the faction brings in new members"),
		values: jsonArray.describe("Core beliefs, principles, and ideological positions that drive faction decisions"),
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
		history: (s) => jsonArray.describe("The faction's origin story, key historical events, and evolution over time"),
		publicPerception: (s) => s.describe("How the general population views and interacts with this faction"),
		reach: (s) => s.describe("Geographical scope of influence (local, regional, national, continental, global)"),
		secretGoal: (s) =>
			s.describe("Hidden agenda or true objective known only to inner circle members (optional)").optional(),
		size: (s) => s.describe("Scale of membership and operations (tiny, small, medium, large, massive)"),
		wealth: (s) =>
			s.describe("Economic status and available financial resources (destitute, poor, moderate, rich, wealthy)"),
	})
		.strict()
		.describe("A political, social, or ideological group with shared goals and identity"),

	manage_faction_relationships: createInsertSchema(factionRelationships, {
		id: z.coerce.number().optional().describe("The ID of the relationship to update (omit to create new)"),
		description: jsonArray.describe(
			"Details about how these factions interact, shared history, and current dynamics in point form",
		),
		creativePrompts: jsonArray.describe("Story hooks and campaign ideas involving this inter-faction relationship"),
		factionId: z.coerce
			.number()
			.describe("The ID of the primary faction in this relationship (references factions.id)"),
		otherFactionId: z.coerce
			.number()
			.describe("The ID of the secondary faction in this relationship (references factions.id)"),
		type: (s) => s.describe("Nature of the relationship (ally, enemy, neutral)"),
		strength: (s) =>
			s.describe(
				"Intensity of the relationship (weak, moderate, friendly, strong, unbreakable, friction, cold, hostile, war)",
			),
	})
		.strict()
		.describe("Defines how two factions interact with each other"),

	manage_faction_culture: createInsertSchema(factionCulture, {
		id: z.coerce.number().optional().describe("The ID of the culture to update (omit to create new)"),
		jargon: jsonArray.describe(
			"Specialized terminology, slang, code words and unique expressions used by faction members",
		),
		recognitionSigns: jsonArray.describe("Secret handshakes, passwords, or signals members use to identify each other"),
		symbols: jsonArray.describe("Emblems, insignia, banners, and visual identifiers associated with this faction"),
		rituals: jsonArray.describe("Ceremonies, traditions, and practices regularly performed by members"),
		taboos: jsonArray.describe("Actions or topics forbidden or strongly discouraged within the faction"),
		aesthetics: jsonArray.describe("Visual design, architectural preferences, fashion, and artistic style"),
		factionId: z.coerce.number().describe("The ID of the faction this culture belongs to (references factions.id)"),
	})
		.strict()
		.describe("The distinctive customs, practices, and identity markers of a faction"),

	manage_faction_headquarters: createInsertSchema(factionHeadquarters, {
		id: z.coerce.number().optional().describe("The ID of the headquarters to update (omit to create new)"),
		creativePrompts: jsonArray.describe(
			"Story hooks, encounter ideas, and adventure seeds centered around this location",
		),
		description: jsonArray.describe("Physical characteristics, notable rooms, defenses, and atmosphere in point form"),
		factionId: z.coerce
			.number()
			.describe("The ID of the faction this headquarters belongs to (references factions.id)"),
		locationId: z.coerce
			.number()
			.describe("The ID of the location where this headquarters is situated (references locations.id)"),
	})
		.strict()
		.describe("The primary base of operations for a faction"),

	manage_faction_operations: createInsertSchema(factionOperations, {
		id: z.coerce.number().optional().describe("The ID of the operation to update (omit to create new)"),
		description: jsonArray.describe("Goals, methods, participants, and timeline of the operation in point form"),
		creativePrompts: jsonArray.describe("Story hooks, player involvement opportunities, and potential complications"),
		objectives: jsonArray.describe("Specific outcomes and achievements the faction aims to accomplish"),
		locations: jsonArray.describe("Key sites where the operation takes place or affects"),
		involved_npcs: jsonArray.describe("Named individuals participating in or targeted by this operation"),
		factionId: z.coerce.number().describe("The ID of the faction conducting this operation (references factions.id)"),
		name: (s) => s.describe("The code name or identifier for this operation"),
		type: (s) => s.describe("Category of activity (economic, military, diplomatic, espionage, public works, research)"),
		scale: (s) => s.describe("Scope and magnitude of the operation (minor, moderate, major, massive)"),
		status: (s) => s.describe("Current phase of execution (planning, initial, ongoing, concluding, completed)"),
		priority: (s) => s.describe("Importance to the faction's goals (low, medium, high)"),
	})
		.strict()
		.describe("A coordinated activity or mission conducted by a faction"),

	manage_faction_regions: createInsertSchema(factionRegions, {
		id: z.coerce.number().optional().describe("The ID of the region association to update (omit to create new)"),
		presence: jsonArray.describe(
			"Visible manifestations of the faction in this area (outposts, patrols, agents, symbols)",
		),
		priorities: jsonArray.describe(
			"Specific interests, resources, or strategic value the faction seeks in this region",
		),
		factionId: z.coerce
			.number()
			.describe("The ID of the faction with presence in this region (references factions.id)"),
		regionId: z.coerce.number().describe("The ID of the region where the faction is active (references regions.id)"),
		controlLevel: (s) => s.describe("Degree of influence and authority (contested, influenced, controlled, dominated)"),
	})
		.strict()
		.describe("Represents a faction's presence, interests and impact in a geographical region"),
} satisfies Record<TableTools | "idSchema", z.ZodSchema<unknown>>

export const factionToolDefinitions: Record<FactionToolNames, ToolDefinition> = {
	get_all_factions: {
		description: "Get all factions in the campaign world",
		inputSchema: zodToMCP(z.object({})),
		handler: async () => {
			logger.info("Retrieving all factions")
			const factions = await db.query.factions.findMany({})
			logger.debug("Factions retrieved:", {
				stringified: JSON.stringify(factions),
				type: typeof factions,
			})
			return factions
		},
	},

	get_faction_by_id: {
		description: "Get detailed information about a specific faction by ID",
		inputSchema: zodToMCP(schemas.idSchema),
		handler: async (args) => {
			const parsed = schemas.idSchema.parse(args)
			logger.info("Getting faction by ID", { parsed })

			return (
				(await db.query.factions.findFirst({
					where: eq(factions.id, parsed.id),
					with: {
						members: { with: { npc: true } },
						headquarters: { with: { location: true } },
						relatedQuests: { with: { quest: true } },
						relatedRegions: { with: { region: true } },
						incomingRelationships: {
							with: {
								sourceFaction: true,
							},
						},
						outgoingRelationships: {
							with: {
								targetFaction: true,
							},
						},
						operations: true,
						culture: true,
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "Faction not found" }],
				}
			)
		},
	},
	manage_factions: {
		description: createEntityActionDescription("faction"),
		inputSchema: zodToMCP(schemas.manage_factions),
		handler: createEntityHandler(factions, schemas.manage_factions, "faction"),
	},
	manage_faction_relationships: {
		description: createEntityActionDescription("faction relationship"),
		inputSchema: zodToMCP(schemas.manage_faction_relationships),
		handler: createEntityHandler(factionRelationships, schemas.manage_faction_relationships, "faction relationship"),
	},
	manage_faction_regions: {
		description: createEntityActionDescription("faction region"),
		inputSchema: zodToMCP(schemas.manage_faction_regions),
		handler: createEntityHandler(factionRegions, schemas.manage_faction_regions, "faction region"),
	},
	manage_faction_culture: {
		description: createEntityActionDescription("faction culture"),
		inputSchema: zodToMCP(schemas.manage_faction_culture),
		handler: createEntityHandler(factionCulture, schemas.manage_faction_culture, "faction culture"),
	},
	manage_faction_operations: {
		description: createEntityActionDescription("faction operation"),
		inputSchema: zodToMCP(schemas.manage_faction_operations),
		handler: createEntityHandler(factionOperations, schemas.manage_faction_operations, "faction operation"),
	},
	manage_faction_headquarters: {
		description: createEntityActionDescription("faction headquarters"),
		inputSchema: zodToMCP(schemas.manage_faction_headquarters),
		handler: createEntityHandler(factionHeadquarters, schemas.manage_faction_headquarters, "faction headquarters"),
	},
}
