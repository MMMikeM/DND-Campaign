import { buildEmbedding } from "../embedding-helpers"
import type { ItemEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForItem = (input: ItemEmbeddingInput): string => {
	const {
		name,
		description,
		itemType,
		rarity,
		narrativeRole,
		perceivedSimplicity,
		significance,
		loreSignificance,
		mechanicalEffects,
		creationPeriod,
		placeOfOrigin,
		directlyRelatedQuest,
		notableHistory,
		contextualRelationships,
	} = input

	return buildEmbedding({
		item: name,
		overview: description,
		itemType,
		rarity,
		narrativeRole,
		perceivedSimplicity,
		significance,
		loreSignificance,
		mechanicalEffects,
		creationPeriod,
		placeOfOrigin,
		directlyRelatedQuest: {
			quest: directlyRelatedQuest?.name,
			type: directlyRelatedQuest?.type,
		},
		notableHistory: notableHistory?.map(
			({ eventDescription, timeframe, npcRoleInEvent, description, keyNpcInvolved, eventLocation }) => ({
				event: eventDescription,
				timeframe,
				npcRole: npcRoleInEvent,
				description,
				keyNpc: keyNpcInvolved?.name,
				keyNpcOccupation: keyNpcInvolved?.occupation,
				eventLocation: eventLocation?.name,
				locationType: eventLocation?.type,
			}),
		),
		contextualRelationships: contextualRelationships?.map(
			({ relationshipType, relationshipDetails, description, relatedEntity }) => {
				const baseData = {
					relationshipType,
					relationshipDetails,
					description,
				}

				if (relatedEntity.entityType === "Item") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "Item",
						entityDetails: relatedEntity.details.itemType,
					}
				} else if (relatedEntity.entityType === "Npc") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "NPC",
						entityDetails: relatedEntity.details.occupation,
					}
				} else if (relatedEntity.entityType === "Faction") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "Faction",
						entityDetails: relatedEntity.details.type?.join(", "),
					}
				} else if (relatedEntity.entityType === "Site") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "Site",
						entityDetails: relatedEntity.details.type,
					}
				} else if (relatedEntity.entityType === "Quest") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "Quest",
						entityDetails: relatedEntity.details.type,
					}
				} else if (relatedEntity.entityType === "Conflict") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "Conflict",
						entityDetails: relatedEntity.details.scope,
					}
				} else if (relatedEntity.entityType === "NarrativeDestination") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "Narrative Arc",
						entityDetails: relatedEntity.details.type,
					}
				} else if (relatedEntity.entityType === "WorldConcept") {
					return {
						...baseData,
						relatedEntity: relatedEntity.name,
						entityType: "World Concept",
						entityDetails: relatedEntity.details.conceptType,
					}
				}
				return baseData
			},
		),
	})
}
