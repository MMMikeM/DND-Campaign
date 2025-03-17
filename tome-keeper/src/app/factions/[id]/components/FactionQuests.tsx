import type { Faction } from "./types"
import Link from "next/link"

interface FactionQuestsProps {
	faction: Faction
}

export function FactionQuests({ faction }: FactionQuestsProps) {
	if (!faction.quests || faction.quests.length === 0) return null

	// Helper function to convert quest ID to URL
	const getQuestUrl = (questId: string) => {
		// Extract category and ID from the quest identifier
		const parts = questId.split("-")
		if (parts.length >= 2) {
			const category = parts[0]
			return `/quests/${category}/${questId}`
		}
		// Fallback if the format doesn't match expected pattern
		return `/quests/main/${questId}`
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-4 border-b border-indigo-200 dark:border-indigo-800/30 bg-indigo-50 dark:bg-indigo-900/20">
				<span className="text-indigo-500 mr-2">📜</span>
				<h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
					Quests
				</h2>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{faction.quests.map((quest) => (
						<li key={`quest-${quest}`} className="relative">
							<Link
								href={getQuestUrl(quest)}
								className="w-full text-left p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 transition-colors flex items-center text-indigo-700 dark:text-indigo-300"
							>
								<span className="mr-2">📋</span>
								{quest}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
