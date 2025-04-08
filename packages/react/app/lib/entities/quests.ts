import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"

const getRawQuestStages = async (id: number) => {
	return await db.query.questStages.findMany({
		where: (questStages, { eq }) => eq(questStages.questId, id),
		with: {
			incomingConsequences: { with: { decision: true } },
			incomingDecisions: { with: { consequences: true, fromStage: true } },
			quest: { columns: { name: true, id: true } },
			clues: true,
			site: { columns: { name: true, id: true } },
			outgoingDecisions: { with: { consequences: true, toStage: true } },
		},
	})
}

export type RawQuestStage = Awaited<ReturnType<typeof getRawQuestStages>>[number]

type StageBaseProps = Pick<RawQuestStage, "id" | "name" | "stage" | "dramatic_question" | "site">

export type StageDecision = RawQuestStage["outgoingDecisions"][number]

export type StageNode =
	| (StageBaseProps & {
			branches: {
				decision: StageDecision
				nextStage: StageNode | { id: number; isCycle: true } | null
			}[]
	  })
	| { id: number; isCycle: true }
	| null

export function buildStageTree(
	stageId: number,
	stageMap: Map<number, RawQuestStage>,
	visited = new Set<number>(),
): StageNode {
	if (visited.has(stageId)) {
		return { id: stageId, isCycle: true }
	}

	const stage = stageMap.get(stageId)
	if (!stage) return null

	visited.add(stageId)

	const branches = stage.outgoingDecisions
		.filter((decision) => decision.toStage)
		.map((decision) => {
			const nextStage = decision.toStage?.id
				? buildStageTree(decision.toStage.id, stageMap, new Set([...visited]))
				: null

			return { decision, nextStage }
		})

	return {
		id: stage.id,
		name: stage.name,
		stage: stage.stage,
		dramatic_question: stage.dramatic_question,
		site: stage.site,
		branches,
	}
}

export const getQuestStages = async (id: number) => {
	const stages = await getRawQuestStages(id)

	const stageMap = new Map(stages.map((stage) => [stage.id, stage]))

	const rootStage = stages.find((stage) => stage.incomingDecisions.length === 0)

	if (!rootStage) {
		return { stages, stageTree: null }
	}

	const stageTree = buildStageTree(rootStage.id, stageMap)

	return {
		stages,
		stageTree,
	}
}

const questConfig = {
	findById: (id: number) =>
		db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, id),
			with: {
				items: true,
				unlockConditions: true,
				twists: true,
				futureTriggers: true,
				region: { columns: { name: true, id: true } },
				stages: { columns: { id: true, name: true } },
				worldChanges: { columns: { id: true, name: true } },
				incomingRelations: { with: { sourceQuest: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetQuest: { columns: { name: true, id: true } } } },
				factions: {
					with: {
						faction: {
							columns: {
								name: true,
								id: true,
							},
						},
					},
				},
				npcs: {
					with: {
						npc: {
							columns: {
								name: true,
								id: true,
							},
						},
					},
				},
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
