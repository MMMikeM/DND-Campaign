import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const worldConceptConfig = {
	findById: (id: number) =>
		db.query.worldConcepts.findFirst({
			where: (changes, { eq }) => eq(changes.id, id),
			with: {
				itemRelations: {
					with: {
						sourceItem: { columns: { id: true, name: true } },
						targetConflict: { columns: { id: true, name: true } },
						targetQuest: { columns: { id: true, name: true } },
						targetFaction: { columns: { id: true, name: true } },
						targetNpc: { columns: { id: true, name: true } },
						targetSite: { columns: { id: true, name: true } },
						targetItem: { columns: { id: true, name: true } },
						targetNarrativeDestination: { columns: { id: true, name: true } },
						targetWorldConcept: { columns: { id: true, name: true } },
					},
				},
				links: {
					with: {
						linkedConflict: { columns: { id: true, name: true } },
						linkedFaction: { columns: { id: true, name: true } },
						linkedNpc: { columns: { id: true, name: true } },
						linkedQuest: { columns: { id: true, name: true } },
						linkedRegion: { columns: { id: true, name: true } },
						worldConcept: { columns: { id: true, name: true } },
					},
				},
				foreshadowingTarget: true,
				incomingRelations: { with: { sourceWorldConcept: { columns: { id: true, name: true } } } },
				outgoingRelations: { with: { targetWorldConcept: { columns: { id: true, name: true } } } },
			},
		}),
	getAll: () => db.query.worldConcepts.findMany({}),
	getNamesAndIds: () =>
		db.query.worldConcepts.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllWorldConcepts = async () => {
	const concepts = await worldConceptConfig.getAll()

	return addSlugs(concepts)
}

export type WorldConcept = Awaited<ReturnType<typeof getWorldConcept>>

export const getWorldConcept = async (slug: string) => {
	const selectedConcept = await worldConceptConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((concepts) => concepts.find((concept) => concept.slug === slug))

	if (!selectedConcept) {
		throw new EntityNotFoundError("World Concept", slug)
	}

	const byId = await worldConceptConfig.findById(selectedConcept.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("World Concept", selectedConcept.id)
}
