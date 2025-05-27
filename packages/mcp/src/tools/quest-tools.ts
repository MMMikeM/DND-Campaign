import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./quest-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type QuestGetters = CreateEntityGetters<typeof tables.questTables>

export const entityGetters: QuestGetters = {
	all_quests: () => db.query.quests.findMany({}),
	all_quest_stages: () => db.query.questStages.findMany({}),
	all_stage_decisions: () => db.query.stageDecisions.findMany({}),
	all_decision_outcomes: () => db.query.decisionOutcomes.findMany({}),
	all_quest_unlock_conditions: () => db.query.questUnlockConditions.findMany({}),
	all_quest_faction_involvement: () => db.query.questFactionInvolvement.findMany({}),
	all_quest_introductions: () => db.query.questIntroductions.findMany({}),
	all_quest_npc_roles: () => db.query.questNpcRoles.findMany({}),
	all_quest_dependencies: () => db.query.questDependencies.findMany({}),
	quest_faction_involvement_by_id: (id: number) =>
		db.query.questFactionInvolvement.findFirst({
			where: (questFactionInvolvement, { eq }) => eq(questFactionInvolvement.id, id),
			with: { quest: { columns: { name: true, id: true } } },
		}),
	quest_introduction_by_id: (id: number) =>
		db.query.questIntroductions.findFirst({
			where: (questIntroductions, { eq }) => eq(questIntroductions.id, id),
			with: { quest: { columns: { name: true, id: true } } },
		}),
	quest_npc_role_by_id: (id: number) =>
		db.query.questNpcRoles.findFirst({
			where: (questNpcRoles, { eq }) => eq(questNpcRoles.id, id),
			with: { quest: { columns: { name: true, id: true } } },
		}),
	quest_by_id: (id: number) =>
		db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, id),
			with: {
				conflictProgression: true,
				dependencies: true,
				dependents: true,
				destinationContributions: true,
				factionInvolvement: true,
				npcRoles: true,
				triggeredEvents: true,
				items: true,
				stages: true,
				worldChanges: true,
				unlockConditions: true,
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
	quest_dependencie_by_id: (id: number) =>
		db.query.questDependencies.findFirst({
			where: (questDependencies, { eq }) => eq(questDependencies.id, id),
			with: {
				sourceQuest: { columns: { name: true, id: true } },
				targetQuest: { columns: { name: true, id: true } },
			},
		}),

	decision_outcome_by_id: (id: number) =>
		db.query.decisionOutcomes.findFirst({
			where: (decisionOutcomes, { eq }) => eq(decisionOutcomes.id, id),
			with: { decision: true, affectedStage: true },
		}),
	quest_unlock_condition_by_id: (id: number) =>
		db.query.questUnlockConditions.findFirst({
			where: (questUnlockConditions, { eq }) => eq(questUnlockConditions.id, id),
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
