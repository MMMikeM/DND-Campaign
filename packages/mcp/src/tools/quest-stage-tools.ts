import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./quest-stage-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
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
				npcInvolvement: true,
				itemConnections: true,
				outgoingForeshadowing: true,
				deliveryNpc: nameAndId,
				quest: nameAndId,
				site: {
					with: {
						area: nameAndId,
						encounters: nameAndId,
					},
				},
				outgoingDecisions: { with: { targetStage: true } },
				incomingDecisions: { with: { sourceStage: true } },
			},
		}),
	quest_stage_decision_by_id: (id: number) =>
		db.query.questStageDecisions.findFirst({
			where: (stageDecisions, { eq }) => eq(stageDecisions.id, id),
			with: {
				quest: nameAndId,
				sourceStage: nameAndId,
				targetStage: nameAndId,
				consequences: true,
			},
		}),
	npc_stage_involvement_by_id: (id: number) =>
		db.query.npcStageInvolvement.findFirst({
			where: (npcStageInvolvement, { eq }) => eq(npcStageInvolvement.id, id),
			with: {
				questStage: nameAndId,
				npc: nameAndId,
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
