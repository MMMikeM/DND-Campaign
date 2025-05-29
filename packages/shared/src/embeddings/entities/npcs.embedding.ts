import { createEmbeddingBuilder } from "../embedding-helpers"
import type { NpcEmbeddingInput, NpcRelationshipEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForNpc = (npc: NpcEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Character", npc.name, npc.description)

	builder.addFields("Basic Information", {
		race: npc.race,
		gender: npc.gender,
		age: npc.age,
		occupation: npc.occupation,
		alignment: npc.alignment,
		currentLocation: npc.currentLocationSiteName,
		primaryFaction: npc.primaryFactionNameAndRole,
	})

	builder.addFields("Personality & Behavior", {
		disposition: npc.disposition,
		attitude: npc.attitude,
		socialStatus: npc.socialStatus,
		wealth: npc.wealth,
		trustLevel: npc.trustLevel,
		adaptability: npc.adaptability,
		complexity: npc.complexityProfile,
		playerPerceptionGoal: npc.playerPerceptionGoal,
		availability: npc.availability,
		capability: npc.capability,
		proactivity: npc.proactivity,
		relatability: npc.relatability,
	})

	builder
		.addList("Personality Traits", npc.personalityTraits)
		.addList("Drives & Motivations", npc.drives)
		.addList("Fears", npc.fears)
		.addList("Current Goals", npc.currentGoals)
		.addList("Background", npc.background)
		.addList("Knowledge & Expertise", npc.knowledge)
		.addList("Secrets", npc.secrets)

	builder.ifPresent(npc.quirk, (b) => b.addSection("Quirk", npc.quirk))

	builder
		.addList("Physical Appearance", npc.appearance)
		.addList("Mannerisms", npc.mannerisms)
		.addList("Biases", npc.biases)
		.addList("Site Associations", npc.keySiteAssociations)
		.addList("Key Relationships", npc.keyRelationshipSummaries)

	return builder.build()
}

export const embeddingTextForCharacterRelationship = (
	rel: NpcRelationshipEmbeddingInput,
	npc1Name?: string,
	npc2Name?: string,
): string => {
	const firstName = rel.npc1Name || npc1Name
	const secondName = rel.npc2Name || npc2Name
	const relationshipName = firstName && secondName ? `${firstName} and ${secondName}` : "Unknown Characters"

	const builder = createEmbeddingBuilder()

	builder.setEntity("Character Relationship", relationshipName, rel.description)

	builder.addFields("Relationship Details", {
		type: rel.relationshipType,
		strength: rel.strength,
		direction: rel.isBidirectional === true ? "bidirectional" : rel.isBidirectional === false ? "one-way" : undefined,
	})

	builder
		.addList("History", rel.history)
		.addList("Narrative Tensions", rel.narrativeTensions)
		.addList("Shared Goals", rel.sharedGoals)
		.addList("Relationship Dynamics", rel.relationshipDynamics)

	return builder.build()
}
