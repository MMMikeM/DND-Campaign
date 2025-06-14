import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const foreshadowingConfig = {
	findById: (id: number) =>
		db.query.foreshadowing.findFirst({
			where: (foreshadowing, { eq }) => eq(foreshadowing.id, id),
			with: {
				sourceNpc: { columns: { id: true, name: true } },
				sourceQuest: { columns: { id: true, name: true } },
				sourceSite: { columns: { id: true, name: true } },
				sourceQuestStage: { columns: { id: true, name: true } },
				targetFaction: { columns: { id: true, name: true } },
				targetNpc: { columns: { id: true, name: true } },
				targetQuest: { columns: { id: true, name: true } },
				targetSite: { columns: { id: true, name: true } },
				targetWorldConcept: { columns: { id: true, name: true } },
				targetConflict: { columns: { id: true, name: true } },
				targetNarrativeDestination: { columns: { id: true, name: true } },
				targetNarrativeEvent: { columns: { id: true, name: true } },
			},
		}),
	getAll: () => db.query.foreshadowing.findMany({}),
	getNamesAndIds: () =>
		db.query.foreshadowing.findMany({
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
