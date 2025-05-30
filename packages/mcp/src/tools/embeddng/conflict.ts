import { embeddingTextGenerators } from "@tome-master/shared"
import { db } from "../.."

const { majorConflicts } = embeddingTextGenerators

export const embeddingTextForMajorConflict = async (id: number): Promise<string> => {
	const conflict = await db.query.majorConflicts.findFirst({
		where: (conflict, { eq }) => eq(conflict.id, id),
		with: {
			primaryRegion: true,
			narrativeDestinations: true,
			consequences: true,
			affectedByConsequences: true,
			worldConceptLinks: true,
			participants: {
				with: {
					npc: { columns: { name: true, alignment: true, occupation: true } },
					faction: { columns: { name: true, size: true, type: true } },
				},
			},
		},
	})

	if (!conflict) {
		throw new Error(`Conflict with id ${id} not found`)
	}

	const newParticipants = conflict.participants.map(
		(participant) =>
			({
				...participant,
				participantType: participant.npc ? "NPC" : "Faction",
				npcInfo: participant.npc,
				factionInfo: participant.faction,
			}) as const,
	)

	return majorConflicts({
		...conflict,
		participants: newParticipants,
	})
}
