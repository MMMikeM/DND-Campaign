import { buildEmbedding } from "../embedding-helpers"
import type { NarrativeDestinationEmbeddingInput, WorldConceptEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForNarrativeDestination = ({
	name,
	description,
	type,
	status,
	promise,
	payoff,
	intendedEmotionalArc,
	region: primaryRegion,
	conflict: relatedConflict,
	questRoles,
	participantInvolvement,
	foreshadowingElements,
	relatedDestinations,
	relatedItems,
	relevantWorldConcepts,
	themes,
}: NarrativeDestinationEmbeddingInput): string => {
	return buildEmbedding({
		narrativeDestination: name,
		overview: description,
		type,
		status,
		promise,
		payoff,
		intendedEmotionalArc,
		themes,
		foreshadowingElements,
		primaryRegion: {
			region: primaryRegion?.name,
			regionType: primaryRegion?.type,
			atmosphereType: primaryRegion?.atmosphereType,
		},
		relatedConflict: {
			conflict: relatedConflict?.name,
			scope: relatedConflict?.scope,
			status: relatedConflict?.status,
			currentTensionLevel: relatedConflict?.currentTensionLevel,
		},
		questRoles: questRoles?.map(({ contributionDetails, description, questInfo, role, sequenceInArc }) => ({
			quest: questInfo.name,
			questType: questInfo.type,
			questMood: questInfo.mood,
			role,
			sequenceInArc,
			description,
			contributionDetails,
		})),
		participantInvolvement: participantInvolvement?.map(
			({ arcImportance, description, involvementDetails, roleInArc, ...participant }) => {
				const baseData = {
					arcImportance,
					roleInArc,
					description,
					involvementDetails,
				}

				if (participant.participantType === "Npc") {
					return {
						...baseData,
						participant: participant.npcInfo.name,
						participantType: "NPC",
						occupation: participant.npcInfo.occupation,
						alignment: participant.npcInfo.alignment,
					}
				} else {
					return {
						...baseData,
						participant: participant.factionInfo.name,
						participantType: "Faction",
						factionType: participant.factionInfo.type,
						publicGoal: participant.factionInfo.publicGoal,
					}
				}
			},
		),
		relatedDestinations: relatedDestinations?.map(
			({ description, otherDestination, relationshipDetails, relationshipType }) => ({
				relatedDestination: otherDestination.name,
				destinationType: otherDestination.type,
				destinationStatus: otherDestination.status,
				relationshipType,
				description,
				relationshipDetails,
			}),
		),
		relatedItems: relatedItems?.map(({ relationshipType, relationshipDetails, description, itemInfo }) => ({
			item: itemInfo.name,
			itemType: itemInfo.itemType,
			rarity: itemInfo.rarity,
			narrativeRole: itemInfo.narrativeRole,
			relationshipType,
			relationshipDetails,
			description,
		})),
		relevantWorldConcepts: relevantWorldConcepts?.map(
			({ linkDetailsText, linkRoleOrTypeText, linkStrength, description, conceptInfo }) => ({
				concept: conceptInfo.name,
				conceptType: conceptInfo.conceptType,
				summary: conceptInfo.summary,
				linkRole: linkRoleOrTypeText,
				linkStrength,
				linkDetails: linkDetailsText,
				description,
			}),
		),
	})
}

export const embeddingTextForWorldConcept = ({
	name,
	description,
	conceptType,
	complexityProfile,
	moralClarity,
	summary,
	surfaceImpression,
	livedRealityDetails,
	hiddenTruthsOrDepths,
	scope,
	status,
	timeframe,
	startYear,
	endYear,
	modernRelevance,
	traditions,
	definingCharacteristics,
	currentChallenges,
	modernConsequences,
	questHooks,
	additionalDetails,
	socialStructure,
	coreValues,
	languages,
	adaptationStrategies,
	majorEvents,
	lastingInstitutions,
	conflictingNarratives,
	historicalGrievances,
	endingCauses,
	historicalLessons,
	purpose,
	structure,
	membership,
	rules,
	modernAdaptations,
	currentEffectiveness,
	institutionalChallenges,
	culturalEvolution,
	connectionsToEntities,
	relatedConcepts,
}: WorldConceptEmbeddingInput): string => {
	return buildEmbedding({
		worldConcept: name,
		overview: description,
		conceptType,
		complexityProfile,
		moralClarity,
		summary,
		surfaceImpression,
		livedRealityDetails,
		hiddenTruthsOrDepths,
		scope,
		status,
		timeframe,
		startYear,
		endYear,
		modernRelevance,
		purpose,
		structure,
		socialStructure,
		currentEffectiveness,
		traditions,
		definingCharacteristics,
		currentChallenges,
		modernConsequences,
		questHooks,
		additionalDetails,
		coreValues,
		languages,
		adaptationStrategies,
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
		connectionsToEntities: connectionsToEntities?.map(
			({ description, linkDetailsText, linkRoleOrTypeText, linkStrength, linkedEntity }) => {
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
			({ description, relationshipType, strength, isBidirectional, relationshipDetails, targetConcept }) => ({
				relatedConcept: targetConcept.name,
				relatedConceptType: targetConcept.conceptType,
				relatedConceptSummary: targetConcept.summary,
				relationshipType,
				strength,
				direction: isBidirectional ? "bidirectional" : "one-way",
				description,
				relationshipDetails,
			}),
		),
	})
}
