import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./npc-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.npcTables)

export const entityGetters = createEntityGetters({
	all_npcs: () => db.query.npcs.findMany({}),
	all_npc_faction_memberships: () => db.query.npcFactionMemberships.findMany({}),
	all_npc_relations: () => db.query.npcRelations.findMany({}),
	all_npc_details: () => db.query.npcDetails.findMany({}),

	npc_by_id: (id: number) =>
		db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, id),
			with: {
				affectingConsequences: true,
				incomingForeshadowing: true,
				outgoingForeshadowing: true,
				details: true,
				questHooks: { with: { quest: nameAndId } },
				itemRelations: { with: { sourceItem: nameAndId } },
				stageInvolvement: { with: { questStage: nameAndId } },
				loreLinks: { with: { lore: nameAndId } },
				incomingRelations: { with: { sourceNpc: nameAndId } },
				outgoingRelations: { with: { targetNpc: nameAndId } },
				factionMemberships: { with: { faction: nameAndId } },
				questStageDeliveries: { with: { quest: nameAndId } },
				conflictParticipation: { with: { conflict: nameAndId } },
				questParticipants: { with: { quest: nameAndId } },
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

	npc_relation_by_id: (id: number) =>
		db.query.npcRelations.findFirst({
			where: (npcRelations, { eq }) => eq(npcRelations.id, id),
			with: {
				sourceNpc: true,
				targetNpc: true,
			},
		}),
	npc_detail_by_id: (id: number) =>
		db.query.npcDetails.findFirst({
			where: (npcDetails, { eq }) => eq(npcDetails.npcId, id),
		}),
})

export const npcToolDefinitions: Record<"manage_npc", ToolDefinition> = {
	manage_npc: {
		enums: tables.npcTables.enums,
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
