import { buildEmbedding } from "../embedding-helpers"
import type { WorldConceptEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForWorldConcept = ({
	name,
	description,
	conceptType,
	complexityProfile,
	moralClarity,
	summary,
	additionalDetails,
	coreValues,
	traditions,
	languages,
	adaptationStrategies,
	definingCharacteristics,
	majorEvents,
	lastingInstitutions,
	conflictingNarratives,
	historicalGrievances,
	endingCauses,
	historicalLessons,
	membership,
	rules,
	modernAdaptations,
	currentEffectiveness,
	institutionalChallenges,
	culturalEvolution,
	scope,
	status,
	timeframe,
	modernRelevance,
	currentChallenges,
	modernConsequences,
	questHooks,
	startYear,
	endYear,
	purpose,
	structure,
	socialStructure,
	surfaceImpression,
	livedRealityDetails,
	hiddenTruthsOrDepths,
	connectionsToEntities,
	relatedConcepts,
}: WorldConceptEmbeddingInput): string => {
	return buildEmbedding({
		worldConcept: name,
		overview: description,
		summary,
		conceptType,
		complexityProfile,
		moralClarity,
		scope,
		status,
		timeframe,
		currentEffectiveness,
		modernRelevance,
		startYear,
		endYear,
		purpose,
		structure,
		socialStructure,
		surfaceImpression,
		livedRealityDetails,
		hiddenTruthsOrDepths,
		additionalDetails,
		coreValues,
		traditions,
		languages,
		adaptationStrategies,
		definingCharacteristics,
		majorEvents,
		lastingInstitutions,
		conflictingNarratives,
		historicalGrievances,
		endingCauses,
		historicalLessons,
		membership,
		rules,
		modernAdaptations,
		institutionalChallenges,
		culturalEvolution,
		currentChallenges,
		modernConsequences,
		questHooks,
		connectionsToEntities: connectionsToEntities?.map(
			({ linkRoleOrTypeText, linkStrength, linkDetailsText, description, linkedEntity }) => {
				const baseData = {
					linkRole: linkRoleOrTypeText,
					linkStrength,
					linkDetails: linkDetailsText,
					description,
				}

				if (linkedEntity.entityType === "Npc") {
					return {
						...baseData,
						linkedEntity: linkedEntity.name,
						entityType: "NPC",
						occupation: linkedEntity.details.occupation,
						alignment: linkedEntity.details.alignment,
					}
				} else if (linkedEntity.entityType === "Faction") {
					return {
						...baseData,
						linkedEntity: linkedEntity.name,
						entityType: "Faction",
						factionType: linkedEntity.details.type,
						size: linkedEntity.details.size,
					}
				} else if (linkedEntity.entityType === "Quest") {
					return {
						...baseData,
						linkedEntity: linkedEntity.name,
						entityType: "Quest",
						questType: linkedEntity.details.type,
						urgency: linkedEntity.details.urgency,
					}
				} else if (linkedEntity.entityType === "Region") {
					return {
						...baseData,
						linkedEntity: linkedEntity.name,
						entityType: "Region",
						regionType: linkedEntity.details.type,
						dangerLevel: linkedEntity.details.dangerLevel,
					}
				} else if (linkedEntity.entityType === "Conflict") {
					return {
						...baseData,
						linkedEntity: linkedEntity.name,
						entityType: "Conflict",
						scope: linkedEntity.details.scope,
						status: linkedEntity.details.status,
					}
				}
				return baseData
			},
		),
		relatedConcepts: relatedConcepts?.map(
			({ relationshipType, strength, relationshipDetails, description, isBidirectional, targetConcept }) => ({
				relatedConcept: targetConcept,
				relationshipType,
				strength,
				relationshipDetails,
				bidirectional: isBidirectional,
				description,
			}),
		),
	})
}
