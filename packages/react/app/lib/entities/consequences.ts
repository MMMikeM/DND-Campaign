import { bySlugOrId, foreshadowingWithSources, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const consequenceConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.consequences.findFirst({
			where,
			with: {
				affectedArea: nameAndId,
				affectedFaction: nameAndId,
				affectedSite: nameAndId,
				affectedQuest: nameAndId,
				affectedNpc: nameAndId,
				affectedRegion: nameAndId,
				affectedConflict: nameAndId,
				incomingForeshadowing: foreshadowingWithSources,
			},
		}),
	getAll: () => db.query.consequences.findMany({}),
	getNamesAndIds: () => db.query.consequences.findMany(nameAndId),
}

export const getAllConsequences = () => consequenceConfig.getAll()

export type Consequence = NonNullable<Awaited<ReturnType<typeof consequenceConfig.findBy>>>

export const getConsequence = async (slugOrId: string) => {
	const consequence = await consequenceConfig.findBy(bySlugOrId(slugOrId))

	if (!consequence) {
		throw new EntityNotFoundError("Consequence", slugOrId)
	}

	return consequence
}

export const getConsequenceNames = () => consequenceConfig.getNamesAndIds()
