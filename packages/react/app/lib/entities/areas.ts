import { db } from "../db"
import addSlugs from "../utils/addSlugs"

import { EntityNotFoundError } from "../errors" // Import custom error

const areaConfig = {
	findById: (id: number) =>
		db.query.areas.findFirst({
			where: (areas, { eq }) => eq(areas.id, id),
			with: {
				region: { columns: { id: true, name: true } },
				sites: {
					columns: { id: true, name: true, siteType: true },
				},
				influence: {
					with: {
						faction: { columns: { name: true, id: true } },
					},
				},
				quests: { columns: { id: true, name: true } },
			},
		}),
	getAll: () =>
		db.query.areas.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				dangerLevel: true,
				regionId: true,
				description: true,
			},
			with: {
				region: { columns: { name: true } },
			},
		}),
	getNamesAndIds: () =>
		db.query.areas.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllAreas = async () => {
	const areas = await areaConfig.getAll()

	return addSlugs(areas)
}

export type Area = Awaited<ReturnType<typeof getArea>>

export const getArea = async (slug: string) => {
	const selectedArea = await areaConfig.getNamesAndIds()
		.then(addSlugs)
		.then((areas) => areas.find((area) => area.slug === slug))

	if (!selectedArea) {
		throw new EntityNotFoundError("Area", slug)
	}

	const byId = await areaConfig.findById(selectedArea.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Area", selectedArea.id)
}
