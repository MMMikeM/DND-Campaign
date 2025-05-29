import { createEmbeddingBuilder } from "../embedding-helpers"
import type { FactionAgendaEmbeddingInput, FactionEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForFaction = (faction: FactionEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Faction", faction.name, faction.description)

	builder.addFields("Basic Information", {
		type: faction.type?.join(", "),
		size: faction.size,
		wealth: faction.wealth,
		reach: faction.reach,
		headquarters: faction.primaryHqSiteName,
	})

	builder.addFields("Alignment & Goals", {
		publicAlignment: faction.publicAlignment,
		secretAlignment: faction.secretAlignment,
		publicGoal: faction.publicGoal,
		secretGoal: faction.secretGoal,
		publicPerception: faction.publicPerception,
		transparencyLevel: faction.transparencyLevel,
	})

	builder.addList("Core Values", faction.values)

	// Culture & Identity sections
	builder
		.addList("History", faction.history)
		.addList("Symbols", faction.symbols)
		.addList("Rituals", faction.rituals)
		.addList("Taboos", faction.taboos)
		.addList("Aesthetics", faction.aesthetics)
		.addList("Jargon", faction.jargon)
		.addList("Recognition Signs", faction.recognitionSigns)

	// Relationships
	builder
		.addList("Allied Factions", faction.keyAllyFactionNames)
		.addList("Enemy Factions", faction.keyEnemyFactionNames)
		.addList("Areas of Influence", faction.areasOfInfluence)

	return builder.build()
}

export const embeddingTextForFactionAgenda = (agenda: FactionAgendaEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Faction Agenda", agenda.name, agenda.description)

	builder.addFields("Agenda Details", {
		faction: agenda.parentFactionName,
		type: agenda.agendaType,
		currentStage: agenda.currentStage,
		importance: agenda.importance,
		ultimateAim: agenda.ultimateAim,
		moralAmbiguity: agenda.moralAmbiguity,
	})

	builder.addList("Approach", agenda.approach).addList("Story Hooks", agenda.storyHooks)

	return builder.build()
}
