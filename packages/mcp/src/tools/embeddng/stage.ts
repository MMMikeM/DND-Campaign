import { embeddingTextGenerators } from "@tome-master/shared"
import { db } from "../.."

export const embeddingTextForStageDecision = async (id: number): Promise<string> => {
	const stageDecision = await db.query.stageDecisions.findFirst({
		where: (stageDecision, { eq }) => eq(stageDecision.id, id),
		with: {},
	})

	if (!stageDecision) {
		throw new Error(`Stage decision with id ${id} not found`)
	}

	const input: Parameters<typeof embeddingTextGenerators.stageDecisions>[0] = {
		fromStageName: stageDecision.stage.name,
		name: stageDecision.name,
		parentQuestName: stageDecision.stage.quest.name,
		toStageName: stageDecision.decision.toStage?.name,
		description: stageDecision.description,
		decisionType: stageDecision.decisionType,
		ambiguityLevel: stageDecision.ambiguityLevel,
	}

	return embeddingTextGenerators.stageDecisions(input)
}
