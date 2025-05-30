import { buildEmbedding } from "../embedding-helpers"
import type { NarrativeEventEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForNarrativeEvent = (input: NarrativeEventEmbeddingInput): string => {
	const {
		name,
		description,
		eventType,
		intendedRhythmEffect,
		narrativePlacement,
		impactSeverity,
		complication_details,
		escalation_details,
		twist_reveal_details,
		relatedQuest,
		questStage,
		triggeringDecision,
		triggeredConsequences,
	} = input

	return buildEmbedding({
		narrativeEvent: name,
		overview: description,
		eventType,
		intendedRhythmEffect,
		narrativePlacement,
		impactSeverity,
		complication_details,
		escalation_details,
		twist_reveal_details,
		relatedQuest: relatedQuest?.name,
		questStage: questStage?.name,
		triggeringDecision: triggeringDecision?.name,
		triggeredConsequences: triggeredConsequences?.map(
			({ name, consequenceType, severity, playerImpactFeel, description, conflictImpactDescription }) => ({
				consequence: name,
				type: consequenceType,
				severity,
				playerImpact: playerImpactFeel,
				description,
				conflictImpact: conflictImpactDescription,
			}),
		),
	})
}
