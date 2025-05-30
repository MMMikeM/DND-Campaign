import { buildEmbedding } from "../embedding-helpers"
import type { FactionEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForFaction = (input: FactionEmbeddingInput): string => {
	const {
		name,
		description,
		history,
		publicAlignment,
		secretAlignment,
		size,
		wealth,
		reach,
		type,
		publicGoal,
		secretGoal,
		publicPerception,
		transparencyLevel,
		values,
		jargon,
		symbols,
		rituals,
		taboos,
		aesthetics,
		recognitionSigns,
		primaryHqSite,
		members,
		agendas,
		relationships,
		influence,
		questParticipation,
		worldConceptLinks,
	} = input

	return buildEmbedding({
		faction: name,
		overview: description,
		history,
		publicAlignment,
		secretAlignment,
		size,
		wealth,
		reach,
		type,
		publicGoal,
		secretGoal,
		publicPerception,
		transparencyLevel,
		values,
		jargon,
		symbols,
		rituals,
		taboos,
		aesthetics,
		recognitionSigns,
		primaryHqSite: primaryHqSite?.name,
		members: members?.map(({ role, rank, loyalty, justification, description, secrets, npcInfo }) => ({
			npc: npcInfo.name,
			alignment: npcInfo.alignment,
			occupation: npcInfo.occupation,
			role,
			rank,
			loyalty,
			justification,
			description,
			secrets,
		})),
		agendas: agendas?.map(
			({
				name,
				agendaType,
				currentStage,
				importance,
				ultimateAim,
				moralAmbiguity,
				description,
				approach,
				storyHooks,
			}) => ({
				agenda: name,
				agendaType,
				currentStage,
				importance,
				ultimateAim,
				moralAmbiguity,
				description,
				approach,
				storyHooks,
			}),
		),
		relationships: relationships?.map(({ diplomaticStatus, strength, description, otherFaction }) => ({
			otherFaction: otherFaction.name,
			factionType: otherFaction.type,
			diplomaticStatus,
			strength,
			description,
		})),
		influence: influence?.map((inf) => {
			const baseInfluence = {
				influenceLevel: inf.influenceLevel,
				description: inf.description,
				priorities: inf.priorities,
				presenceTypes: inf.presenceTypes,
				presenceDetails: inf.presenceDetails,
			}

			if (inf.scope === "Region" && "regionInfo" in inf) {
				return {
					...baseInfluence,
					scope: "Region",
					regionName: inf.regionInfo.name,
					regionType: inf.regionInfo.type,
					regionDescription: inf.regionInfo.description,
				}
			}
			if (inf.scope === "Area" && "areaInfo" in inf) {
				return {
					...baseInfluence,
					scope: "Area",
					areaName: inf.areaInfo.name,
					areaType: inf.areaInfo.type,
					areaDescription: inf.areaInfo.description,
				}
			}
			if (inf.scope === "Site" && "siteInfo" in inf) {
				return {
					...baseInfluence,
					scope: "Site",
					siteName: inf.siteInfo.name,
					siteType: inf.siteInfo.type,
					siteDescription: inf.siteInfo.description,
				}
			}
			return baseInfluence
		}),
		questParticipation: questParticipation?.map(
			({ roleInQuest, importanceInQuest, description, involvementDetails, questInfo }) => ({
				quest: questInfo.name,
				questType: questInfo.type,
				roleInQuest,
				importanceInQuest,
				description,
				involvementDetails,
			}),
		),
		worldConceptLinks: worldConceptLinks?.map(
			({ linkRoleOrTypeText, linkStrength, linkDetailsText, description, associatedConcept }) => ({
				concept: associatedConcept.name,
				conceptType: associatedConcept.conceptType,
				linkRole: linkRoleOrTypeText,
				linkStrength,
				linkDetails: linkDetailsText,
				description,
			}),
		),
	})
}
