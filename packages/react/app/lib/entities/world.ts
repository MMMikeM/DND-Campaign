import { db } from "../db"
import addSlugs from "../utils/addSlugs"
import { EntityNotFoundError } from "../errors"

const worldConfig = {
	findById: (id: number) =>
		db.query.worldStateChanges.findFirst({
			where: (changes, { eq }) => eq(changes.id, id),
			with: {
				sourceQuest: { columns: { name: true, id: true } },
				sourceDecision: { columns: { name: true, id: true } },
				sourceConflict: { columns: { name: true, id: true } },
				affectedFaction: { columns: { name: true, id: true } },
				affectedRegion: { columns: { name: true, id: true } },
				affectedArea: { columns: { name: true, id: true } },
				affectedSite: { columns: { name: true, id: true } },
				affectedNpc: { columns: { name: true, id: true } },
				leadsToQuest: { columns: { name: true, id: true } },
			},
		}),
	getAll: () => db.query.worldStateChanges.findMany({}),
	getNamesAndIds: () =>
		db.query.worldStateChanges.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllWorldChanges = async () => {
	const changes = await worldConfig.getAll()

	return addSlugs(changes)
}

export type WorldChange = Awaited<ReturnType<typeof getWorldChange>>

export const getWorldChange = async (slug: string) => {
	const selectedChange = await worldConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((changes) => changes.find((change) => change.slug === slug))

	if (!selectedChange) {
		throw new EntityNotFoundError("World Change", slug)
	}

	const byId = await worldConfig.findById(selectedChange.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("World Change", selectedChange.id)
}
