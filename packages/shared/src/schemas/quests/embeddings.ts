import { getTextForEmbedding } from "../../lib/embeddings"
import type { questStages, quests } from "./tables"

export const embeddingTextForQuest = (quest: typeof quests.$inferSelect) =>
	getTextForEmbedding(quest, [
		"name",
		"type",
		"description",
		"objectives",
		"themes",
		"mood",
		"urgency",
		"visibility",
		"successOutcomes",
		"failureOutcomes",
		"rewards",
		"inspirations",
		"creativePrompts",
	])

export const embeddingTextForQuestStage = (stage: typeof questStages.$inferSelect) =>
	getTextForEmbedding(stage, [
		"name",
		"description",
		"objectives",
		"dramatic_question",
		"completionPaths",
		"encounters",
		"dramatic_moments",
		"sensory_elements",
		"creativePrompts",
	])
