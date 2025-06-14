import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./quest-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.questTables)

export const entityGetters = createEntityGetters({
	all_quests: () => db.query.quests.findMany({}),
	all_quest_stages: () => db.query.questStages.findMany({}),
	all_quest_stage_decisions: () => db.query.questStageDecisions.findMany({}),
	all_quest_hooks: () => db.query.questHooks.findMany({}),
	all_quest_participants: () => db.query.questParticipants.findMany({}),
	all_quest_relations: () => db.query.questRelations.findMany({}),
	all_npc_stage_involvement: () => db.query.npcStageInvolvement.findMany({}),

	quest_by_id: (id: number) =>
		db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, id),
			with: {
				consequences: true,
				foreshadowingSource: true,
				foreshadowingTarget: true,
				hooks: true,
				incomingRelations: true,
				itemRelations: true,
				narrativeDestinationContributions: true,
				outgoingRelations: true,
				participants: true,
				worldConceptLinks: true,
				triggeredEvents: true,
				stages: true,
				region: { columns: { name: true, id: true } },
			},
		}),
	quest_stage_by_id: (id: number) =>
		db.query.questStages.findFirst({
			where: (questStages, { eq }) => eq(questStages.id, id),
			with: {
				deliveryNpc: { columns: { name: true, id: true } },
				foreshadowingSource: true,
				npcInvolvement: true,
				quest: { columns: { name: true, id: true } },
				site: {
					with: {
						secrets: true,
						area: { columns: { name: true, id: true } },
						encounters: { columns: { name: true, id: true } },
					},
				},
				outgoingDecisions: { with: { toStage: true } },
				incomingDecisions: { with: { fromStage: true } },
				items: true,
				narrativeEvents: true,
			},
		}),
	quest_stage_decision_by_id: (id: number) =>
		db.query.questStageDecisions.findFirst({
			where: (stageDecisions, { eq }) => eq(stageDecisions.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
				fromStage: { columns: { name: true, id: true } },
				toStage: { columns: { name: true, id: true } },
				triggeredEvents: true,
				consequences: true,
			},
		}),
	quest_hook_by_id: (id: number) =>
		db.query.questHooks.findFirst({
			where: (questHooks, { eq }) => eq(questHooks.id, id),
			with: {
				deliveryNpc: { columns: { name: true, id: true } },
				faction: { columns: { name: true, id: true } },
				site: { columns: { name: true, id: true } },
				quest: { columns: { name: true, id: true } },
			},
		}),
	quest_participant_by_id: (id: number) =>
		db.query.questParticipants.findFirst({
			where: (questParticipants, { eq }) => eq(questParticipants.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
				faction: { columns: { name: true, id: true } },
				npc: { columns: { name: true, id: true } },
			},
		}),
	quest_relation_by_id: (id: number) =>
		db.query.questRelations.findFirst({
			where: (questRelations, { eq }) => eq(questRelations.id, id),
			with: {
				sourceQuest: { columns: { name: true, id: true } },
				targetQuest: { columns: { name: true, id: true } },
			},
		}),
	npc_stage_involvement_by_id: (id: number) =>
		db.query.npcStageInvolvement.findFirst({
			where: (npcStageInvolvement, { eq }) => eq(npcStageInvolvement.id, id),
			with: {
				questStage: { columns: { name: true, id: true } },
				npc: { columns: { name: true, id: true } },
			},
		}),
})

export const questToolDefinitions: Record<"manage_quest", ToolDefinition> = {
	manage_quest: {
		description: "Manage quest-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_quest", tables.questTables, tableEnum, schemas),
		annotations: {
			title: "Manage Quests",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
