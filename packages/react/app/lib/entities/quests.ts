import {
	bySlugOrId,
	consequenceWithAffected,
	consequenceWithTrigger,
	foreshadowingWithSources,
	foreshadowingWithTargets,
	nameAndId,
} from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const questConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.quests.findFirst({
			where,
			with: {
				affectingConsequences: consequenceWithTrigger,
				hooks: true,
				incomingForeshadowing: foreshadowingWithSources,
				outgoingForeshadowing: foreshadowingWithTargets,
				itemConnections: { with: { sourceItem: nameAndId } },
				loreLinks: true,
				participants: { with: { npc: nameAndId, faction: nameAndId } },
				stages: {
					columns: {
						deliveryNpcId: false,
						siteId: false,
					},
					with: {
						deliveryNpc: nameAndId,
						incomingDecisions: { with: { sourceStage: true } },
						itemConnections: { with: { sourceItem: nameAndId } },
						npcInvolvement: true,
						outgoingDecisions: { with: { targetStage: true, consequences: true } },
						outgoingForeshadowing: true,
						quest: nameAndId,
						site: nameAndId,
					}
				},
				outgoingRelations: { with: { targetQuest: nameAndId } },
				incomingRelations: { with: { sourceQuest: nameAndId } },
				dependentQuests: true,
				prerequisiteQuest: true,
				triggeredConsequences: consequenceWithAffected,

			},
		}),
	getAll: () =>
		db.query.quests.findMany({
			columns: {
				id: true,
				name: true,
				slug: true,
				type: true,
				urgency: true,
				description: true,
				mood: true,
				objectives: true,
				rewards: true,
			},
		}),
	getNamesAndIds: () => db.query.quests.findMany(nameAndId),
}

export const getAllQuests = () => questConfig.getAll()

export type Quest = Awaited<ReturnType<typeof getQuest>>

export const getQuest = async (slugOrId: string) => {
	const quest = await questConfig.findBy(bySlugOrId(slugOrId))

	if (!quest) {
		throw new EntityNotFoundError("Quest", slugOrId)
	}

	const { incomingRelations, outgoingRelations, ...rest } = quest

	return {
		...rest,
		relations: [
			...outgoingRelations.map(({ targetQuest, ...relation }) => ({
				...relation,
				quest: targetQuest,
				direction: "outgoing" as const,
			})),
			...incomingRelations.map(({ sourceQuest, ...relation }) => ({
				...relation,
				quest: sourceQuest,
				direction: "incoming" as const,
			})),
		],
	}
}

export const getQuestNames = () => questConfig.getNamesAndIds()

export type QuestStage = Quest["stages"][number]

export type StageDecision = QuestStage["outgoingDecisions"][number]
