import { createEmbeddingBuilder } from "../embedding-helpers"
import type { ConsequenceEmbeddingInput, NarrativeEventEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForNarrativeEvent = (event: NarrativeEventEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Narrative Event", event.name, event.description)

	builder.addFields("Event Details", {
		type: event.eventType,
		rhythmEffect: event.intendedRhythmEffect,
		narrativePlacement: event.narrativePlacement,
		impactSeverity: event.impactSeverity,
		relatedQuest: event.relatedQuestName,
		questStage: event.questStageName,
		triggeringDecision: event.triggeringDecisionName,
	})

	builder
		.ifPresent(event.complication_details, (b) => b.addSection("Complication Details", event.complication_details))
		.ifPresent(event.escalation_details, (b) => b.addSection("Escalation Details", event.escalation_details))
		.ifPresent(event.twist_reveal_details, (b) => b.addSection("Twist/Reveal Details", event.twist_reveal_details))

	return builder.build()
}

export const embeddingTextForConsequence = (consequence: ConsequenceEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Consequence", consequence.name, consequence.description)

	builder.addFields("Core Details", {
		type: consequence.consequenceType,
		severity: consequence.severity,
		visibility: consequence.visibility,
		timeframe: consequence.timeframe,
		sourceType: consequence.sourceType,
		playerImpactFeel: consequence.playerImpactFeel,
	})

	builder.ifPresent(consequence.conflictImpactDescription, (b) =>
		b.addSection("Conflict Impact", consequence.conflictImpactDescription),
	)

	// Triggers section
	const triggers: Record<string, unknown> = {}
	if (consequence.triggerDecisionName) triggers.triggeredByDecision = consequence.triggerDecisionName
	if (consequence.triggerQuestName) triggers.triggeredByQuest = consequence.triggerQuestName
	if (consequence.triggerConflictName) triggers.triggeredByConflict = consequence.triggerConflictName

	if (Object.keys(triggers).length > 0) {
		builder.addFields("Triggers", triggers)
	}

	// Effects section
	const effects: Record<string, unknown> = {}
	if (consequence.affectedFactionName) effects.affectedFaction = consequence.affectedFactionName
	if (consequence.affectedRegionName) effects.affectedRegion = consequence.affectedRegionName
	if (consequence.affectedAreaName) effects.affectedArea = consequence.affectedAreaName
	if (consequence.affectedSiteName) effects.affectedSite = consequence.affectedSiteName
	if (consequence.affectedNpcName) effects.affectedNpc = consequence.affectedNpcName
	if (consequence.affectedDestinationName) effects.affectedDestination = consequence.affectedDestinationName
	if (consequence.affectedConflictNameAsEffect) effects.affectedConflict = consequence.affectedConflictNameAsEffect
	if (consequence.futureQuestName) effects.futureQuest = consequence.futureQuestName

	if (Object.keys(effects).length > 0) {
		builder.addFields("Effects", effects)
	}

	return builder.build()
}
