import { db } from "../db"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { EntityNotFoundError } from "../errors"

const regionConfig = {
	findById: (id: number) =>
		db.query.regions.findFirst({
			where: (regions, { eq }) => eq(regions.id, id),
			with: {
				incomingRelations: {
					with: {
						sourceRegion: { columns: { name: true, id: true } },
						connections: true,
					},
				},
				outgoingRelations: {
					with: {
						targetRegion: { columns: { name: true, id: true } },
						connections: true,
					},
				},
				areas: {
					columns: { id: true, name: true, type: true },
					with: {
						sites: {
							columns: { id: true, name: true, siteType: true },
						},
					},
				},
				quests: { columns: { id: true, name: true } },
				factions: { with: { faction: { columns: { name: true, id: true } } } },
				influence: {
					with: {
						faction: { columns: { name: true, id: true } },
					},
				},
			},
		}),
	getAll: () =>
		db.query.regions.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				dangerLevel: true,
				population: true,
				economy: true,
				description: true,
				hazards: true,
				pointsOfInterest: true,
				rumors: true,
				secrets: true,
			},
		}),
	getNamesAndIds: () =>
		db.query.regions.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getRegionNamesAndIds = async () => {
	const regions = await regionConfig.getNamesAndIds()
	return addSlugs(regions)
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
		.then((regions) => regions.find((region) => region.slug === slug))

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
