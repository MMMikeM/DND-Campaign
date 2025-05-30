import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./faction-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.factionTables)

export const entityGetters = createEntityGetters({
	all_factions: () => db.query.factions.findMany({}),
	all_faction_diplomacy: () => db.query.factionDiplomacy.findMany({}),
	all_faction_agendas: () => db.query.factionAgendas.findMany({}),
	all_faction_influence: () => db.query.factionInfluence.findMany({}),
	faction_by_id: (id: number) =>
		db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, id),
			with: {
				agendas: true,
				conflicts: true,
				primaryHqSite: true,
				questParticipation: true,
				influence: {
					with: {
						area: { columns: { name: true, id: true } },
						faction: { columns: { name: true, id: true } },
						region: { columns: { name: true, id: true } },
						site: { columns: { name: true, id: true } },
					},
				},
				members: { with: { npc: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceFaction: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetFaction: { columns: { name: true, id: true } } } },
			},
		}),
	faction_diplomacy_by_id: (id: number) =>
		db.query.factionDiplomacy.findFirst({
			where: (factionDiplomacy, { eq }) => eq(factionDiplomacy.id, id),
			with: {
				sourceFaction: true,
				targetFaction: true,
			},
		}),
	faction_agenda_by_id: (id: number) =>
		db.query.factionAgendas.findFirst({
			where: (factionAgendas, { eq }) => eq(factionAgendas.id, id),
			with: { faction: true },
		}),
	faction_influence_by_id: (id: number) =>
		db.query.factionInfluence.findFirst({
			where: (factionInfluence, { eq }) => eq(factionInfluence.id, id),
			with: { faction: true, region: true, area: true, site: true },
		}),
})

export const factionToolDefinitions: Record<"manage_faction", ToolDefinition> = {
	manage_faction: {
		description: "Manage faction-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_faction", tables.factionTables, tableEnum, schemas),
	},
}
