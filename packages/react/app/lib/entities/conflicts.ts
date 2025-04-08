import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const conflictConfig = {
	findById: (id: number) =>
		db.query.majorConflicts.findFirst({
			where: (conflicts, { eq }) => eq(conflicts.id, id),
			with: {
				worldChanges: { columns: { id: true, name: true } },
				participants: { with: { faction: { columns: { name: true, id: true } } } },
				progression: {
					with: {
						quest: { columns: { name: true, id: true } },
					},
				},
				primaryRegion: { columns: { name: true, id: true } },
			},
		}),
	getAll: () =>
		db.query.majorConflicts.findMany({
			with: {
				primaryRegion: { columns: { name: true } },
			},
		}),
	getNamesAndIds: () =>
		db.query.majorConflicts.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllConflicts = async () => {
	const conflicts = await conflictConfig.getAll()

	return addSlugs(conflicts)
}

export type Conflict = Awaited<ReturnType<typeof getConflict>>

export const getConflict = async (slug: string) => {
	const selectedConflict = await conflictConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((conflicts) => conflicts.find((conflict) => conflict.slug === slug))

	if (!selectedConflict) {
		throw new EntityNotFoundError("Conflict", slug)
	}

	const byId = await conflictConfig.findById(selectedConflict.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Conflict", selectedConflict.id)
}
