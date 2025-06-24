import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { nameAndId } from "."

const regionConfig = {
	findById: (id: number) =>
		db.query.regions.findFirst({
			where: (regions, { eq }) => eq(regions.id, id),
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
				quests: nameAndId,
				conflicts: nameAndId,
				consequences: nameAndId,

				narrativeDestinations: {
					with: {
						conflict: nameAndId,
						loreLinks: { with: { lore: nameAndId } },
					},
				},
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

export const getAllRegions = async () => {
	const regions = await regionConfig.getAll()
	return addSlugs(regions)
}

export type Region = Awaited<ReturnType<typeof getRegion>>

export const getRegion = async (slug: string) => {
	const selectedRegion = await regionConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((regions) => regions.find((region) => region.slug === slug || region.id === Number(slug)))

	if (!selectedRegion) {
		throw new EntityNotFoundError("Region", slug)
	}

	const byId = await regionConfig.findById(selectedRegion.id)

	if (!byId) {
		throw new EntityNotFoundError("Region", selectedRegion.id)
	}

	const unified = unifyRelations(byId)
		.from({ property: "incomingRelations", key: "sourceRegion" })
		.with({ property: "outgoingRelations", key: "targetRegion" })
		.to({ property: "relations", key: "region" })

	if (unified) {
		return addSlugs(unified)
	}

	throw new EntityNotFoundError("Region", selectedRegion.id)
}
