import { embeddingTextGenerators } from "@tome-master/shared"
import { db } from "../.."

const { narrativeEvents, narrativeDestinations } = embeddingTextGenerators

export const embeddingTextForConsequence = async (id: number): Promise<string> => {
	const narrativeEvent = await db.query.narrativeEvents.findFirst({
		where: (narrativeEvent, { eq }) => eq(narrativeEvent.id, id),
		with: {
			relatedQuest: true,
			questStage: true,
			triggeringDecision: true,
		},
	})

	if (!narrativeEvent) {
		throw new Error(`Consequence with id ${id} not found`)
	}

	return narrativeEvents(narrativeEvent)
}

export const embeddingTextForNarrativeDestination = async (id: number): Promise<string> => {
	const narrativeDestination = await db.query.narrativeDestinations.findFirst({
		where: (narrativeDestination, { eq }) => eq(narrativeDestination.id, id),
		with: {
			region: true,
			conflict: true,
			questRoles: true,
			participantInvolvement: true,
			itemRelationships: true,
			worldConceptLinks: true,
		},
	})

	if (!narrativeDestination) {
		throw new Error(`Narrative destination with id ${id} not found`)
	}

	return narrativeDestinations(narrativeDestination)
}
