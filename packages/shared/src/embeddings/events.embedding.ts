import { EmbeddingBuilder } from "./embedding-helpers"
import type { ConsequenceEmbeddingInput, NarrativeEventEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForNarrativeEvent = (event: NarrativeEventEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Narrative Event", event.name)
		.overview(event.description)
		.fields([
			{ label: "Type", value: event.eventType },
			{ label: "Rhythm Effect", value: event.intendedRhythmEffect },
			{ label: "Narrative Placement", value: event.narrativePlacement },
			{ label: "Impact Severity", value: event.impactSeverity },
			{ label: "Related Quest", value: event.relatedQuestName },
			{ label: "Quest Stage", value: event.questStageName },
			{ label: "Triggering Decision", value: event.triggeringDecisionName },
			{ label: "Complication Details", value: event.complication_details },
			{ label: "Escalation Details", value: event.escalation_details },
			{ label: "Twist/Reveal Details", value: event.twist_reveal_details },
		])
		.build()
}

export const embeddingTextForConsequence = (consequence: ConsequenceEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Consequence", consequence.name)
		.overview(consequence.description)
		.fields([
			{ label: "Type", value: consequence.consequenceType },
			{ label: "Severity", value: consequence.severity },
			{ label: "Visibility", value: consequence.visibility },
			{ label: "Timeframe", value: consequence.timeframe },
			{ label: "Source Type", value: consequence.sourceType },
			{ label: "Player Impact Feel", value: consequence.playerImpactFeel },
			{ label: "Conflict Impact", value: consequence.conflictImpactDescription },
		])
		.conditionalFieldSection("Triggers", [
			{ label: "Triggered by Decision", value: consequence.triggerDecisionName },
			{ label: "Triggered by Quest", value: consequence.triggerQuestName },
			{ label: "Triggered by Conflict", value: consequence.triggerConflictName },
		])
		.conditionalFieldSection("Effects", [
			{ label: "Affected Faction", value: consequence.affectedFactionName },
			{ label: "Affected Region", value: consequence.affectedRegionName },
			{ label: "Affected Area", value: consequence.affectedAreaName },
			{ label: "Affected Site", value: consequence.affectedSiteName },
			{ label: "Affected NPC", value: consequence.affectedNpcName },
			{ label: "Affected Destination", value: consequence.affectedDestinationName },
			{ label: "Affected Conflict", value: consequence.affectedConflictNameAsEffect },
			{ label: "Future Quest", value: consequence.futureQuestName },
		])
		.build()
}
