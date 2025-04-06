import {
	type CamelToSnakeCase,
	createEntityActionDescription,
	createEntityHandler,
	type ToolDefinition,
} from "./tool.utils"
import { tables } from "@tome-master/shared"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./association-tools-schema"

const {
	assocationTables: {
		clues,
		items,
		factionQuestInvolvement,
		npcQuestRoles,
		factionRegionalPower,
		questHookNpcs,
		questIntroductions,
		regionConnectionDetails,
	},
} = tables

type TableTools = `manage_${CamelToSnakeCase<keyof typeof tables.assocationTables>}`
export type AssociationTools = TableTools

export const associationToolDefinitions: Record<AssociationTools, ToolDefinition> = {
	manage_clues: {
		description: createEntityActionDescription("clue"),
		inputSchema: zodToMCP(schemas.manage_clues),
		handler: createEntityHandler(clues, schemas.manage_clues, "clue"),
	},
	manage_faction_quest_involvement: {
		description: createEntityActionDescription("faction-quest"),
		inputSchema: zodToMCP(schemas.manage_faction_quest_involvement),
		handler: createEntityHandler(factionQuestInvolvement, schemas.manage_faction_quest_involvement, "faction-quest"),
	},
	manage_items: {
		description: createEntityActionDescription("item"),
		inputSchema: zodToMCP(schemas.manage_items),
		handler: createEntityHandler(items, schemas.manage_items, "item"),
	},
	manage_npc_quest_roles: {
		description: createEntityActionDescription("quest-npc"),
		inputSchema: zodToMCP(schemas.manage_npc_quest_roles),
		handler: createEntityHandler(npcQuestRoles, schemas.manage_npc_quest_roles, "quest-npc"),
	},
	manage_faction_regional_power: {
		description: createEntityActionDescription("faction-influence"),
		inputSchema: zodToMCP(schemas.manage_faction_regional_power),
		handler: createEntityHandler(factionRegionalPower, schemas.manage_faction_regional_power, "faction-influence"),
	},
	manage_quest_hook_npcs: {
		description: createEntityActionDescription("quest-hook-npc"),
		inputSchema: zodToMCP(schemas.manage_quest_hook_npcs),
		handler: createEntityHandler(questHookNpcs, schemas.manage_quest_hook_npcs, "quest-hook-npc"),
	},
	manage_quest_introductions: {
		description: createEntityActionDescription("quest-hook"),
		inputSchema: zodToMCP(schemas.manage_quest_introductions),
		handler: createEntityHandler(questIntroductions, schemas.manage_quest_introductions, "quest-hook"),
	},
	manage_region_connection_details: {
		description: createEntityActionDescription("region-connection"),
		inputSchema: zodToMCP(schemas.manage_region_connection_details),
		handler: createEntityHandler(
			regionConnectionDetails,
			schemas.manage_region_connection_details,
			"region-connection",
		),
	},
}
