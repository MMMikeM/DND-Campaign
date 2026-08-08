import { bySlugOrId, foreshadowingWithSources, foreshadowingWithTargets, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import { unifyRelations } from "../utils/unify"

const questConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.quests.findFirst({
			where,
			with: {
				affectingConsequences: true,
				hooks: true,
				incomingForeshadowing: foreshadowingWithSources,
				outgoingForeshadowing: foreshadowingWithTargets,
				itemConnections: { with: { sourceItem: nameAndId } },
				loreLinks: true,
				participants: { with: { npc: nameAndId, faction: nameAndId } },
				stages: nameAndId,
				outgoingRelations: { with: { targetQuest: nameAndId } },
				incomingRelations: { with: { sourceQuest: nameAndId } },
				dependentQuests: true,
				prerequisiteQuest: true,
				stageDecisions: true,
				triggeredConsequences: true,
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

	return unifyRelations(quest)
		.from({ property: "incomingRelations", key: "sourceQuest" })
		.with({ property: "outgoingRelations", key: "targetQuest" })
		.to({ property: "relations", key: "quest" })
}

export const getQuestNames = () => questConfig.getNamesAndIds()
