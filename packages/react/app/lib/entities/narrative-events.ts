import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const narrativeEventConfig = {
	findById: (id: number) =>
		db.query.narrativeEvents.findFirst({
			where: (arcs, { eq }) => eq(arcs.id, id),
			with: {
				questStage: nameAndId,
				relatedQuest: nameAndId,
				triggeringStageDecision: nameAndId,
				incomingForeshadowing: true,
			},
		}),
	getAll: () => db.query.narrativeEvents.findMany({}),
	getNamesAndIds: () => db.query.narrativeEvents.findMany(nameAndId),
}

export const getAllNarrativeEvents = async () => {
	const arcs = await narrativeEventConfig.getAll()

	return addSlugs(arcs)
}

export type NarrativeEvent = Awaited<ReturnType<typeof getNarrativeEvent>>

export const getNarrativeEvent = async (slug: string) => {
	const selectedEvent = await narrativeEventConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((events) => events.find((event) => event.slug === slug))

	if (!selectedEvent) {
		throw new EntityNotFoundError("Narrative Event", slug)
	}

	const byId = await narrativeEventConfig.findById(selectedEvent.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Narrative Event", selectedEvent.id)
}
