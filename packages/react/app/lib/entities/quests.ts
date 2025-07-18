import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { nameAndId } from "."

const questConfig = {
	findById: (id: number) =>
		db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, id),
			with: {
				affectingConsequences: true,
				hooks: true,
				incomingForeshadowing: true,
				itemRelations: true,
				loreLinks: true,
				participants: true,
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
				type: true,
				urgency: true,
				description: true,
			},
		}),
	getNamesAndIds: () => db.query.quests.findMany(nameAndId),
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
		.then((quests) => quests.find((quest) => quest.slug === slug || quest.id === Number(slug)))

	if (!selectedQuest) {
		throw new EntityNotFoundError("Quest", slug)
	}

	const byId = await questConfig.findById(selectedQuest.id)

	if (!byId) {
		throw new EntityNotFoundError("Quest", selectedQuest.id)
	}

	const unified = unifyRelations(byId)
		.from({ property: "incomingRelations", key: "sourceQuest" })
		.with({ property: "outgoingRelations", key: "targetQuest" })
		.to({ property: "relations", key: "quest" })

	if (unified) {
		return addSlugs(unified)
	}

	throw new EntityNotFoundError("Quest", selectedQuest.id)
}
