import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./quest-tools.schema"
import { createManageEntityHandler, createManageSchema, nameAndId } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.questTables)

export const entityGetters = createEntityGetters({
	all_quests: () => db.query.quests.findMany({}),
	all_quest_hooks: () => db.query.questHooks.findMany({}),
	all_quest_participants: () => db.query.questParticipants.findMany({}),
	all_quest_relations: () => db.query.questRelations.findMany({}),

	quest_by_id: (id: number) =>
		db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, id),
			with: {
				dependentQuests: true,
				prerequisiteQuest: true,
				stageDecisions: true,
				affectingConsequences: true,
				triggeredConsequences: true,
				incomingForeshadowing: true,
				outgoingForeshadowing: true,
				hooks: true,
				incomingRelations: true,
				itemRelations: true,
				outgoingRelations: true,
				participants: true,
				loreLinks: true,
				stages: true,
			},
		}),

	quest_hook_by_id: (id: number) =>
		db.query.questHooks.findFirst({
			where: (questHooks, { eq }) => eq(questHooks.id, id),
			with: {
				deliveryNpc: nameAndId,
				faction: nameAndId,
				site: nameAndId,
				quest: nameAndId,
			},
		}),
	quest_participant_by_id: (id: number) =>
		db.query.questParticipants.findFirst({
			where: (questParticipants, { eq }) => eq(questParticipants.id, id),
			with: {
				quest: nameAndId,
				faction: nameAndId,
				npc: nameAndId,
			},
		}),
	quest_relation_by_id: (id: number) =>
		db.query.questRelations.findFirst({
			where: (questRelations, { eq }) => eq(questRelations.id, id),
			with: {
				sourceQuest: nameAndId,
				targetQuest: nameAndId,
			},
		}),
})

export const questToolDefinitions: Record<"manage_quest", ToolDefinition> = {
	manage_quest: {
		enums: tables.questTables.enums,
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
