import { EmbeddingBuilder } from "./embedding-helpers"
import type { NpcEmbeddingInput, NpcRelationshipEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForNpc = (npc: NpcEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Character", npc.name)
		.overview(npc.description)
		.basicInfoSection([
			{ label: "Race", value: npc.race },
			{ label: "Gender", value: npc.gender },
			{ label: "Age", value: npc.age },
			{ label: "Occupation", value: npc.occupation },
			{ label: "Alignment", value: npc.alignment },
			{ label: "Current Location", value: npc.currentLocationSiteName },
			{ label: "Primary Faction", value: npc.primaryFactionNameAndRole },
		])
		.basicInfoSection(
			[
				{ label: "Disposition", value: npc.disposition },
				{ label: "Attitude", value: npc.attitude },
				{ label: "Social Status", value: npc.socialStatus },
				{ label: "Wealth", value: npc.wealth },
				{ label: "Trust Level", value: npc.trustLevel },
				{ label: "Adaptability", value: npc.adaptability },
				{ label: "Complexity", value: npc.complexityProfile },
				{ label: "Player Perception Goal", value: npc.playerPerceptionGoal },
				{ label: "Availability", value: npc.availability },
				{ label: "Capability", value: npc.capability },
				{ label: "Proactivity", value: npc.proactivity },
				{ label: "Relatability", value: npc.relatability },
			],
			"Personality & Behavior",
		)
		.lists([
			{ title: "Personality Traits", items: npc.personalityTraits },
			{ title: "Drives & Motivations", items: npc.drives },
			{ title: "Fears", items: npc.fears },
			{ title: "Current Goals", items: npc.currentGoals },
			{ title: "Background", items: npc.background },
			{ title: "Knowledge & Expertise", items: npc.knowledge },
			{ title: "Secrets", items: npc.secrets },
		])
		.field("Quirk", npc.quirk)
		.list("Physical Appearance", npc.appearance)
		.lists([
			{ title: "Mannerisms", items: npc.mannerisms },
			{ title: "Biases", items: npc.biases },
			{ title: "Site Associations", items: npc.keySiteAssociations },
			{ title: "Key Relationships", items: npc.keyRelationshipSummaries },
		])
		.build()
}

export const embeddingTextForCharacterRelationship = (
	rel: NpcRelationshipEmbeddingInput,
	npc1Name?: string,
	npc2Name?: string,
): string => {
	const firstName = rel.npc1Name || npc1Name
	const secondName = rel.npc2Name || npc2Name

	const builder = new EmbeddingBuilder()

	// Add relationship title if we have both names
	if (firstName && secondName) {
		builder.title("Character Relationship", `${firstName} and ${secondName}`)
	} else {
		builder.title("Character Relationship", "Unknown Characters")
	}

	return builder
		.overview(rel.description)
		.fields([
			{ label: "Type", value: rel.relationshipType },
			{ label: "Strength", value: rel.strength },
			{
				label: "Direction",
				value: rel.isBidirectional === true ? "bidirectional" : rel.isBidirectional === false ? "one-way" : undefined,
			},
		])
		.list("History", rel.history)
		.lists([
			{ title: "Narrative Tensions", items: rel.narrativeTensions },
			{ title: "Shared Goals", items: rel.sharedGoals },
			{ title: "Relationship Dynamics", items: rel.relationshipDynamics },
		])
		.build()
}
