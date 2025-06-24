import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { nameAndId } from "."

const siteConfig = {
	findById: (id: number) =>
		db.query.sites.findFirst({
			where: (sites, { eq }) => eq(sites.id, id),
			with: {
				encounters: true,
				secrets: true,
				consequences: true,
				incomingForeshadowing: true,
				factionHqs: nameAndId,
				factionInfluence: nameAndId,
				itemHistory: nameAndId,
				itemRelations: nameAndId,
				questHooks: {
					with: {
						quest: nameAndId,
					},
				},
				npcAssociations: nameAndId,
				area: { ...nameAndId, with: { region: nameAndId } },
				incomingRelations: { with: { sourceSite: nameAndId } },
				outgoingRelations: { with: { targetSite: nameAndId } },
				questStages: {
					...nameAndId,
					with: {
						quest: nameAndId,
					},
				},
				mapGroup: {
					with: {
						variants: {
							with: { mapFile: { columns: { id: true, imageWidth: true, imageHeight: true } } },
						},
					},
				},
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
		.then((sites) => sites.find((site) => site.slug === slug || site.id === Number(slug)))

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
