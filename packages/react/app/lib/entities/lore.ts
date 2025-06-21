import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const loreConfig = {
	findById: (id: number) =>
		db.query.lore.findFirst({
			where: (changes, { eq }) => eq(changes.id, id),
			with: {
				itemRelations: {
					with: {
						sourceItem: { columns: { id: true, name: true } },
					},
				},
				links: {
					with: {
						lore: { columns: { id: true, name: true } },
						targetConflict: { columns: { id: true, name: true } },
						targetFaction: { columns: { id: true, name: true } },
						targetNpc: { columns: { id: true, name: true } },
						targetQuest: { columns: { id: true, name: true } },
						targetRegion: { columns: { id: true, name: true } },
						targetLore: { columns: { id: true, name: true } },
					},
				},
				incomingForeshadowing: true,
			},
		}),
	getAll: () => db.query.lore.findMany({}),
	getNamesAndIds: () =>
		db.query.lore.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllLore = async () => {
	const lore = await loreConfig.getAll()

	return addSlugs(lore)
}

export type Lore = Awaited<ReturnType<typeof getLore>>

export const getLore = async (slug: string) => {
	const selectedConcept = await loreConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((concepts) => concepts.find((concept) => concept.slug === slug))

	if (!selectedConcept) {
		throw new EntityNotFoundError("Lore", slug)
	}

	const byId = await loreConfig.findById(selectedConcept.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Lore", selectedConcept.id)
}
