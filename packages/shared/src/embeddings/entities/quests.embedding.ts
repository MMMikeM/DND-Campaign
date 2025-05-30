import { buildEmbedding } from "../embedding-helpers"
import type { QuestEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForQuest = (input: QuestEmbeddingInput): string => {
	const {
		name,
		description,
		type,
		urgency,
		visibility,
		mood,
		moralSpectrumFocus,
		intendedPacingRole,
		primaryPlayerExperienceGoal,
		objectives,
		rewards,
		themes,
		inspirations,
		failureOutcomes,
		successOutcomes,
		primaryRegion,
		parentQuest,
		otherUnlockConditionsNotes,
		stages,
		participants,
		relatedQuests,
		hooks,
		worldConceptConnections,
		directConsequences,
		relatedItems,
		relatedNarrativeEvents,
	} = input

	return buildEmbedding({
		quest: name,
		overview: description,
		type,
		urgency,
		visibility,
		mood,
		moralSpectrumFocus,
		intendedPacingRole,
		primaryPlayerExperienceGoal,
		objectives,
		rewards,
		themes,
		inspirations,
		failureOutcomes,
		successOutcomes,
		otherUnlockConditionsNotes,
		primaryRegion: {
			region: primaryRegion?.name,
			regionType: primaryRegion?.type,
			dangerLevel: primaryRegion?.dangerLevel,
		},
		parentQuest: {
			quest: parentQuest?.name,
			questType: parentQuest?.type,
		},
		stages: stages?.map(({ name, stageOrder, stageType, dramatic_question, description, stageSite }) => ({
			stage: name,
			stageOrder,
			stageType,
			dramaticQuestion: dramatic_question,
			description,
			site: stageSite?.name,
			siteType: stageSite?.type,
			siteMood: stageSite?.mood,
		})),
		participants: participants?.map(
			({ roleInQuest, importanceInQuest, involvementDetails, description, ...participantInfo }) => {
				const baseData = {
					roleInQuest,
					importanceInQuest,
					involvementDetails,
					description,
				}

				if (participantInfo.participantType === "Npc") {
					return {
						...baseData,
						participant: participantInfo.npcInfo.name,
						participantType: "NPC",
						occupation: participantInfo.npcInfo.occupation,
						disposition: participantInfo.npcInfo.disposition,
					}
				} else {
					return {
						...baseData,
						participant: participantInfo.factionInfo.name,
						participantType: "Faction",
						factionType: participantInfo.factionInfo.type,
						publicGoal: participantInfo.factionInfo.publicGoal,
					}
				}
			},
		),
		relatedQuests: relatedQuests?.map(({ relationshipType, description, otherQuest }) => ({
			quest: otherQuest.name,
			questType: otherQuest.type,
			questUrgency: otherQuest.urgency,
			relationshipType,
			description,
		})),
		hooks: hooks?.map(
			({
				source,
				hookType,
				presentationStyle,
				hookContent,
				discoveryConditions,
				npcRelationshipToParty,
				trustRequired,
				dialogueHint,
				deliveryNpc,
				description,
				hookFaction,
				hookSite,
			}) => ({
				source,
				hookType,
				presentationStyle,
				hookContent,
				discoveryConditions,
				npcRelationshipToParty,
				trustRequired,
				dialogueHint,
				deliveryNpc: deliveryNpc?.name,
				site: hookSite?.name,
				faction: hookFaction?.name,
				description,
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
		worldConceptConnections: worldConceptConnections?.map(
			({ linkRoleOrTypeText, linkStrength, linkDetailsText, description, conceptInfo }) => ({
				concept: conceptInfo.name,
				conceptType: conceptInfo.conceptType,
				summary: conceptInfo.summary,
				linkRole: linkRoleOrTypeText,
				linkStrength,
				linkDetails: linkDetailsText,
				description,
			}),
		),
		relatedNarrativeEvents: relatedNarrativeEvents?.map(({ description, eventType, intendedRhythmEffect, name }) => ({
			event: name,
			eventType,
			intendedRhythmEffect,
			description,
		})),
		directConsequences: directConsequences?.map(
			({ description, consequenceType, name, affectedConflictName, playerImpactFeel, severity }) => ({
				consequence: name,
				consequenceType,
				affectedConflictName,
				playerImpactFeel,
				severity,
				description,
			}),
		),
	})
}
