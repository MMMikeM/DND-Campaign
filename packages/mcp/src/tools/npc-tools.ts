import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./npc-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.npcTables)

export const entityGetters = createEntityGetters({
	all_npcs: () => db.query.npcs.findMany({}),
	all_npc_faction_memberships: () => db.query.npcFactionMemberships.findMany({}),
	all_npc_site_associations: () => db.query.npcSiteAssociations.findMany({}),
	all_npc_relations: () => db.query.npcRelations.findMany({}),

	npc_by_id: (id: number) =>
		db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, id),
			with: {
				affectingConsequences: true,
				incomingForeshadowing: true,
				outgoingForeshadowing: true,
				questHooks: { with: { quest: { columns: { name: true, id: true } } } },
				itemHistory: { with: { item: { columns: { name: true, id: true } } } },
				itemRelations: { with: { sourceItem: { columns: { name: true, id: true } } } },
				siteAssociations: { with: { site: { columns: { name: true, id: true } } } },
				stageInvolvement: { with: { questStage: { columns: { name: true, id: true } } } },
				loreLinks: { with: { lore: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceNpc: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetNpc: { columns: { name: true, id: true } } } },
				factionMemberships: { with: { faction: { columns: { name: true, id: true } } } },
				questStageDeliveries: { with: { quest: { columns: { name: true, id: true } } } },
				conflictParticipation: { with: { conflict: { columns: { name: true, id: true } } } },
				narrativeDestinationInvolvement: { with: { narrativeDestination: { columns: { name: true, id: true } } } },
			},
		}),
	npc_faction_membership_by_id: (id: number) =>
		db.query.npcFactionMemberships.findFirst({
			where: (npcFactionMemberships, { eq }) => eq(npcFactionMemberships.id, id),
			with: {
				npc: true,
				faction: true,
			},
		}),
	npc_site_association_by_id: (id: number) =>
		db.query.npcSiteAssociations.findFirst({
			where: (npcSiteAssociations, { eq }) => eq(npcSiteAssociations.id, id),
			with: {
				npc: true,
				site: true,
			},
		}),
	npc_relation_by_id: (id: number) =>
		db.query.npcRelations.findFirst({
			where: (npcRelations, { eq }) => eq(npcRelations.id, id),
			with: {
				sourceNpc: true,
				targetNpc: true,
			},
		}),
})

export const npcToolDefinitions: Record<"manage_npc", ToolDefinition> = {
	manage_npc: {
		description: "Manage NPC-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_npc", tables.npcTables, tableEnum, schemas),
		annotations: {
			title: "Manage NPCs",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
