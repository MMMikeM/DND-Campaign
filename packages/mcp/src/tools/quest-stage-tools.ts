import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./quest-stage-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.questStageTables)

export const entityGetters = createEntityGetters({
	all_quest_stages: () => db.query.questStages.findMany({}),
	all_quest_stage_decisions: () => db.query.questStageDecisions.findMany({}),
	all_npc_stage_involvement: () => db.query.npcStageInvolvement.findMany({}),

	quest_stage_by_id: (id: number) =>
		db.query.questStages.findFirst({
			where: (questStages, { eq }) => eq(questStages.id, id),
			with: {
				deliveryNpc: { columns: { name: true, id: true } },
				outgoingForeshadowing: true,
				npcInvolvement: true,
				quest: { columns: { name: true, id: true } },
				site: {
					with: {
						secrets: true,
						area: { columns: { name: true, id: true } },
						encounters: { columns: { name: true, id: true } },
					},
				},
				outgoingDecisions: { with: { targetStage: true } },
				incomingDecisions: { with: { sourceStage: true } },
				items: true,
				narrativeEvents: true,
			},
		}),
	quest_stage_decision_by_id: (id: number) =>
		db.query.questStageDecisions.findFirst({
			where: (stageDecisions, { eq }) => eq(stageDecisions.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
				sourceStage: { columns: { name: true, id: true } },
				targetStage: { columns: { name: true, id: true } },
				triggeredEvents: true,
				consequences: true,
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

export const questStageToolDefinitions: Record<"manage_stage", ToolDefinition> = {
	manage_stage: {
		enums: tables.questStageTables.enums,
		description: "Manage quest stage-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_stage", tables.questStageTables, tableEnum, schemas),
		annotations: {
			title: "Manage Quest Stages",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
