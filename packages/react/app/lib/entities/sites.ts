import { bySlugOrId, foreshadowingWithSources, foreshadowingWithTargets, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import { unifyRelations } from "../utils/unify"

const siteConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.sites.findFirst({
			where,
			columns: {
				areaId: false,
				mapGroupId: false,
			},
			with: {
				npcs: nameAndId,
				secrets: true,
				encounters: true,
				consequences: true,
				incomingForeshadowing: foreshadowingWithSources,
				outgoingForeshadowing: foreshadowingWithTargets,
				factionHqs: nameAndId,
				factionInfluence: { with: { faction: nameAndId } },
				itemConnections: { with: { sourceItem: nameAndId } },
				questHooks: {
					with: {
						quest: nameAndId,
					},
				},
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
	getNamesAndIds: () => db.query.sites.findMany(nameAndId),
}

export const getAllSites = () => siteConfig.getAll()

export type Site = Awaited<ReturnType<typeof getSite>>

export const getSite = async (slugOrId: string) => {
	const site = await siteConfig.findBy(bySlugOrId(slugOrId))

	if (!site) {
		throw new EntityNotFoundError("Site", slugOrId)
	}

	return unifyRelations(site)
		.from({ property: "incomingRelations", key: "sourceSite" })
		.with({ property: "outgoingRelations", key: "targetSite" })
		.to({ property: "relations", key: "site" })
}

export const getSiteNames = () => siteConfig.getNamesAndIds()
