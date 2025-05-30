import { buildEmbedding } from "../embedding-helpers"
import type { MajorConflictEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForMajorConflict = ({
	name,
	description,
	scope,
	natures,
	status,
	cause,
	stakes,
	moralDilemma,
	possibleOutcomes,
	hiddenTruths,
	clarityOfRightWrong,
	currentTensionLevel,
	primaryRegion,
	consequences: triggeredConsequences,
	affectedByConsequences: affectingConsequences,
	narrativeDestinations,
	participants,
	worldConceptLinks,
}: MajorConflictEmbeddingInput): string => {
	return buildEmbedding({
		majorConflict: name,
		overview: description,
		scope,
		natures,
		status,
		cause,
		stakes,
		moralDilemma,
		possibleOutcomes,
		hiddenTruths,
		clarityOfRightWrong,
		currentTensionLevel,
		primaryRegion,
		participants: participants?.map(
			({ role, motivation, publicStance, secretStance, description, ...participantInfo }) => {
				const baseData = {
					role,
					motivation,
					publicStance,
					secretStance,
					description: description,
				}

				if (participantInfo.participantType === "NPC") {
					return {
						...baseData,
						participant: participantInfo.npcInfo.name,
						participantType: "NPC",
						alignment: participantInfo.npcInfo.alignment,
						occupation: participantInfo.npcInfo.occupation,
					}
				} else {
					return {
						...baseData,
						participant: participantInfo.factionInfo.name,
						participantType: "Faction",
						size: participantInfo.factionInfo.size,
						factionType: participantInfo.factionInfo.type,
					}
				}
			},
		),
		narrativeDestinations: narrativeDestinations?.map(({ description, status, type, name }) => ({
			arc: name,
			description,
			status,
			type,
		})),
		triggeredConsequences: triggeredConsequences?.map(
			({ consequenceType, severity, playerImpactFeel, description, name }) => ({
				consequence: name,
				type: consequenceType,
				severity,
				playerImpact: playerImpactFeel,
				description,
			}),
		),
		affectingConsequences: affectingConsequences?.map(
			({ consequenceType, severity, playerImpactFeel, description, name }) => ({
				consequence: name,
				type: consequenceType,
				severity,
				playerImpact: playerImpactFeel,
				description,
			}),
		),
		worldConceptLinks: worldConceptLinks?.map(
			({ associatedConcept, description, linkDetailsText, linkRoleOrTypeText, linkStrength }) => ({
				concept: associatedConcept,
				linkRole: linkRoleOrTypeText,
				linkStrength,
				linkDetails: linkDetailsText,
				description,
			}),
		),
	})
}
