import { bySlugOrId, foreshadowingWithSources, nameAndId } from "."
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
				consequences: {
					columns: {
						id: true,
						name: true,
						slug: true,
						description: true,
						consequenceType: true,
						severity: true,
						visibility: true,
						sourceType: true,
						conflictImpactDescription: true,
						creativePrompts: true,
						playerImpactFeel: true,
						tags: true,
						timeframe: true,
					},
					with: {
						triggerQuest: nameAndId,
						triggerQuestStageDecision: nameAndId,
					},
				},
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
