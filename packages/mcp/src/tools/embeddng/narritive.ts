import { embeddingTextGenerators } from "@tome-master/shared"
import { db } from "../.."

export const embeddingTextForNarrativeEvent = async (id: number): Promise<string> => {
	const narrativeEvent = await db.query.narrativeEvents.findFirst({
		where: (narrativeEvent, { eq }) => eq(narrativeEvent.id, id),
		with: {
			triggeringDecision: {
				columns: { name: true },
			},
			relatedQuest: {
				columns: { name: true },
			},
			questStage: {
				with: {
					quest: {
						columns: { name: true },
					},
				},
			},
		},
	})

	if (!narrativeEvent) {
		throw new Error(`Narrative event with id ${id} not found`)
	}

	const input: Parameters<typeof embeddingTextGenerators.narrativeEvents>[0] = {
		name: narrativeEvent.name,
		complication_details: narrativeEvent.complication_details,
		escalation_details: narrativeEvent.escalation_details,
		twist_reveal_details: narrativeEvent.twist_reveal_details,
		description: narrativeEvent.description,
		creativePrompts: narrativeEvent.creativePrompts,
		gmNotes: narrativeEvent.gmNotes,
		tags: narrativeEvent.tags,
		eventType: narrativeEvent.eventType,
		intendedRhythmEffect: narrativeEvent.intendedRhythmEffect,
		narrativePlacement: narrativeEvent.narrativePlacement,
		impactSeverity: narrativeEvent.impactSeverity,
		questStageName: narrativeEvent.questStage?.name,
		relatedQuestName: narrativeEvent.relatedQuest?.name,
		triggeringDecisionName: narrativeEvent.triggeringDecision?.name,
	}

	return embeddingTextGenerators.narrativeEvents(input)
}
