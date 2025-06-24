import { db } from "../db"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const loreConfig = {
	findById: (id: number) =>
		db.query.lore.findFirst({
			where: (lore, { eq }) => eq(lore.id, id),
			with: {
				itemRelations: {
					with: {
						sourceItem: nameAndId,
					},
				},
				incomingForeshadowing: true,
				links: {
					with: {
						region: nameAndId,
						faction: nameAndId,
						npc: nameAndId,
						conflict: nameAndId,
						quest: nameAndId,
						foreshadowing: nameAndId,
						relatedLore: nameAndId,
					},
				},
			},
		}),
	getAll: () => db.query.lore.findMany({}),
	getNamesAndIds: () => db.query.lore.findMany(nameAndId),
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
