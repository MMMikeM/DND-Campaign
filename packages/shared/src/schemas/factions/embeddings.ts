import { getTextForEmbedding } from "../../lib/embeddings"
import type { factionAgendas, factionCulture, factions } from "./tables"

export const embeddingTextForFaction = (faction: typeof factions.$inferSelect) =>
	getTextForEmbedding(faction, [
		"name",
		"type",
		"description",
		"values",
		"history",
		"publicGoal",
		"secretGoal",
		"publicPerception",
		"resources",
	])

export const embeddingTextForFactionAgenda = (agenda: typeof factionAgendas.$inferSelect) =>
	getTextForEmbedding(agenda, [
		"name",
		"agendaType",
		"currentStage",
		"importance",
		"ultimateAim",
		"moralAmbiguity",
		"description",
		"hiddenCosts",
		"keyOpponents",
		"internalConflicts",
		"approach",
		"publicImage",
		"personalStakes",
		"storyHooks",
		"creativePrompts",
	])

export const embeddingTextForFactionCulture = (culture: typeof factionCulture.$inferSelect) =>
	getTextForEmbedding(culture, ["symbols", "rituals", "taboos", "aesthetics", "jargon", "recognitionSigns"])
