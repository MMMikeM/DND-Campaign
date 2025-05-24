import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./quest-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

const {
	questTables: { quests, questStages, stageDecisions, questDependencies, decisionOutcomes, questUnlockConditions },
} = tables

type QuestGetters = CreateEntityGetters<typeof tables.questTables>

export const entityGetters: QuestGetters = {
	all_quests: () => db.query.quests.findMany({}),
	all_quest_stages: () => db.query.questStages.findMany({}),
	all_stage_decisions: () => db.query.stageDecisions.findMany({}),
	all_quest_dependencies: () => db.query.questDependencies.findMany({}),
	all_decision_outcomes: () => db.query.decisionOutcomes.findMany({}),
	all_quest_unlock_conditions: () => db.query.questUnlockConditions.findMany({}),

	quest_by_id: (id: number) =>
		db.query.quests.findFirst({
			where: eq(quests.id, id),
			with: {
				items: true,
				stages: true,
				worldChanges: true,
				futureTriggers: true,
				unlockConditions: true,
				region: { columns: { name: true, id: true } },
				npcs: { with: { npc: { columns: { name: true, id: true } } } },
				factions: { with: { faction: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceQuest: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetQuest: { columns: { name: true, id: true } } } },
			},
		}),
	quest_stage_by_id: (id: number) =>
		db.query.questStages.findFirst({
			where: eq(questStages.id, id),
			with: {
				clues: true,
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
				outgoingDecisions: { with: { toStage: { columns: { name: true, id: true } }, consequences: true } },
				incomingDecisions: { with: { fromStage: { columns: { name: true, id: true } }, consequences: true } },
				incomingConsequences: { with: { affectedStage: { columns: { name: true, id: true } }, decision: true } },
			},
		}),
	stage_decision_by_id: (id: number) =>
		db.query.stageDecisions.findFirst({
			where: eq(stageDecisions.id, id),
			with: {
				quest: { columns: { name: true, id: true } },
				fromStage: { columns: { name: true, id: true } },
				toStage: { columns: { name: true, id: true } },
				consequences: true,
			},
		}),
	quest_dependencie_by_id: (id: number) =>
		db.query.questDependencies.findFirst({
			where: eq(questDependencies.id, id),
			with: {
				sourceQuest: { columns: { name: true, id: true } },
				targetQuest: { columns: { name: true, id: true } },
			},
		}),

	decision_outcome_by_id: (id: number) =>
		db.query.decisionOutcomes.findFirst({
			where: eq(decisionOutcomes.id, id),
			with: { decision: true, affectedStage: true },
		}),
	quest_unlock_condition_by_id: (id: number) =>
		db.query.questUnlockConditions.findFirst({
			where: eq(questUnlockConditions.id, id),
			with: { quest: { columns: { name: true, id: true } } },
		}),
}

export const questToolDefinitions: Record<"manage_quest", ToolDefinition> = {
	manage_quest: {
		description: "Manage quest-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_quest", tables.questTables, tableEnum, schemas),
	},
}
