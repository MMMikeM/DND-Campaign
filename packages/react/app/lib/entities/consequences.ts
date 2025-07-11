import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const consequenceConfig = {
	findById: (id: number) =>
		db.query.consequences.findFirst({
			where: (arcs, { eq }) => eq(arcs.id, id),
			with: {
				affectedArea: nameAndId,
				affectedFaction: nameAndId,
				affectedSite: nameAndId,
				affectedQuest: nameAndId,
				affectedNpc: nameAndId,
				affectedRegion: nameAndId,
				affectedConflict: nameAndId,
			},
		}),
	getAll: () => db.query.consequences.findMany({}),
	getNamesAndIds: () => db.query.consequences.findMany(nameAndId),
}

export const getAllConsequences = async () => {
	const arcs = await consequenceConfig.getAll()

	return addSlugs(arcs)
}

export type Consequence = Awaited<ReturnType<typeof getConsequence>>

export const getConsequence = async (slug: string) => {
	const selectedEvent = await consequenceConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((events) => events.find((event) => event.slug === slug || event.id === Number(slug)))

	if (!selectedEvent) {
		throw new EntityNotFoundError("Consequence", slug)
	}

	const byId = await consequenceConfig.findById(selectedEvent.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Consequence", selectedEvent.id)
}
