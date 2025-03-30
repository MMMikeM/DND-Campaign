import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import {
	createEntityHandler,
	createEntityActionDescription,
	jsonArray,
	type ToolDefinition,
	type CamelToSnakeCase,
} from "./tool.utils"

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
	idSchema: z.object({ id: z.number() }),
	manage_factions: createInsertSchema(factions, {
		id: z.number().optional(),
		description: jsonArray,
		notes: jsonArray,
		resources: jsonArray,
		recruitment: jsonArray,
		values: jsonArray,
	}).strict(),
	manage_faction_relationships: createInsertSchema(factionRelationships, {
		id: z.number().optional(),
		description: jsonArray,
	}).strict(),
	manage_faction_culture: createInsertSchema(factionCulture, {
		id: z.number().optional(),
		jargon: jsonArray,
		recognitionSigns: jsonArray,
		symbols: jsonArray,
		rituals: jsonArray,
		taboos: jsonArray,
	}).strict(),
	manage_faction_headquarters: createInsertSchema(factionHeadquarters, {
		id: z.number().optional(),
		creativePrompts: jsonArray,
		description: jsonArray,
	}).strict(),
	manage_faction_operations: createInsertSchema(factionOperations, {
		id: z.number().optional(),
		description: jsonArray,
		creativePrompts: jsonArray,
		objectives: jsonArray,
	}).strict(),
	manage_faction_regions: createInsertSchema(factionRegions, {
		id: z.number().optional(),
		presence: jsonArray,
		priorities: jsonArray,
	}).strict(),
} satisfies Record<TableTools | "idSchema", z.ZodSchema<unknown>>

const test = zodToMCP(schemas.manage_faction_relationships)
const test2 = zodToMCP(schemas.manage_factions)

export const factionToolDefinitions: Record<FactionToolNames, ToolDefinition> = {
	get_all_factions: {
		description: "Get all factions in the campaign world",
		inputSchema: zodToMCP(z.any()),
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
		inputSchema: zodToMCP(schemas.idSchema, {
			id: "The unique ID of the faction to retrieve, includes all relations",
		}),
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
		inputSchema: zodToMCP(schemas.manage_factions, {
			id: "The ID of the faction to manage",
			name: "The name of the faction",
			resources: "The resources and assets the faction controls",
			type: "The type of faction (guild, government, cult, etc.)",
			alignment: "The moral alignment of the faction (lawful good, chaotic neutral, etc.)",
			description: "Detailed description of the faction's appearance, culture, and activities, in point form",
			publicGoal: "The publicly known objective of the faction",
			history: "The historical background and origin of the faction",
			notes: "Additional information or GM notes about the faction",
			publicPerception: "The public perception of the faction",
			reach: "The reach of the faction",
			recruitment: "The recruitment process for the faction",
			secretGoal: "The secret objective of the faction",
			size: "The size of the faction",
			wealth: "The wealth of the faction",
			values: "The values and beliefs of the faction",
		}),
		handler: createEntityHandler(factions, schemas.manage_factions, "faction"),
	},
	manage_faction_relationships: {
		description: createEntityActionDescription("faction relationship"),
		inputSchema: zodToMCP(schemas.manage_faction_relationships, {
			id: "The ID of the relationship to update (omit to create new)",
			factionId: "The ID of the primary faction in this relationship",
			otherFactionId: "The ID of the secondary faction in this relationship",
			type: "The type of relationship (ally, enemy, neutral)",
			strength: "The strength or intensity of the relationship",
			description: "Detailed description of the relationship between factions, in point form",
			creativePrompts: "Creative prompts related to the relationship",
		}),
		handler: createEntityHandler(
			factionRelationships,
			schemas.manage_faction_relationships,
			"faction relationship",
		),
	},
	manage_faction_regions: {
		description: createEntityActionDescription("faction region"),
		inputSchema: zodToMCP(schemas.manage_faction_regions, {
			id: "The ID of the region to update (omit to create new)",
			factionId: "The ID of the faction in this region",
			regionId: "The ID of the region",
			controlLevel:
				"The level of control the faction has in this region (contested, influenced, controlled, dominated)",
			presence: "How the faction manifests in the area",
			priorities: "What the faction cares about in this region",
		}),
		handler: createEntityHandler(factionRegions, schemas.manage_faction_regions, "faction region"),
	},
	manage_faction_culture: {
		description: createEntityActionDescription("faction culture"),
		inputSchema: zodToMCP(schemas.manage_faction_culture, {
			id: "The ID of the culture to update (omit to create new)",
			factionId: "The ID of the faction in this culture",
			jargon: "The jargon or slang used by the faction",
			recognitionSigns: "The signs or symbols that identify the faction",
			symbols: "The symbols associated with the faction",
			rituals: "The rituals or ceremonies performed by the faction",
			taboos: "The taboos or prohibitions within the faction",
			aesthetics: "The aesthetics or visual style of the faction",
		}),
		handler: createEntityHandler(factionCulture, schemas.manage_faction_culture, "faction culture"),
	},
	manage_faction_operations: {
		description: createEntityActionDescription("faction operation"),
		inputSchema: zodToMCP(schemas.manage_faction_operations, {
			id: "The ID of the operation to update (omit to create new)",
			factionId: "The ID of the faction in this operation",
			name: "The name of the operation",
			type: "The type of operation (economic, military, diplomatic, espionage, public works, research)",
			description: "Detailed description of the operation, in point form",
			creativePrompts: "Creative prompts related to the operation",
			objectives: "The objectives or goals of the operation",
			locations: "The locations involved in the operation",
			involved_npcs: "The NPCs involved in the operation",
			scale: "The scale of the operation (minor, moderate, major, massive)",
			status: "The status of the operation (planning, initial, ongoing, concluding, completed)",
			priority: "The priority of the operation (low, medium, high)",
		}),
		handler: createEntityHandler(factionOperations, schemas.manage_faction_operations, "faction operation"),
	},
	manage_faction_headquarters: {
		description: createEntityActionDescription("faction headquarters"),
		inputSchema: zodToMCP(schemas.manage_faction_headquarters, {
			id: "The ID of the headquarters to update (omit to create new)",
			factionId: "The ID of the faction in this headquarters",
			locationId: "The ID of the location of the headquarters",
			description: "Detailed description of the headquarters, in point form",
			creativePrompts: "Creative prompts related to the headquarters",
		}),
		handler: createEntityHandler(
			factionHeadquarters,
			schemas.manage_faction_headquarters,
			"faction headquarters",
		),
	},
}
