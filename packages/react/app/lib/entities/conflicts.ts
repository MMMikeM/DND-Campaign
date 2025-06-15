import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const conflictConfig = {
	findById: (id: number) =>
		db.query.conflicts.findFirst({
			where: (conflicts, { eq }) => eq(conflicts.id, id),
			with: {
				primaryRegion: { columns: { name: true, id: true } },
				itemRelations: {
					columns: {
						conflictId: false,
						factionId: false,
						npcId: false,
						itemId: false,
						questId: false,
						relatedItemId: false,
						siteId: false,
						narrativeDestinationId: false,
						worldConceptId: false,
						entityType: false,
					},
					with: { item: { columns: { id: true, name: true } } },
				},
				narrativeDestinations: { columns: { id: true, name: true } },
				worldConceptLinks: {
					columns: {
						conflictId: false,
						factionId: false,
						npcId: false,
						questId: false,
						regionId: false,
						worldConceptId: false,
						targetEntityType: false,
					},
					with: { worldConcept: { columns: { id: true, name: true } } },
				},
				affectedByConsequences: {
					columns: {
						affectedAreaId: false,
						affectedFactionId: false,
						affectedConflictId: false,
						affectedNarrativeDestinationId: false,
						affectedNpcId: false,
						affectedRegionId: false,
						affectedSiteId: false,
						affectedQuestId: false,
						affectedEntityType: false,
						triggerConflictId: false,
						triggerQuestId: false,
						triggerStageDecisionId: false,
					},
					with: {
						triggerConflict: { columns: { id: true, name: true } },
						triggerStageDecision: { columns: { id: true, name: true } },
						triggerQuest: { columns: { id: true, name: true } },
					},
				},
				consequences: {
					columns: {
						affectedAreaId: false,
						affectedFactionId: false,
						affectedConflictId: false,
						affectedNarrativeDestinationId: false,
						affectedNpcId: false,
						affectedRegionId: false,
						affectedSiteId: false,
						affectedQuestId: false,
						triggerConflictId: false,
						triggerQuestId: false,
						triggerStageDecisionId: false,
					},
					with: {
						affectedArea: { columns: { id: true, name: true } },
						affectedFaction: { columns: { id: true, name: true } },
						affectedConflict: { columns: { id: true, name: true } },
						affectedNarrativeDestination: { columns: { id: true, name: true } },
						affectedNpc: { columns: { id: true, name: true } },
						affectedRegion: { columns: { id: true, name: true } },
						affectedSite: { columns: { id: true, name: true } },
						affectedQuest: { columns: { id: true, name: true } },
					},
				},
				incomingForeshadowing: {
					columns: {
						sourceSiteId: false,
						sourceNpcId: false,
						sourceQuestId: false,
						sourceQuestStageId: false,
					},
					with: {
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
