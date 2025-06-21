import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { getQuestStages } from "./questStages"

const questConfig = {
	findById: (id: number) =>
		db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, id),
			with: {
				affectingConsequences: true,
				incomingForeshadowing: true,
				hooks: true,
				itemRelations: true,
				narrativeDestinationContributions: true,
				participants: true,
				region: { columns: { name: true, id: true } },
				stages: { columns: { id: true, name: true } },
				outgoingRelations: { with: { targetQuest: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceQuest: { columns: { name: true, id: true } } } },
				triggeredEvents: true,
				loreLinks: true,
			},
		}),
	getAll: () =>
		db.query.quests.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				urgency: true,
				visibility: true,
				description: true,
				regionId: true,
			},
			with: {
				region: { columns: { name: true } },
			},
		}),
	getNamesAndIds: () =>
		db.query.quests.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllQuests = async () => {
	const quests = await questConfig.getAll()

	return addSlugs(quests)
}

export type Quest = Awaited<ReturnType<typeof getQuest>>

export const getQuest = async (slug: string) => {
	const selectedQuest = await questConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((quests) => quests.find((quest) => quest.slug === slug))

	if (!selectedQuest) {
		throw new EntityNotFoundError("Quest", slug)
	}

	const [byId, stageData] = await Promise.all([
		questConfig.findById(selectedQuest.id),
		getQuestStages(selectedQuest.id),
	])

	if (!byId) {
		throw new EntityNotFoundError("Quest", selectedQuest.id)
	}

	const unified = unifyRelations(byId)
		.from({ property: "incomingRelations", key: "sourceQuest" })
		.with({ property: "outgoingRelations", key: "targetQuest" })
		.to({ property: "relations", key: "quest" })

	if (unified) {
		const combinedData = { ...unified, ...stageData }
		return addSlugs(combinedData)
	}

	throw new EntityNotFoundError("Quest", selectedQuest.id)
}
