import { buildEmbedding } from "../embedding-helpers"
import type { ForeshadowingEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForForeshadowingSeed = (input: ForeshadowingEmbeddingInput): string => {
	const {
		sourceEntityContext,
		targetEntityContext,
		description,
		targetEntityType,
		suggestedDeliveryMethods,
		subtlety,
		narrativeWeight,
		targetAbstractDetail,
	} = input

	const source: Record<string, unknown> = {}

	if (sourceEntityContext?.sourceType === "Quest") {
		source.Quest = {
			name: sourceEntityContext.name,
			type: sourceEntityContext.details?.type,
		}
	} else if (sourceEntityContext?.sourceType === "QuestStage") {
		source.QuestStage = {
			name: sourceEntityContext.name,
			type: sourceEntityContext.details.stageType,
			parentQuestName: sourceEntityContext.parentQuestName,
		}
	} else if (sourceEntityContext?.sourceType === "Site") {
		source.Site = {
			name: sourceEntityContext.name,
			type: sourceEntityContext.details.type,
			intendedSiteFunction: sourceEntityContext.details.intendedSiteFunction,
		}
	} else if (sourceEntityContext?.sourceType === "Npc") {
		source.Npc = {
			name: sourceEntityContext.name,
			type: sourceEntityContext.details.race,
			occupation: sourceEntityContext.details.occupation,
			race: sourceEntityContext.details.race,
		}
	}

	const target: Record<string, unknown> = {}

	if (targetEntityContext?.entityType === "Quest") {
		target.Quest = { name: targetEntityContext.name, type: targetEntityContext.details.type }
	} else if (targetEntityContext?.entityType === "Npc") {
		target.Npc = {
			name: targetEntityContext.name,
			type: targetEntityContext.details.race,
			occupation: targetEntityContext.details.occupation,
		}
	} else if (targetEntityContext?.entityType === "NarrativeEvent") {
		target.NarrativeEvent = { name: targetEntityContext.name, type: targetEntityContext.details.eventType }
	} else if (targetEntityContext?.entityType === "Site") {
		target.Site = {
			name: targetEntityContext.name,
			type: targetEntityContext.details.type,
			intendedSiteFunction: targetEntityContext.details.intendedSiteFunction,
		}
	} else if (targetEntityContext?.entityType === "Faction") {
		target.Faction = { name: targetEntityContext.name, type: targetEntityContext.details.type }
	} else if (targetEntityContext?.entityType === "AbstractDetail") {
		target.AbstractDetail = { name: targetEntityContext.name, type: targetEntityContext.details.abstractType }
	} else if (targetEntityContext?.entityType === "AbstractTheme") {
		target.Concept = { name: targetEntityContext.name, type: targetEntityContext.details.abstractType }
	} else if (targetEntityContext?.entityType === "Item") {
		target.Item = {
			name: targetEntityContext.name,
			type: targetEntityContext.details.itemType,
			rarity: targetEntityContext.details.rarity,
		}
	} else if (targetEntityContext?.entityType === "MajorConflict") {
		target.MajorConflict = {
			name: targetEntityContext.name,
			natures: targetEntityContext.details.natures,
			scope: targetEntityContext.details.scope,
		}
	} else if (targetEntityContext?.entityType === "NarrativeDestination") {
		target.NarrativeDestination = {
			name: targetEntityContext.name,
			type: targetEntityContext.details.type,
		}
	} else if (targetEntityContext?.entityType === "WorldConcept") {
		target.WorldConcept = { name: targetEntityContext.name, type: targetEntityContext.details.conceptType }
	} else if (targetEntityContext?.entityType === "SpecificReveal") {
		target.SpecificReveal = { name: targetEntityContext.name, type: targetEntityContext.details.abstractType }
	}

	return buildEmbedding({
		foreshadowingSeed: name,
		overview: description,
		targetEntityType,
		suggestedDeliveryMethods,
		subtlety,
		narrativeWeight,
		targetAbstractDetail,
		sourceEntityContext,
		targetEntityContext,
		...source,
		...target,
	})
}
