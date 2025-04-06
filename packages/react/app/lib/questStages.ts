import { db } from "./db"

const getRawQuestStages = async (id: number) => {
	return await db.query.questStages.findMany({
		where: (questStages, { eq }) => eq(questStages.questId, id),
		with: {
			incomingConsequences: { with: { decision: true } },
			incomingDecisions: { with: { consequences: true, fromStage: true } },
			quest: { columns: { name: true, id: true } },
			clues: true,
			location: { columns: { name: true, id: true } },
			outgoingDecisions: { with: { consequences: true, toStage: true } },
		},
	})
}

// Export the RawQuestStage type so it can be used by other modules
export type RawQuestStage = Awaited<ReturnType<typeof getRawQuestStages>>[number]

// Extract common properties from RawQuestStage that we want to keep
type StageBaseProps = Pick<RawQuestStage, "id" | "name" | "stage" | "dramatic_question" | "location">

// Define the stage decision type based on RawQuestStage's outgoingDecisions
export type StageDecision = RawQuestStage["outgoingDecisions"][number]

// Improved StageNode type definition that leverages RawQuestStage
export type StageNode =
	| (StageBaseProps & {
			branches: {
				decision: StageDecision
				nextStage: StageNode | { id: number; isCycle: true } | null
			}[]
	  })
	| { id: number; isCycle: true }
	| null

// Extract buildStageTree to be reusable
export function buildStageTree(
	stageId: number,
	stageMap: Map<number, RawQuestStage>,
	visited = new Set<number>(),
): StageNode {
	if (visited.has(stageId)) {
		return { id: stageId, isCycle: true } // Mark as cycle to avoid infinite recursion
	}

	const stage = stageMap.get(stageId)
	if (!stage) return null

	// Track visited stages to prevent cycles
	visited.add(stageId)

	// Process outgoing decisions and their target stages
	const branches = stage.outgoingDecisions
		.filter((decision) => decision.toStage)
		.map((decision) => {
			const nextStage = decision.toStage?.id
				? buildStageTree(decision.toStage.id, stageMap, new Set([...visited]))
				: null

			return { decision, nextStage }
		})

	// Return a clean stage object with essential data and branches
	return {
		id: stage.id,
		name: stage.name,
		stage: stage.stage,
		dramatic_question: stage.dramatic_question,
		location: stage.location,
		branches,
	}
}

export const getQuestStages = async (id: number) => {
	// 1. Get all stages for this quest
	const stages = await getRawQuestStages(id)

	// 2. Create a lookup map of stages
	const stageMap = new Map(stages.map((stage) => [stage.id, stage]))

	// 3. Find the root stage (with no incoming decisions)
	const rootStage = stages.find((stage) => stage.incomingDecisions.length === 0)

	if (!rootStage) {
		return { stages, stageTree: null } // Return flat list if no root found
	}

	// 5. Start building from root using the extracted function
	const stageTree = buildStageTree(rootStage.id, stageMap)

	// 6. Return both the flat list and the tree structure
	return {
		stages, // Original flat data (useful for lookups)
		stageTree, // Hierarchical structure
	}
}
