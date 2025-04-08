import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { zodToMCP } from "../zodToMcp"
import { schemas } from "./faction-tools-schema"
import { createEntityActionDescription, createEntityHandler } from "./tool.utils"
import { CreateEntityGetters, CreateTableTools, ToolDefinition } from "./utils/types"

const {
	factionTables: { factions, factionDiplomacy, factionHeadquarters, factionCulture, factionAgendas },
} = tables

export type FactionGetters = CreateEntityGetters<typeof tables.factionTables>

export const entityGetters: FactionGetters = {
	all_factions: () => db.query.factions.findMany({}),
	all_faction_diplomacy: () => db.query.factionDiplomacy.findMany({}),
	all_faction_headquarters: () => db.query.factionHeadquarters.findMany({}),
	all_faction_culture: () => db.query.factionCulture.findMany({}),
	all_faction_agendas: () => db.query.factionAgendas.findMany({}),

	faction_by_id: (id: number) =>
		db.query.factions.findFirst({
			where: eq(factions.id, id),
			with: {
				headquarters: { with: { site: true } },
				members: { with: { npc: { columns: { name: true, id: true } } } },
				relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceFaction: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetFaction: { columns: { name: true, id: true } } } },
				agendas: true,
				culture: true,
				influence: true,
				clues: true,
				conflicts: true,
				controlledRoutes: true,
				embedding: true,
				worldChanges: true,
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
	faction_headquarter_by_id: (id: number) =>
		db.query.factionHeadquarters.findFirst({
			where: eq(factionHeadquarters.id, id),
			with: {
				faction: { columns: { name: true, id: true } },
				site: { columns: { name: true, id: true } },
			},
		}),
	faction_culture_by_id: (id: number) =>
		db.query.factionCulture.findFirst({
			where: eq(factionCulture.id, id),
			with: { faction: { columns: { name: true, id: true } } },
		}),
	faction_agenda_by_id: (id: number) =>
		db.query.factionAgendas.findFirst({
			where: eq(factionAgendas.id, id),
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
	manage_faction_culture: {
		description: createEntityActionDescription("faction culture"),
		inputSchema: zodToMCP(schemas.manage_faction_culture),
		handler: createEntityHandler(factionCulture, schemas.manage_faction_culture, "faction_culture"),
	},
	manage_faction_agendas: {
		description: createEntityActionDescription("faction agenda"),
		inputSchema: zodToMCP(schemas.manage_faction_agendas),
		handler: createEntityHandler(factionAgendas, schemas.manage_faction_agendas, "faction_agenda"),
	},
	manage_faction_headquarters: {
		description: createEntityActionDescription("faction headquarters"),
		inputSchema: zodToMCP(schemas.manage_faction_headquarters),
		handler: createEntityHandler(factionHeadquarters, schemas.manage_faction_headquarters, "faction_headquarter"),
	},
}
