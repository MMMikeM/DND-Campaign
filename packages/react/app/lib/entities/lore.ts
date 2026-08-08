import { bySlugOrId, foreshadowingWithSources, foreshadowingWithTargets, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const nameIdAndDescription = {
	columns: {
		id: true,
		name: true,
		description: true,
	},
} as const

const loreConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.lore.findFirst({
			where,
			with: {
				incomingForeshadowing: foreshadowingWithSources,
				outgoingForeshadowing: foreshadowingWithTargets,
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

export type Lore = NonNullable<Awaited<ReturnType<typeof loreConfig.findBy>>>

export const getAllLore = () => loreConfig.getAll()

export const getLoreById = (id: number) => loreConfig.findBy({ id })

export const getLore = async (slugOrId: string) => {
	const lore = await loreConfig.findBy(bySlugOrId(slugOrId))

	if (!lore) {
		throw new EntityNotFoundError("Lore", slugOrId)
	}

	return lore
}

export const getLoreNames = () => loreConfig.getNamesAndIds()
