import { createEmbeddingBuilder } from "../embedding-helpers"
import type {
	QuestEmbeddingInput,
	QuestStageEmbeddingInput,
	StageDecisionEmbeddingInput,
} from "../embedding-input-types"

export const embeddingTextForQuest = (quest: QuestEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Quest", quest.name, quest.description)

	builder.addFields("Quest Details", {
		type: quest.type,
		urgency: quest.urgency,
		visibility: quest.visibility,
		mood: quest.mood,
		region: quest.regionName,
		moralFocus: quest.moralSpectrumFocus,
		pacingRole: quest.intendedPacingRole,
		playerExperienceGoal: quest.primaryPlayerExperienceGoal,
		prerequisiteQuest: quest.prerequisiteQuestName,
		unlockConditions: quest.otherUnlockConditionsNotes,
	})

	builder
		.addList("Objectives", quest.objectives)
		.addList("Success Outcomes", quest.successOutcomes)
		.addList("Failure Outcomes", quest.failureOutcomes)
		.addList("Rewards", quest.rewards)
		.addList("Themes", quest.themes)
		.addList("Inspirations", quest.inspirations)
		.addList("Key Participants", quest.keyParticipantSummaries)

	return builder.build()
}

export const embeddingTextForQuestStage = (stage: QuestStageEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Quest Stage", stage.name, stage.description)

	builder.addFields("Stage Details", {
		quest: stage.parentQuestName,
		stageOrder: stage.stageOrder,
		location: stage.siteName,
		stageType: stage.stageType,
		complexityLevel: stage.intendedComplexityLevel,
		importance: stage.stageImportance,
		dramaticQuestion: stage.dramatic_question,
	})

	builder
		.addList("Objectives", stage.objectives)
		.addList("Completion Paths", stage.completionPaths)
		.addList("Encounters", stage.encounters)
		.addList("Dramatic Moments", stage.dramatic_moments)
		.addList("Sensory Elements", stage.sensory_elements)

	return builder.build()
}

export const embeddingTextForStageDecision = (decision: StageDecisionEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Stage Decision", decision.name, decision.description)

	builder.addFields(
		"Decision Details",
		{
			quest: decision.parentQuestName,
			fromStage: decision.fromStageName,
			toStage: decision.toStageName,
			decisionType: decision.decisionType,
			conditionType: decision.conditionType,
			conditionValue: decision.conditionValue,
			ambiguityLevel: decision.ambiguityLevel,
			failureLeadsToRetry:
				decision.failure_leads_to_retry === true ? "yes" : decision.failure_leads_to_retry === false ? "no" : undefined,
			failureLesson: decision.failure_lesson_learned,
		},
		{
			// Don't convert spaces for the boolean field
			transform: {
				failureLeadsToRetry: (value) => value,
			},
		},
	)

	builder
		.addList("Success Outcomes", decision.successDescription)
		.addList("Failure Outcomes", decision.failureDescription)
		.addList("Narrative Transitions", decision.narrativeTransition)
		.addList("Player Reactions", decision.potential_player_reactions)
		.addList("Options", decision.options)

	return builder.build()
}
