import { db } from "../db"

const getRawQuestStages = async (id: number) =>
	await db.query.questStages.findMany({
		where: (questStages, { eq }) => eq(questStages.questId, id),
		with: {
			outgoingDecisions: { with: { toStage: true } },
			incomingDecisions: { with: { fromStage: true } },
			items: true,
			quest: { columns: { name: true, id: true } },
			site: { columns: { name: true, id: true } },
			deliveryNpc: { columns: { name: true, id: true } },
			outgoingForeshadowing: true,
			npcInvolvement: true,
			narrativeEvents: true,
		},
	})

export type RawQuestStage = Awaited<ReturnType<typeof getRawQuestStages>>[number]

type StageBaseProps = Pick<RawQuestStage, "id" | "name" | "stageOrder" | "dramatic_question">

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
		stageOrder: stage.stageOrder,
		dramatic_question: stage.dramatic_question,
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
