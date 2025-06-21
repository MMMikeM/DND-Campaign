import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"

const regionConfig = {
	findById: (id: number) =>
		db.query.regions.findFirst({
			where: (regions, { eq }) => eq(regions.id, id),
			with: {
				factionInfluence: {
					with: {
						faction: { columns: { name: true, id: true } },
					},
				},
				incomingRelations: {
					with: {
						sourceRegion: { columns: { name: true, id: true } },
					},
				},
				outgoingRelations: {
					with: {
						targetRegion: { columns: { name: true, id: true } },
					},
				},
				areas: {
					columns: { id: true, name: true, type: true },
					with: {
						sites: {
							columns: { id: true, name: true, type: true },
						},
					},
				},
				quests: { columns: { id: true, name: true } },
				conflicts: { columns: { id: true, name: true } },
				consequences: { columns: { id: true, name: true } },

				narrativeDestinations: {
					with: {
						conflict: { columns: { id: true, name: true } },
						loreLinks: { with: { lore: { columns: { id: true, name: true } } } },
					},
				},
				loreLinks: {
					with: {
						lore: { columns: { id: true, name: true } },
					},
				},
			},
		}),
	getAll: () => db.query.regions.findMany({}),
	getNamesAndIds: () =>
		db.query.regions.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
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
