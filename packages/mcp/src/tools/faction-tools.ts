import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./faction-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

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
			where: (factions, { eq }) => eq(factions.id, id),
			with: {
				clues: true,
				agendas: true,
				culture: true,
				conflicts: true,
				embedding: true,
				worldChanges: true,
				controlledRoutes: true,
				headquarters: { with: { site: true } },
				members: { with: { npc: { columns: { name: true, id: true } } } },
				relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceFaction: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetFaction: { columns: { name: true, id: true } } } },
				territorialControl: {
					with: {
						area: { columns: { name: true, id: true } },
						site: { columns: { name: true, id: true } },
						region: { columns: { name: true, id: true } },
						faction: { columns: { name: true, id: true } },
					},
				},
			},
		}),
	faction_diplomacy_by_id: (id: number) =>
		db.query.factionDiplomacy.findFirst({
			where: eq(factionDiplomacy.id, id),
			with: {
				sourceFaction: true,
				targetFaction: true,
			},
		}),
	faction_headquarter_by_id: (id: number) =>
		db.query.factionHeadquarters.findFirst({
			where: eq(factionHeadquarters.id, id),
			with: {
				site: true,
				faction: true,
			},
		}),
	faction_culture_by_id: (id: number) =>
		db.query.factionCulture.findFirst({
			where: eq(factionCulture.id, id),
			with: { faction: true },
		}),
	faction_agenda_by_id: (id: number) =>
		db.query.factionAgendas.findFirst({
			where: eq(factionAgendas.id, id),
			with: { faction: true },
		}),
}

export const factionToolDefinitions: Record<"manage_faction", ToolDefinition> = {
	manage_faction: {
		description: "Manage faction-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_faction", tables.factionTables, tableEnum, schemas),
	},
}
