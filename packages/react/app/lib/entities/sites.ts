import { db } from "../db"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { EntityNotFoundError } from "../errors"

const siteConfig = {
	findById: (id: number) =>
		db.query.sites.findFirst({
			where: (sites, { eq }) => eq(sites.id, id),
			with: {
				area: {
					columns: { id: true, name: true },
					with: {
						region: { columns: { id: true, name: true } },
					},
				},
				encounters: true,
				secrets: true,
				incomingRelations: { with: { sourceSite: { columns: { id: true, name: true } } } },
				outgoingRelations: { with: { targetSite: { columns: { id: true, name: true } } } },
				items: true,
				npcs: { with: { npc: { columns: { name: true, id: true } } } },
				influence: {
					with: {
						faction: { columns: { name: true, id: true } },
					},
				},
			},
		}),
	getAll: () =>
		db.query.sites.findMany({
			columns: {
				id: true,
				name: true,
				siteType: true,
				areaId: true,
				description: true,
			},
			with: {
				area: {
					columns: { name: true },
					with: {
						region: { columns: { name: true } },
					},
				},
			},
		}),
	getNamesAndIds: () =>
		db.query.sites.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllSites = async () => {
	const sites = await siteConfig.getAll()
	return addSlugs(sites)
}

export type Site = Awaited<ReturnType<typeof getSite>>

export const getSite = async (slug: string) => {
	const selectedSite = await siteConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((sites) => sites.find((site) => site.slug === slug))

	if (!selectedSite) {
		throw new EntityNotFoundError("Site", slug)
	}

	const byId = await siteConfig.findById(selectedSite.id)

	if (!byId) {
		throw new EntityNotFoundError("Site", selectedSite.id)
	}

	const unified = unifyRelations(byId)
		.from({ property: "incomingRelations", key: "sourceSite" })
		.with({ property: "outgoingRelations", key: "targetSite" })
		.to({ property: "relations", key: "site" })

	if (unified) {
		return addSlugs(unified)
	}

	throw new EntityNotFoundError("Site", selectedSite.id)
}
