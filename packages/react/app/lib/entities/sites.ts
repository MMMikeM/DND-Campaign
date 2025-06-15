import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"

const siteConfig = {
	findById: (id: number) =>
		db.query.sites.findFirst({
			where: (sites, { eq }) => eq(sites.id, id),
			with: {
				encounters: true,
				secrets: true,
				consequences: true,
				factionHqs: true,
				factionInfluence: true,
				foreshadowingSource: true,
				foreshadowingTarget: true,
				itemHistory: true,
				itemRelations: true,
				questHooks: true,
				map: true,
				npcAssociations: true,
				questStages: true,
				area: { columns: { id: true, name: true }, with: { region: { columns: { id: true, name: true } } } },
				incomingRelations: { with: { sourceSite: { columns: { id: true, name: true } } } },
				outgoingRelations: { with: { targetSite: { columns: { id: true, name: true } } } },
			},
		}),
	getAll: () => db.query.sites.findMany({}),
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
