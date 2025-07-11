import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const foreshadowingConfig = {
	findById: (id: number) =>
		db.query.foreshadowing.findFirst({
			where: (foreshadowing, { eq }) => eq(foreshadowing.id, id),
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
		db.query.foreshadowing.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllForeshadowing = async () => {
	const foreshadowing = await foreshadowingConfig.getAll()
	return addSlugs(foreshadowing)
}

export type Foreshadowing = Awaited<ReturnType<typeof getForeshadowing>>

export const getForeshadowing = async (slug: string) => {
	const selectedForeshadowing = await foreshadowingConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((items) => items.find((item) => item.slug === slug || item.id === Number(slug)))

	if (!selectedForeshadowing) {
		throw new EntityNotFoundError("Foreshadowing", slug)
	}

	const byId = await foreshadowingConfig.findById(selectedForeshadowing.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Foreshadowing", selectedForeshadowing.id) // Use custom error
}
