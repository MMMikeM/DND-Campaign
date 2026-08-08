import { bySlugOrId, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const foreshadowingConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.foreshadowing.findFirst({
			where,
			with: {
				sourceNpc: nameAndId,
				sourceQuest: nameAndId,
				sourceSite: nameAndId,
				sourceQuestStage: nameAndId,
				targetFaction: nameAndId,
				targetNpc: nameAndId,
				targetQuest: nameAndId,
				targetSite: nameAndId,
				targetLore: nameAndId,
				targetItem: nameAndId,
				targetConflict: nameAndId,
				sourceItem: nameAndId,
				sourceLore: nameAndId,
				incomingLoreLinks: nameAndId,
				targetConsequence: nameAndId,
			},
		}),
	getAll: () => db.query.foreshadowing.findMany({}),
	getNamesAndIds: () =>
		db.query.foreshadowing.findMany(nameAndId),
}

export const getAllForeshadowing = () => foreshadowingConfig.getAll()

export type Foreshadowing = NonNullable<Awaited<ReturnType<typeof foreshadowingConfig.findBy>>>

export const getForeshadowing = async (slugOrId: string) => {
	const foreshadowing = await foreshadowingConfig.findBy(bySlugOrId(slugOrId))

	if (!foreshadowing) {
		throw new EntityNotFoundError("Foreshadowing", slugOrId)
	}

	return foreshadowing
}

export const getForeshadowingNames = () => foreshadowingConfig.getNamesAndIds()
