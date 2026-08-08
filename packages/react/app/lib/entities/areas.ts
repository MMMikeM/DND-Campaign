import { bySlugOrId, consequenceWithTrigger, foreshadowingWithSources, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const areaConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.areas.findFirst({
			where,
			columns: {
				regionId: false,
			},
			with: {
				region: nameAndId,
				sites: nameAndId,
				consequences: consequenceWithTrigger,
				factionInfluence: {
					with: {
						faction: nameAndId,
					},
				},
				incomingForeshadowing: foreshadowingWithSources,

			}
		}),
	getAll: () => db.query.areas.findMany({ with: { region: nameAndId } }),
	getNamesAndIds: () => db.query.areas.findMany(nameAndId),
}

export const getAllAreas = () => areaConfig.getAll()

export type Area = NonNullable<Awaited<ReturnType<typeof areaConfig.findBy>>>

export const getArea = async (slugOrId: string) => {
	const area = await areaConfig.findBy(bySlugOrId(slugOrId))

	if (!area) {
		throw new EntityNotFoundError("Area", slugOrId)
	}

	return area
}

export const getAreaNames = () => areaConfig.getNamesAndIds()
