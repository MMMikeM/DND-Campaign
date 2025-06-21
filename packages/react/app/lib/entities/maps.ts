import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const mapConfig = {
	findById: (id: number) =>
		db.query.mapGroups.findFirst({
			where: (arcs, { eq }) => eq(arcs.id, id),
			with: {
				site: { columns: { id: true, name: true } },
				variants: {
					with: {
						mapFile: true,
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
							columns: {
								fileName: true,
								mapImage: true,
								imageFormat: true,
								imageSize: true,
								imageWidth: true,
								imageHeight: true,
							},
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
							columns: {
								id: true,
								fileName: true,
								imageFormat: true,
								imageSize: true,
								imageWidth: true,
								imageHeight: true,
							},
						},
					},
				},
			},
		}),
	getNamesAndIds: () =>
		db.query.mapGroups.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllMaps = async () => {
	const arcs = await mapConfig.getAll()

	return addSlugs(arcs)
}

export const getAllMapsMetadata = async () => {
	const arcs = await mapConfig.getAllMetadata()

	return addSlugs(arcs)
}

export type Map = Awaited<ReturnType<typeof getMap>>

export const getMap = async (slug: string) => {
	const selectedMap = await mapConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((maps) => maps.find((map) => map.slug === slug))

	if (!selectedMap) {
		throw new EntityNotFoundError("Map", slug)
	}

	const byId = await mapConfig.findById(selectedMap.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Map", selectedMap.id)
}
