import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { createEntityActionDescription, createEntityHandler } from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./faction-tools-schema"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"

const {
	factionTables: { factions, factionDiplomacy, factionRegions, factionHeadquarters, factionCulture, factionOperations },
} = tables

export type FactionGetters = CreateEntityGetters<typeof tables.factionTables>

export const entityGetters: FactionGetters = {
	all_factions: () => db.query.factions.findMany({}),
	all_faction_diplomacy: () => db.query.factionDiplomacy.findMany({}),
	all_faction_regions: () => db.query.factionRegions.findMany({}),
	all_faction_headquarters: () => db.query.factionHeadquarters.findMany({}),
	all_faction_culture: () => db.query.factionCulture.findMany({}),
	all_faction_operations: () => db.query.factionOperations.findMany({}),

	faction_by_id: (id: number) =>
		db.query.factions.findFirst({
			where: eq(factions.id, id),
			with: {
				headquarters: { with: { site: true } },
				members: { with: { npc: { columns: { name: true, id: true } } } },
				relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
				relatedRegions: { with: { region: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceFaction: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetFaction: { columns: { name: true, id: true } } } },
				operations: true,
				culture: true,
				influence: true,
			},
		}),
	faction_diplomacy_by_id: (id: number) =>
		db.query.factionDiplomacy.findFirst({
			where: eq(factionDiplomacy.id, id),
			with: {
				sourceFaction: { columns: { name: true, id: true } },
				targetFaction: { columns: { name: true, id: true } },
			},
		}),
	faction_region_by_id: (id: number) =>
		db.query.factionRegions.findFirst({
			where: eq(factionRegions.id, id),
			with: { faction: { columns: { name: true, id: true } }, region: { columns: { name: true, id: true } } },
		}),
	faction_headquarter_by_id: (id: number) =>
		db.query.factionHeadquarters.findFirst({
			where: eq(factionHeadquarters.id, id),
			with: { faction: { columns: { name: true, id: true } }, site: { columns: { name: true, id: true } } },
		}),
	faction_culture_by_id: (id: number) =>
		db.query.factionCulture.findFirst({
			where: eq(factionCulture.id, id),
			with: { faction: { columns: { name: true, id: true } } },
		}),
	faction_operation_by_id: (id: number) =>
		db.query.factionOperations.findFirst({
			where: eq(factionOperations.id, id),
			with: { faction: { columns: { name: true, id: true } } },
		}),
}

export type FactionTools = CreateTableTools<typeof tables.factionTables>

export const factionToolDefinitions: Record<FactionTools, ToolDefinition> = {
	manage_factions: {
		description: createEntityActionDescription("faction"),
		inputSchema: zodToMCP(schemas.manage_factions),
		handler: createEntityHandler(factions, schemas.manage_factions, "faction"),
	},
	manage_faction_diplomacy: {
		description: createEntityActionDescription("faction diplomacy"),
		inputSchema: zodToMCP(schemas.manage_faction_diplomacy),
		handler: createEntityHandler(factionDiplomacy, schemas.manage_faction_diplomacy, "faction_diplomacy"),
	},
	manage_faction_regions: {
		description: createEntityActionDescription("faction region"),
		inputSchema: zodToMCP(schemas.manage_faction_regions),
		handler: createEntityHandler(factionRegions, schemas.manage_faction_regions, "faction_region"),
	},
	manage_faction_culture: {
		description: createEntityActionDescription("faction culture"),
		inputSchema: zodToMCP(schemas.manage_faction_culture),
		handler: createEntityHandler(factionCulture, schemas.manage_faction_culture, "faction_culture"),
	},
	manage_faction_operations: {
		description: createEntityActionDescription("faction operation"),
		inputSchema: zodToMCP(schemas.manage_faction_operations),
		handler: createEntityHandler(factionOperations, schemas.manage_faction_operations, "faction_operation"),
	},
	manage_faction_headquarters: {
		description: createEntityActionDescription("faction headquarters"),
		inputSchema: zodToMCP(schemas.manage_faction_headquarters),
		handler: createEntityHandler(factionHeadquarters, schemas.manage_faction_headquarters, "faction_headquarter"),
	},
}
