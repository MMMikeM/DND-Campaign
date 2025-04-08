import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const foreshadowingConfig = {
	findById: (id: number) =>
		db.query.narrativeForeshadowing.findFirst({
			where: (foreshadowing, { eq }) => eq(foreshadowing.id, id),
			with: {
				sourceStage: {
					columns: { name: true, id: true },
					with: { quest: { columns: { name: true, id: true } } },
				},
				sourceSite: { columns: { name: true, id: true } },
				sourceNpc: { columns: { name: true, id: true } },
				sourceFaction: { columns: { name: true, id: true } },
				targetQuest: { columns: { name: true, id: true } },
				targetTwist: { columns: { twistType: true, id: true } },
				targetNpc: { columns: { name: true, id: true } },
				targetArc: { columns: { name: true, id: true } },
			},
		}),
	getAll: () => db.query.narrativeForeshadowing.findMany({}),
	getNamesAndIds: () =>
		db.query.narrativeForeshadowing.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllForeshadowing = async () => {
	const foreshadowing = await foreshadowingConfig.getAll()
	return addSlugs(foreshadowing)
}

export type Foreshadowing = Awaited<ReturnType<typeof getForeshadowing>>

export const getForeshadowing = async (slug: string) => {
	const selectedForeshadowing = await foreshadowingConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((items) => items.find((item) => item.slug === slug))

	if (!selectedForeshadowing) {
		throw new EntityNotFoundError("Foreshadowing", slug)
	}

	const byId = await foreshadowingConfig.findById(selectedForeshadowing.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Foreshadowing", selectedForeshadowing.id) // Use custom error
}
