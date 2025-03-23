import { factionRelationships, factions } from "@tome-master/shared"
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
} from "./tool.utils"

/**
 * Tool names for faction-related operations
 */
export type FactionToolNames =
	| "get_all_factions"
	| "get_faction_by_id"
	| "manage_faction_relationship"
	| "manage_faction"

export const schemas = {
	getAllFactionsSchema: z.object({}),
	getFactionByIdSchema: z.object({ id: z.number() }),
	factionDeleteSchema: z.object({ id: z.number() }),

	factionInsertSchema: createInsertSchema(factions, {
		id: z.number().optional(),
		description: jsonArray,
		history: jsonArray,
		notes: jsonArray,
		resources: jsonArray,
	}),

	factionRelationshipInsertSchema: createInsertSchema(factionRelationships, {
		id: z.number().optional(),
		description: jsonArray,
		notes: jsonArray,
	}),
}

export const factionToolDefinitions: Record<FactionToolNames, ToolDefinition> = {
	manage_faction: {
		description: createEntityActionDescription("faction"),
		inputSchema: zodToMCP(schemas.factionInsertSchema, {
			id: "The ID of the faction to manage",
			name: "The name of the faction",
			resources: "The resources and assets the faction controls",
			type: "The type of faction (guild, government, cult, etc.)",
			alignment: "The moral alignment of the faction (lawful good, chaotic neutral, etc.)",
			description: "Detailed description of the faction's appearance, culture, and activities",
			publicGoal: "The publicly known objective of the faction",
			trueGoal: "The faction's actual objective, which may be hidden",
			headquarters: "The primary base of operations for the faction",
			territory: "The geographical area the faction controls or operates within",
			history: "The historical background and origin of the faction",
			notes: "Additional information or GM notes about the faction",
		}),
		handler: createEntityHandler(factions, schemas.factionInsertSchema, "faction"),
	},

	manage_faction_relationship: {
		description: createEntityActionDescription("faction relationship"),
		inputSchema: zodToMCP(schemas.factionRelationshipInsertSchema, {
			id: "The ID of the relationship to update (omit to create new)",
			factionId: "The ID of the primary faction in this relationship",
			otherFactionId: "The ID of the secondary faction in this relationship",
			type: "The type of relationship (ally, enemy, neutral)",
			strength: "The strength or intensity of the relationship",
			description: "Detailed description of the relationship between factions",
			notes: "Additional notes or context about the relationship",
		}),
		handler: createEntityHandler(
			factionRelationships,
			schemas.factionRelationshipInsertSchema,
			"faction relationship",
		),
	},

	get_all_factions: {
		description: "Get all factions in the campaign world",
		inputSchema: zodToMCP(schemas.getAllFactionsSchema),
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
		inputSchema: zodToMCP(schemas.getFactionByIdSchema, {
			id: "The unique ID of the faction to retrieve, includes all relations",
		}),
		handler: async (args) => {
			const parsed = schemas.getFactionByIdSchema.parse(args)
			logger.info("Getting faction by ID", { parsed })
			return (
				(await db.query.factions.findFirst({
					where: eq(factions.id, parsed.id),
					with: {
						otherRelationships: true,
						relationships: true,
						locations: true,
						members: true,
						quests: true,
					},
				})) ?? {
					isError: true,
					content: [{ type: "text", text: "Faction not found" }],
				}
			)
		},
	},
}
