import { db } from "../db"
import { addSlugs } from "../utils/addSlugs"

const loreConfig = {
	findById: (id: number) =>
		db.query.lore.findFirst({
			where: (lore, { eq }) => eq(lore.id, id),
			with: {
				itemRelations: {
					with: {
						sourceItem: { columns: { id: true, name: true } },
					},
				},
				incomingForeshadowing: true,
				links: {
					with: {
						region: { columns: { id: true, name: true } },
						faction: { columns: { id: true, name: true } },
						npc: { columns: { id: true, name: true } },
						conflict: { columns: { id: true, name: true } },
						quest: { columns: { id: true, name: true } },
						foreshadowing: { columns: { id: true, name: true } },
						relatedLore: { columns: { id: true, name: true } },
					},
				},
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

export type Lore = NonNullable<Awaited<ReturnType<typeof loreConfig.findById>>>

export async function getLoreById(id: number) {
	const lore = await loreConfig.findById(id)
	if (!lore) {
		return null
	}
	return addSlugs(lore)
}

export async function getAllLore() {
	const allLore = await loreConfig.getAll()
	return addSlugs(allLore)
}

export async function getLoreNames() {
	return loreConfig.getNamesAndIds()
}
