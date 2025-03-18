import type { QuestsFile } from "@/server/schemas"

// Define the Quest type from the schema
export type Quest = QuestsFile["quests"][number]

export interface QuestComponentProps {
	quest: Quest
}

export interface QuestHeaderProps {
	quest: Quest
	questId: string
	quests: Quest[]
	handleQuestChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	showDMNotes: boolean
	toggleDMNotes: () => void
	toggleAllDMContent: () => void
}

export interface QuestNotesProps {
	quest: Quest
	showDMNotes: boolean
	toggleDMNotes: () => void
}

export interface QuestLocationProps {
	quest: Quest
}

export interface QuestRelatedNPCsProps {
	quest: Quest
}
