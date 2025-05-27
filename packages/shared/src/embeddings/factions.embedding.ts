import { EmbeddingBuilder } from "./embedding-helpers"
import type { FactionAgendaEmbeddingInput, FactionEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForFaction = (faction: FactionEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Faction", faction.name)
		.overview(faction.description)
		.basicInfoSection([
			{ label: "Type", value: faction.type?.join(", ") },
			{ label: "Size", value: faction.size },
			{ label: "Wealth", value: faction.wealth },
			{ label: "Reach", value: faction.reach },
			{ label: "Headquarters", value: faction.primaryHqSiteName },
		])
		.basicInfoSection(
			[
				{ label: "Public Alignment", value: faction.publicAlignment },
				{ label: "Secret Alignment", value: faction.secretAlignment },
				{ label: "Public Goal", value: faction.publicGoal },
				{ label: "Secret Goal", value: faction.secretGoal },
				{ label: "Public Perception", value: faction.publicPerception },
				{ label: "Transparency Level", value: faction.transparencyLevel },
			],
			"Alignment & Goals",
		)
		.list("Core Values", faction.values)
		.groupedLists("Culture & Identity", [
			{ title: "History", items: faction.history },
			{ title: "Symbols", items: faction.symbols },
			{ title: "Rituals", items: faction.rituals },
			{ title: "Taboos", items: faction.taboos },
			{ title: "Aesthetics", items: faction.aesthetics },
		])
		.field("Jargon", faction.jargon)
		.list("Recognition Signs", faction.recognitionSigns)
		.groupedLists("Relationships", [
			{ title: "Allied Factions", items: faction.keyAllyFactionNames },
			{ title: "Enemy Factions", items: faction.keyEnemyFactionNames },
			{ title: "Areas of Influence", items: faction.areasOfInfluence },
		])
		.build()
}

export const embeddingTextForFactionAgenda = (agenda: FactionAgendaEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Faction Agenda", agenda.name)
		.overview(agenda.description)
		.fields([
			{ label: "Faction", value: agenda.parentFactionName },
			{ label: "Type", value: agenda.agendaType },
			{ label: "Current Stage", value: agenda.currentStage },
			{ label: "Importance", value: agenda.importance },
			{ label: "Ultimate Aim", value: agenda.ultimateAim },
			{ label: "Moral Ambiguity", value: agenda.moralAmbiguity },
		])
		.lists([
			{ title: "Approach", items: agenda.approach },
			{ title: "Story Hooks", items: agenda.storyHooks },
		])
		.build()
}
