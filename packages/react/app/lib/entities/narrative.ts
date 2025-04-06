import { db } from "../db"
import addSlugs from "../utils/addSlugs"

import { EntityNotFoundError } from "../errors"

const narrativeConfig = {
	findById: (id: number) =>
		db.query.narrativeArcs.findFirst({
			where: (arcs, { eq }) => eq(arcs.id, id),
			with: {
				foreshadowing: true,
				worldChanges: true,
				members: { with: { quest: { columns: { name: true, id: true } } } },
			},
		}),
	getAll: () => db.query.narrativeArcs.findMany({}),
	getNamesAndIds: () =>
		db.query.narrativeArcs.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllNarrativeArcs = async () => {
	const arcs = await narrativeConfig.getAll()

	return addSlugs(arcs)
}

export type NarrativeArc = Awaited<ReturnType<typeof getNarrativeArc>>

export const getNarrativeArc = async (slug: string) => {
	const selectedArc = await narrativeConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((arcs) => arcs.find((arc) => arc.slug === slug))

	if (!selectedArc) {
		throw new EntityNotFoundError("Narrative Arc", slug)
	}

	const byId = await narrativeConfig.findById(selectedArc.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Narrative Arc", selectedArc.id)
}
