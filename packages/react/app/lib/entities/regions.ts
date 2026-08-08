import { bySlugOrId, foreshadowingWithSources, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import { unifyRelations } from "../utils/unify"

const regionConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.regions.findFirst({
			where,
			with: {
				factionInfluence: {
					with: {
						faction: nameAndId,
					},
				},
				incomingRelations: {
					with: {
						sourceRegion: nameAndId,
					},
				},
				outgoingRelations: {
					with: {
						targetRegion: nameAndId,
					},
				},
				areas: {
					with: {
						sites: nameAndId,
					},
				},
				conflicts: nameAndId,
				consequences: nameAndId,
				incomingForeshadowing: foreshadowingWithSources,
				loreLinks: {
					with: {
						lore: nameAndId,
					},
				},
			},
		}),
	getAll: () => db.query.regions.findMany({}),
	getNamesAndIds: () => db.query.regions.findMany(nameAndId),
}

export const getAllRegions = () => regionConfig.getAll()

export type Region = Awaited<ReturnType<typeof getRegion>>

export const getRegion = async (slugOrId: string) => {
	const region = await regionConfig.findBy(bySlugOrId(slugOrId))

	if (!region) {
		throw new EntityNotFoundError("Region", slugOrId)
	}

	return unifyRelations(region)
		.from({ property: "incomingRelations", key: "sourceRegion" })
		.with({ property: "outgoingRelations", key: "targetRegion" })
		.to({ property: "relations", key: "region" })
}

export const getRegionNames = () => regionConfig.getNamesAndIds()
