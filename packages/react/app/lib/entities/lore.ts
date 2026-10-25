import { bySlugOrId, foreshadowingWithSources, foreshadowingWithTargets, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const loreConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.lore.findFirst({
			where,
			with: {
				incomingForeshadowing: foreshadowingWithSources,
				outgoingForeshadowing: foreshadowingWithTargets,
				links: {
					with: {
						region: { columns: { id: true, name: true, slug: true, description: true } },
						faction: { columns: { id: true, name: true, slug: true, description: true } },
						npc: { columns: { id: true, name: true, slug: true, summary: true } },
						conflict: { columns: { id: true, name: true, slug: true, description: true } },
						quest: { columns: { id: true, name: true, slug: true, description: true } },
						foreshadowing: { columns: { id: true, name: true, slug: true, description: true } },
						relatedLore: { columns: { id: true, name: true, slug: true, description: true } },
						item: { columns: { id: true, name: true, slug: true, description: true } },
					},
				},
			},
		}),
	getAll: () => db.query.lore.findMany({}),
	getNamesAndIds: () => db.query.lore.findMany(nameAndId),
}

export type Lore = NonNullable<Awaited<ReturnType<typeof loreConfig.findBy>>>

export const getAllLore = () => loreConfig.getAll()

export const getLore = async (slugOrId: string) => {
	const lore = await loreConfig.findBy(bySlugOrId(slugOrId))

	if (!lore) {
		throw new EntityNotFoundError("Lore", slugOrId)
	}

	return lore
}

export const getLoreNames = () => loreConfig.getNamesAndIds()
