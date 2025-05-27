import { EmbeddingBuilder } from "./embedding-helpers"
import type {
	QuestEmbeddingInput,
	QuestStageEmbeddingInput,
	StageDecisionEmbeddingInput,
} from "./embedding-input-types"

export const embeddingTextForQuest = (quest: QuestEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Quest", quest.name)
		.overview(quest.description)
		.fields([
			{ label: "Type", value: quest.type },
			{ label: "Urgency", value: quest.urgency },
			{ label: "Visibility", value: quest.visibility },
			{ label: "Mood", value: quest.mood },
			{ label: "Region", value: quest.regionName },
			{ label: "Moral Focus", value: quest.moralSpectrumFocus },
			{ label: "Pacing Role", value: quest.intendedPacingRole },
			{ label: "Player Experience Goal", value: quest.primaryPlayerExperienceGoal },
			{ label: "Prerequisite Quest", value: quest.prerequisiteQuestName },
			{ label: "Unlock Conditions", value: quest.otherUnlockConditionsNotes },
		])
		.lists([
			{ title: "Objectives", items: quest.objectives },
			{ title: "Success Outcomes", items: quest.successOutcomes },
			{ title: "Failure Outcomes", items: quest.failureOutcomes },
			{ title: "Rewards", items: quest.rewards },
			{ title: "Themes", items: quest.themes },
			{ title: "Inspirations", items: quest.inspirations },
			{ title: "Key Participants", items: quest.keyParticipantSummaries },
		])
		.build()
}

export const embeddingTextForQuestStage = (stage: QuestStageEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Quest Stage", stage.name)
		.overview(stage.description)
		.fields([
			{ label: "Quest", value: stage.parentQuestName },
			{ label: "Stage Order", value: stage.stageOrder },
			{ label: "Location", value: stage.siteName },
			{ label: "Stage Type", value: stage.stageType },
			{ label: "Complexity Level", value: stage.intendedComplexityLevel },
			{ label: "Importance", value: stage.stageImportance },
			{ label: "Dramatic Question", value: stage.dramatic_question },
		])
		.lists([
			{ title: "Objectives", items: stage.objectives },
			{ title: "Completion Paths", items: stage.completionPaths },
			{ title: "Encounters", items: stage.encounters },
			{ title: "Dramatic Moments", items: stage.dramatic_moments },
			{ title: "Sensory Elements", items: stage.sensory_elements },
		])
		.build()
}

export const embeddingTextForStageDecision = (decision: StageDecisionEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Stage Decision", decision.name)
		.overview(decision.description)
		.fields([
			{ label: "Quest", value: decision.parentQuestName },
			{ label: "From Stage", value: decision.fromStageName },
			{ label: "To Stage", value: decision.toStageName },
			{ label: "Decision Type", value: decision.decisionType },
			{ label: "Condition Type", value: decision.conditionType },
			{ label: "Condition Value", value: decision.conditionValue },
			{ label: "Ambiguity Level", value: decision.ambiguityLevel },
			{
				label: "Failure Leads to Retry",
				value:
					decision.failure_leads_to_retry === true
						? "yes"
						: decision.failure_leads_to_retry === false
							? "no"
							: undefined,
				convertSpaces: false,
			},
			{ label: "Failure Lesson", value: decision.failure_lesson_learned },
		])
		.lists([
			{ title: "Success Outcomes", items: decision.successDescription },
			{ title: "Failure Outcomes", items: decision.failureDescription },
			{ title: "Narrative Transitions", items: decision.narrativeTransition },
			{ title: "Player Reactions", items: decision.potential_player_reactions },
			{ title: "Options", items: decision.options },
		])
		.build()
}
