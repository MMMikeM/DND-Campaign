import { eq } from "drizzle-orm"
import { db } from "../index"
import { createEntityActionDescription, createEntityHandler } from "./tool.utils"
import { tables } from "@tome-master/shared"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./association-tools-schema"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"

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

export type AssociationGetters = CreateEntityGetters<typeof tables.assocationTables>

export const entityGetters: AssociationGetters = {
	all_clues: () => db.query.clues.findMany({ columns: { embedding: false } }),
	all_items: () => db.query.items.findMany({ columns: { embedding: false } }),
	all_faction_quest_involvement: () => db.query.factionQuestInvolvement.findMany({}),
	all_npc_quest_roles: () => db.query.npcQuestRoles.findMany({}),
	all_faction_regional_power: () => db.query.factionRegionalPower.findMany({}),
	all_quest_hook_npcs: () => db.query.questHookNpcs.findMany({}),
	all_quest_introductions: () => db.query.questIntroductions.findMany({}),
	all_region_connection_details: () => db.query.regionConnectionDetails.findMany({}),

	clue_by_id: (id: number) =>
		db.query.clues.findFirst({
			where: eq(clues.id, id),
			with: {
				faction: { columns: { embedding: false } },
				npc: { columns: { embedding: false } },
				site: { columns: { embedding: false } },
				stage: { columns: { embedding: false } },
			},
		}),
	item_by_id: (id: number) =>
		db.query.items.findFirst({
			where: eq(items.id, id),
			with: {
				faction: { columns: { embedding: false } },
				npc: { columns: { embedding: false } },
				site: { columns: { embedding: false } },
				quest: { columns: { embedding: false } },
				stage: { columns: { embedding: false } },
			},
		}),
	faction_quest_involvement_by_id: (id: number) =>
		db.query.factionQuestInvolvement.findFirst({
			where: eq(factionQuestInvolvement.id, id),
			with: { faction: { columns: { embedding: false } }, quest: { columns: { embedding: false } } },
		}),
	npc_quest_role_by_id: (id: number) =>
		db.query.npcQuestRoles.findFirst({
			where: eq(npcQuestRoles.id, id),
			with: { npc: { columns: { embedding: false } }, quest: { columns: { embedding: false } } },
		}),
	faction_regional_power_by_id: (id: number) =>
		db.query.factionRegionalPower.findFirst({
			where: eq(factionRegionalPower.id, id),
			with: {
				faction: { columns: { embedding: false } },
				region: { columns: { embedding: false } },
				quest: { columns: { embedding: false } },
				area: { columns: { embedding: false } },
				site: { columns: { embedding: false } },
			},
		}),
	quest_hook_npc_by_id: (id: number) =>
		db.query.questHookNpcs.findFirst({
			where: eq(questHookNpcs.id, id),
			with: {
				npc: { columns: { embedding: false } },
				hook: true,
			},
		}),
	quest_introduction_by_id: (id: number) =>
		db.query.questIntroductions.findFirst({
			where: eq(questIntroductions.id, id),
			with: {
				quest: { columns: { embedding: false } },
				faction: { columns: { embedding: false } },
				npcs: true,
				site: { columns: { embedding: false } },
				stage: { columns: { embedding: false } },
			},
		}),
	region_connection_detail_by_id: (id: number) =>
		db.query.regionConnectionDetails.findFirst({
			where: eq(regionConnectionDetails.id, id),
			with: { connection: true },
		}),
}

export type AssociationTools = CreateTableTools<typeof tables.assocationTables>

export const associationToolDefinitions: Record<AssociationTools, ToolDefinition> = {
	manage_clues: {
		description: createEntityActionDescription("clue"),
		inputSchema: zodToMCP(schemas.manage_clues),
		handler: createEntityHandler(clues, schemas.manage_clues, "clue"),
	},
	manage_faction_quest_involvement: {
		description: createEntityActionDescription("faction quest involvement"),
		inputSchema: zodToMCP(schemas.manage_faction_quest_involvement),
		handler: createEntityHandler(
			factionQuestInvolvement,
			schemas.manage_faction_quest_involvement,
			"faction_quest_involvement",
		),
	},
	manage_items: {
		description: createEntityActionDescription("item"),
		inputSchema: zodToMCP(schemas.manage_items),
		handler: createEntityHandler(items, schemas.manage_items, "item"),
	},
	manage_npc_quest_roles: {
		description: createEntityActionDescription("NPC quest role"),
		inputSchema: zodToMCP(schemas.manage_npc_quest_roles),
		handler: createEntityHandler(npcQuestRoles, schemas.manage_npc_quest_roles, "npc_quest_role"),
	},
	manage_faction_regional_power: {
		description: createEntityActionDescription("faction regional power"),
		inputSchema: zodToMCP(schemas.manage_faction_regional_power),
		handler: createEntityHandler(factionRegionalPower, schemas.manage_faction_regional_power, "faction_regional_power"),
	},
	manage_quest_hook_npcs: {
		description: createEntityActionDescription("quest hook NPC"),
		inputSchema: zodToMCP(schemas.manage_quest_hook_npcs),
		handler: createEntityHandler(questHookNpcs, schemas.manage_quest_hook_npcs, "quest_hook_npc"),
	},
	manage_quest_introductions: {
		description: createEntityActionDescription("quest introduction"),
		inputSchema: zodToMCP(schemas.manage_quest_introductions),
		handler: createEntityHandler(questIntroductions, schemas.manage_quest_introductions, "quest_introduction"),
	},
	manage_region_connection_details: {
		description: createEntityActionDescription("region connection detail"),
		inputSchema: zodToMCP(schemas.manage_region_connection_details),
		handler: createEntityHandler(
			regionConnectionDetails,
			schemas.manage_region_connection_details,
			"region_connection_detail",
		),
	},
}
