import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const mapFileColumns = {
	id: true,
	imageWidth: true,
	imageHeight: true,
} as const

const mapConfig = {
	findById: (id: number) =>
		db.query.mapGroups.findFirst({
			where: (arcs, { eq }) => eq(arcs.id, id),
			with: {
				site: nameAndId,
				variants: {
					with: {
						mapFile: {
							columns: mapFileColumns,
						},
					},
				},
			},
		}),
	getAll: () =>
		db.query.mapGroups.findMany({
			with: {
				variants: {
					with: {
						mapFile: {
							columns: mapFileColumns,
						},
					},
				},
			},
		}),
	getAllMetadata: () =>
		db.query.mapGroups.findMany({
			with: {
				variants: {
					with: {
						mapFile: {
							columns: mapFileColumns,
						},
					},
				},
			},
		}),
	getNamesAndIds: () => db.query.mapGroups.findMany(nameAndId),
}
const sortByDefaultThenName = (a: MapVariant, b: MapVariant) => {
	if (b.isDefault) return 1
	if (a.isDefault) return -1
	return a.variantName.localeCompare(b.variantName)
}

export const getAllMaps = async () => {
	const maps = await mapConfig.getAllMetadata()

	const sorted = maps.map((map) => ({
		...map,
		variants: map.variants.toSorted(sortByDefaultThenName),
	}))

	return addSlugs(sorted)
}

export type Map = Awaited<ReturnType<typeof getMap>>

export const getMap = async (slug: string) => {
	const selectedMap = await mapConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((maps) => maps.find((map) => map.slug === slug || map.id === Number(slug)))

	if (!selectedMap) {
		throw new EntityNotFoundError("Map", slug)
	}

	const byId = await mapConfig.findById(selectedMap.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Map", selectedMap.id)
}

export type MapVariant = Awaited<ReturnType<typeof getMap>>["variants"][number]
