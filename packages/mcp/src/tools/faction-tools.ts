import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import {
	createEntityActionDescription,
	createEntityHandler,
	type CamelToSnakeCase,
	type ToolDefinition,
} from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas, idSchema } from "./faction-tools-schema"

const {
	factionTables: { factions, factionDiplomacy, factionRegions, factionHeadquarters, factionCulture, factionOperations },
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.factionTables>}`
export type FactionTools = "get_all_factions" | "get_faction_by_id" | TableTools

export const factionToolDefinitions: Record<FactionTools, ToolDefinition> = {
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
		inputSchema: zodToMCP(idSchema),
		handler: async (args) => {
			const parsed = idSchema.parse(args)
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
	manage_faction_diplomacy: {
		description: createEntityActionDescription("faction diplomacy record"),
		inputSchema: zodToMCP(schemas.manage_faction_diplomacy),
		handler: createEntityHandler(factionDiplomacy, schemas.manage_faction_diplomacy, "faction diplomacy"),
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
