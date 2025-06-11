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
	all_stage_decisions: () => db.query.stageDecisions.findMany({}),
	all_quest_hooks: () => db.query.questHooks.findMany({}),
	all_quest_participant_involvement: () => db.query.questParticipantInvolvement.findMany({}),
	all_quest_relationships: () => db.query.questRelationships.findMany({}),
	all_npc_stage_involvement: () => db.query.npcStageInvolvement.findMany({}),

	quest_by_id: (id: number) =>
		db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, id),
			with: {
				dependencies: true,
				dependents: true,
				destinationContributions: true,
				triggeredEvents: true,
				stages: true,
				region: { columns: { name: true, id: true } },
			},
		}),
	quest_stage_by_id: (id: number) =>
		db.query.questStages.findFirst({
			where: (questStages, { eq }) => eq(questStages.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
				site: {
					with: {
						secrets: true,
						territorialControl: true,
						area: { columns: { name: true, id: true } },
						items: { columns: { name: true, id: true } },
						encounters: { columns: { name: true, id: true } },
						npcs: { with: { npc: { columns: { name: true, id: true } } } },
					},
				},
				decisionsFrom: true,
				decisionsTo: true,
				items: true,
				narrativeEvents: true,
			},
		}),
	stage_decision_by_id: (id: number) =>
		db.query.stageDecisions.findFirst({
			where: (stageDecisions, { eq }) => eq(stageDecisions.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
				fromStage: { columns: { name: true, id: true } },
				toStage: { columns: { name: true, id: true } },
				outcomes: true,
				triggeredEvents: true,
				worldChanges: true,
			},
		}),
	quest_hook_by_id: (id: number) =>
		db.query.questHooks.findFirst({
			where: (questHooks, { eq }) => eq(questHooks.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
			},
		}),
	quest_participant_involvement_by_id: (id: number) =>
		db.query.questParticipantInvolvement.findFirst({
			where: (questParticipantInvolvement, { eq }) => eq(questParticipantInvolvement.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
			},
		}),
	quest_relationship_by_id: (id: number) =>
		db.query.questRelationships.findFirst({
			where: (questRelationships, { eq }) => eq(questRelationships.id, id),
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
