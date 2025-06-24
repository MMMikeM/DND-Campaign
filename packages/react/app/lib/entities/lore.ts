import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const nameIdAndDescription = {
	columns: {
		id: true,
		name: true,
		description: true,
	},
} as const

const loreConfig = {
	findById: (id: number) =>
		db.query.lore.findFirst({
			where: (lore, { eq }) => eq(lore.id, id),
			with: {
				incomingForeshadowing: true,
				links: {
					with: {
						region: nameIdAndDescription,
						faction: nameIdAndDescription,
						npc: nameIdAndDescription,
						conflict: nameIdAndDescription,
						quest: nameIdAndDescription,
						foreshadowing: nameIdAndDescription,
						relatedLore: nameIdAndDescription,
						item: nameIdAndDescription,
					},
				},
			},
		}),
	getAll: () => db.query.lore.findMany({}),
	getNamesAndIds: () => db.query.lore.findMany(nameAndId),
}

export type Lore = NonNullable<Awaited<ReturnType<typeof loreConfig.findById>>>

export const getAllLore = async () => {
	const lore = await loreConfig.getAll()
	return addSlugs(lore)
}

export async function getLoreById(id: number) {
	const lore = await loreConfig.findById(id)
	if (!lore) {
		return null
	}
	return addSlugs(lore)
}

export const getLore = async (slug: string) => {
	const selectedLore = await loreConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((lore) => lore.find((lore) => lore.slug === slug || lore.id === Number(slug)))

	if (!selectedLore) {
		throw new EntityNotFoundError("Lore", slug)
	}

	const byId = await loreConfig.findById(selectedLore.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Lore", selectedLore.id)
}

export async function getLoreNames() {
	return loreConfig.getNamesAndIds()
}
