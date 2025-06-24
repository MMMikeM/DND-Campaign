import { db } from "../db"
import { EntityNotFoundError } from "../errors" // Import custom error
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const areaConfig = {
	findById: (id: number) =>
		db.query.areas.findFirst({
			where: (areas, { eq }) => eq(areas.id, id),
			columns: {
				regionId: false,
			},
			with: {
				region: nameAndId,
				sites: {
					columns: { id: true, name: true, type: true },
				},
				consequences: {
					columns: {
						id: true,
						name: true,
						description: true,
						consequenceType: true,
						severity: true,
						visibility: true,
						sourceType: true,
						conflictImpactDescription: true,
						creativePrompts: true,
						gmNotes: true,
						playerImpactFeel: true,
						tags: true,
						timeframe: true,
					},
					where: (consequences, { eq }) => eq(consequences.affectedAreaId, id),
					with: {
						triggerConflict: nameAndId,
						triggerQuest: nameAndId,
						triggerQuestStageDecision: nameAndId,
					},
				},
				factionInfluence: {
					with: {
						faction: nameAndId,
					},
				},
			},
		}),
	getAll: () => db.query.areas.findMany({ with: { region: nameAndId } }),
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
	const selectedArea = await areaConfig
		.getNamesAndIds()
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
