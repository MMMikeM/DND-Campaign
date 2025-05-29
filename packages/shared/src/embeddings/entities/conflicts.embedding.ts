import type { MajorConflictEmbeddingInput } from "../embedding-input-types"
import { createEmbeddingBuilder } from "../yaml-embedding-helpers"

export const embeddingTextForMajorConflict = (data: MajorConflictEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	// Set main entity and overview
	builder.setEntity("Major Conflict", data.name, data.description)

	// Core conflict details
	builder.addFields("Core Details", {
		scope: data.scope,
		status: data.status,
		tensionLevel: data.currentTensionLevel,
		primaryCause: data.cause,
	})

	// Nature and stakes as lists
	builder.addList("Nature of Conflict", data.natures).addList("Key Stakes", data.stakes)

	// Moral context
	builder.addFields("Moral Context", {
		moralDilemma: data.moralDilemma,
		clarityOfRightWrong: data.clarityOfRightWrong,
	})

	// Hidden elements and outcomes
	builder
		.ifPresent(data.hiddenTruths, (b) => b.addList("Hidden Truths or Secrets", data.hiddenTruths))
		.ifPresent(data.possibleOutcomes, (b) => b.addList("Potential Outcomes", data.possibleOutcomes))

	// Geographic context
	builder.ifPresent(data.regions, (b) =>
		b.addObjectArray("Regions Involved", data.regions, (region) => ({
			Region: region.name,
			Type: region.type,
			"Danger Level": region.dangerLevel,
			Atmosphere: region.atmosphereType,
			"Economy Summary": region.economy,
			"Population Summary": region.population,
		})),
	)

	// Key participants with enhanced formatting
	builder.ifPresent(data.participants, (b) => {
		b.addObjectArray("Key Participants", data.participants, (participant) => {
			const participantData: Record<string, unknown> = {
				Participant: `${participant.name} (${participant.type === "Faction" ? "Faction" : "NPC"})`,
				Role: participant.role,
				Motivation: participant.motivation,
				"Public Stance": participant.publicStance,
			}

			// Add secret stance if different from public
			if (participant.secretStance) {
				participantData["Secret Stance"] = participant.secretStance
			}

			// Type-specific details
			if (participant.type === "Faction") {
				participantData["Faction Details"] = {
					Size: participant.factionSize,
					Wealth: participant.factionWealth,
					Reach: participant.factionReach,
				}
			} else if (participant.type === "NPC") {
				participantData["NPC Details"] = {
					Alignment: participant.npcAlignment,
					Occupation: participant.npcOccupation,
					"Social Status": participant.npcSocialStatus,
				}
			}

			// Add description and tags if present
			if (participant.description && participant.description.length > 0) {
				participantData.Overview = participant.description
			}
			if (participant.tags && participant.tags.length > 0) {
				participantData.Tags = participant.tags
			}

			return participantData
		})
	})

	// Related quests
	builder.ifPresent(data.quests, (b) =>
		b.addObjectArray("Related Quests", data.quests, (quest) => ({
			Quest: quest.name,
			Relationship: quest.relationship,
			Type: quest.type,
			Urgency: quest.urgency,
			Mood: quest.mood,
			"Moral Focus": quest.moralSpectrumFocus,
			"Player Goal": quest.primaryPlayerExperienceGoal,
			Objectives: quest.objectives,
			Themes: quest.themes,
		})),
	)

	// Narrative arcs
	builder.ifPresent(data.narrativeDestinations, (b) =>
		b.addObjectArray("Related Narrative Arcs", data.narrativeDestinations, (arc) => ({
			Arc: arc.name,
			Relationship: arc.relationship,
			Type: arc.type,
			Status: arc.status,
			"Emotional Arc": arc.intendedEmotionalArc,
			Promise: arc.promise,
			Payoff: arc.payoff,
			Themes: arc.themes,
		})),
	)

	// Potential consequences
	builder.ifPresent(data.consequences, (b) =>
		b.addObjectArray("Potential Consequences", data.consequences, (consequence) => {
			const consequenceData: Record<string, unknown> = {
				Consequence: consequence.name,
				Type: consequence.consequenceType,
				Severity: consequence.severity,
				Visibility: consequence.visibility,
				Timeframe: consequence.timeframe,
				"Player Impact": consequence.playerImpactFeel,
				"Source Type": consequence.sourceType,
			}

			if (consequence.conflictImpactDescription) {
				consequenceData["Impact Details"] = consequence.conflictImpactDescription
			}

			if (consequence.affectedEntityType && consequence.affectedEntityName) {
				consequenceData["Affected Entity"] = `${consequence.affectedEntityType}: ${consequence.affectedEntityName}`
			}

			if (consequence.description && consequence.description.length > 0) {
				consequenceData.Overview = consequence.description
			}

			return consequenceData
		}),
	)

	// World concepts
	builder.ifPresent(data.worldConcepts, (b) =>
		b.addObjectArray("Related World Concepts", data.worldConcepts, (concept) => ({
			Concept: concept.name,
			"Relationship to Conflict": concept.relationship,
			Type: concept.conceptType,
			Complexity: concept.complexityProfile,
			"Moral Clarity": concept.moralClarity,
			Scope: concept.scope,
			Status: concept.status,
			Summary: concept.summary,
			"Link Strength": concept.linkStrength,
			"Link Details": concept.linkDetailsText,
		})),
	)

	// GM context section
	builder.addList("Creative Prompts", data.creativePrompts).addList("GM Notes", data.gmNotes).addList("Tags", data.tags)

	return builder.build()
}
