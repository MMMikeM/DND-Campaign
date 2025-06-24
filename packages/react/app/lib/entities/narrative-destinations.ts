import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const narrativeDestinationConfig = {
	findById: (id: number) =>
		db.query.narrativeDestinations.findFirst({
			where: (arcs, { eq }) => eq(arcs.id, id),
			with: {
				incomingForeshadowing: true,
				conflict: nameAndId,
				incomingRelations: { with: { sourceNarrativeDestination: nameAndId } },
				outgoingRelations: { with: { targetNarrativeDestination: nameAndId } },
				participantInvolvement: { with: { faction: nameAndId } },
				questRoles: { with: { quest: nameAndId } },
				region: nameAndId,
				loreLinks: { with: { lore: nameAndId } },
				itemRelations: { with: { sourceItem: nameAndId } },
			},
		}),
	getAll: () => db.query.narrativeDestinations.findMany({}),
	getNamesAndIds: () => db.query.narrativeDestinations.findMany(nameAndId),
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
		.then((destinations) =>
			destinations.find((destination) => destination.slug === slug || destination.id === Number(slug)),
		)

	if (!selectedDestination) {
		throw new EntityNotFoundError("Narrative Destination", slug)
	}

	const byId = await narrativeDestinationConfig.findById(selectedDestination.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Narrative Destination", selectedDestination.id)
}
