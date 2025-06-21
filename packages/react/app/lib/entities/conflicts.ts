import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const conflictConfig = {
	findById: (id: number) =>
		db.query.conflicts.findFirst({
			where: (conflicts, { eq }) => eq(conflicts.id, id),
			with: {
				region: { columns: { name: true, id: true } },
				itemRelations: {
					with: { sourceItem: { columns: { id: true, name: true } } },
				},
				narrativeDestinations: { columns: { id: true, name: true } },
				loreLinks: {
					columns: {
						targetEntityType: false,
					},
					with: { lore: { columns: { id: true, name: true } } },
				},
				affectingConsequences: {
					with: {
						triggerConflict: { columns: { id: true, name: true } },
						triggerQuest: { columns: { id: true, name: true } },
					},
				},
				triggeredConsequences: {
					with: {
						affectedNarrativeDestination: { columns: { id: true, name: true } },
						affectedArea: { columns: { id: true, name: true } },
						affectedFaction: { columns: { id: true, name: true } },
						affectedSite: { columns: { id: true, name: true } },
						affectedQuest: { columns: { id: true, name: true } },
						affectedNpc: { columns: { id: true, name: true } },
						affectedRegion: { columns: { id: true, name: true } },
						affectedConflict: { columns: { id: true, name: true } },
					},
				},
				incomingForeshadowing: {
					with: {
						sourceLore: { columns: { id: true, name: true } },
						sourceNpc: { columns: { id: true, name: true } },
						sourceQuest: { columns: { id: true, name: true } },
						sourceSite: { columns: { id: true, name: true } },
						sourceQuestStage: { columns: { id: true, name: true } },
					},
				},
				participants: {
					with: {
						faction: { columns: { name: true, id: true } },
						npc: { columns: { name: true, id: true } },
					},
				},
			},
		}),
	getAll: () =>
		db.query.conflicts.findMany({
			with: {
				region: { columns: { name: true } },
			},
		}),
	getNamesAndIds: () =>
		db.query.conflicts.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllConflicts = async () => {
	const conflicts = await conflictConfig.getAll()

	return addSlugs(conflicts)
}

export type Conflict = Awaited<ReturnType<typeof getConflict>>

export const getConflict = async (slug: string) => {
	const selectedConflict = await conflictConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((conflicts) => conflicts.find((conflict) => conflict.slug === slug))

	if (!selectedConflict) {
		throw new EntityNotFoundError("Conflict", slug)
	}

	const byId = await conflictConfig.findById(selectedConflict.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Conflict", selectedConflict.id)
}
