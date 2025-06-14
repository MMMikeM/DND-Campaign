import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const conflictConfig = {
	findById: (id: number) =>
		db.query.conflicts.findFirst({
			where: (conflicts, { eq }) => eq(conflicts.id, id),
			with: {
				affectedByConsequences: {
					with: {
						triggerConflict: { columns: { id: true, name: true } },
						triggerStageDecision: { columns: { id: true, name: true } },
						triggerQuest: { columns: { id: true, name: true } },
					},
				},
				consequences: {
					with: {
						affectedArea: { columns: { id: true, name: true } },
						affectedFaction: { columns: { id: true, name: true } },
						affectedConflict: { columns: { id: true, name: true } },
						affectedDestination: { columns: { id: true, name: true } },
						affectedNpc: { columns: { id: true, name: true } },
						affectedRegion: { columns: { id: true, name: true } },
						affectedSite: { columns: { id: true, name: true } },
						affectedQuest: { columns: { id: true, name: true } },
					},
				},
				foreshadowingTarget: {
					with: {
						sourceNpc: { columns: { id: true, name: true } },
						sourceQuest: { columns: { id: true, name: true } },
						sourceSite: { columns: { id: true, name: true } },
						sourceQuestStage: { columns: { id: true, name: true } },
						targetFaction: { columns: { id: true, name: true } },
						targetNpc: { columns: { id: true, name: true } },
						targetQuest: { columns: { id: true, name: true } },
						targetSite: { columns: { id: true, name: true } },
						targetWorldConcept: { columns: { id: true, name: true } },
						targetItem: { columns: { id: true, name: true } },
						targetConflict: { columns: { id: true, name: true } },
						targetNarrativeDestination: { columns: { id: true, name: true } },
						targetNarrativeEvent: { columns: { id: true, name: true } },
					},
				},
				participants: { with: { faction: { columns: { name: true, id: true } } } },
				primaryRegion: { columns: { name: true, id: true } },
				itemRelations: {
					with: {
						sourceItem: { columns: { id: true, name: true } },
					},
				},
				narrativeDestinations: {
					with: {
						region: { columns: { id: true, name: true } },
						worldConceptLinks: {
							with: {
								worldConcept: { columns: { id: true, name: true } },
							},
						},
						conflict: { columns: { id: true, name: true } },
						itemRelations: {
							with: {
								sourceItem: { columns: { id: true, name: true } },
								targetItem: { columns: { id: true, name: true } },
							},
						},
						participantInvolvement: {
							with: {
								destination: { columns: { id: true, name: true } },
								faction: { columns: { id: true, name: true } },
								npc: { columns: { id: true, name: true } },
							},
						},
						questRoles: {
							with: {
								destination: { columns: { id: true, name: true } },
								quest: { columns: { id: true, name: true } },
							},
						},
					},
				},
				worldConceptLinks: {
					with: {
						linkedFaction: { columns: { id: true, name: true } },
						linkedNpc: { columns: { id: true, name: true } },
						linkedQuest: { columns: { id: true, name: true } },
						linkedRegion: { columns: { id: true, name: true } },
						worldConcept: { columns: { id: true, name: true } },
					},
				},
			},
		}),
	getAll: () =>
		db.query.conflicts.findMany({
			with: {
				primaryRegion: { columns: { name: true } },
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
