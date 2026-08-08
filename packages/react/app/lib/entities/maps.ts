import { bySlugOrId, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const mapFileColumns = {
	id: true,
	imageWidth: true,
	imageHeight: true,
} as const

const mapConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.mapGroups.findFirst({
			where,
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

	return maps.map((map) => ({
		...map,
		variants: map.variants.toSorted(sortByDefaultThenName),
	}))
}

export type Map = NonNullable<Awaited<ReturnType<typeof mapConfig.findBy>>>

export const getMap = async (slugOrId: string) => {
	const map = await mapConfig.findBy(bySlugOrId(slugOrId))

	if (!map) {
		throw new EntityNotFoundError("Map", slugOrId)
	}

	return map
}

export type MapVariant = Map["variants"][number]

export const getMapNames = () => mapConfig.getNamesAndIds()
