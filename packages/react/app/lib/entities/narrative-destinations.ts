import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const narrativeDestinationConfig = {
	findById: (id: number) =>
		db.query.narrativeDestinations.findFirst({
			where: (arcs, { eq }) => eq(arcs.id, id),
			with: {
				foreshadowingTarget: true,
				conflict: { columns: { id: true, name: true } },
				incomingRelations: { with: { sourceNarrativeDestination: { columns: { id: true, name: true } } } },
				outgoingRelations: { with: { targetNarrativeDestination: { columns: { id: true, name: true } } } },
				participantInvolvement: { with: { faction: { columns: { id: true, name: true } } } },
				questRoles: { with: { quest: { columns: { id: true, name: true } } } },
				region: { columns: { id: true, name: true } },
				worldConceptLinks: { with: { worldConcept: { columns: { id: true, name: true } } } },
				itemRelations: { with: { sourceItem: { columns: { id: true, name: true } } } },
			},
		}),
	getAll: () => db.query.narrativeDestinations.findMany({}),
	getNamesAndIds: () =>
		db.query.narrativeDestinations.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllNarrativeDestinations = async () => {
	const arcs = await narrativeDestinationConfig.getAll()

	return addSlugs(arcs)
}

export type NarrativeDestination = Awaited<ReturnType<typeof getNarrativeDestination>>

export const getNarrativeDestination = async (slug: string) => {
	const selectedDestination = await narrativeDestinationConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((destinations) => destinations.find((destination) => destination.slug === slug))

	if (!selectedDestination) {
		throw new EntityNotFoundError("Narrative Destination", slug)
	}

	const byId = await narrativeDestinationConfig.findById(selectedDestination.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Narrative Destination", selectedDestination.id)
}
