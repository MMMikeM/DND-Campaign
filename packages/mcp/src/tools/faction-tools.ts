import { tables, enums } from "@tome-master/shared/factions"
import { db } from "../index"
import { schemas, tableEnum } from "./faction-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables)

export const entityGetters = createEntityGetters({
	all_factions: () => db.query.factions.findMany({}),
	all_faction_agendas: () => db.query.factionAgendas.findMany({}),
	all_faction_diplomacy: () => db.query.factionDiplomacy.findMany({}),
	faction_diplomacy_by_id: (id: number) => db.query.factionDiplomacy.findFirst({ where: { id } }),
	all_faction_influence: () => db.query.factionInfluence.findMany({}),

	faction_by_id: (id: number) =>
		db.query.factions.findFirst({
			where: { id },
			with: {
				agendas: true,
				members: true,
				incomingForeshadowing: true,
				primaryHqSite: nameAndId,
				incomingRelations: { with: { sourceFaction: nameAndId } },
				outgoingRelations: { with: { targetFaction: nameAndId } },
				questParticipation: { with: { quest: nameAndId } },
				influence: {
					with: {
						region: nameAndId,
						area: nameAndId,
						site: nameAndId,
					},
				},
			},
		}),

	faction_agenda_by_id: (id: number) =>
		db.query.factionAgendas.findFirst({
			where: { id },
			with: { faction: { columns: { name: true, id: true } } },
		}),
	faction_influence_by_id: (id: number) =>
		db.query.factionInfluence.findFirst({
			where: { id },
			with: {
				faction: { columns: { name: true, id: true } },
				region: { columns: { name: true, id: true } },
				area: { columns: { name: true, id: true } },
				site: { columns: { name: true, id: true } },
			},
		}),
})

export const factionToolDefinitions: Record<"manage_faction", ToolDefinition> = {
	manage_faction: {
		enums: enums,
		description: "Manage faction-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_faction", tables, tableEnum, schemas),
		annotations: {
			title: "Manage Factions",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
