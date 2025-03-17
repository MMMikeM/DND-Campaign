import type { Faction } from "./types"

interface FactionNotesProps {
	faction: Faction
}

export function FactionNotes({ faction }: FactionNotesProps) {
	if (!faction.notes) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-4 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20">
				<span className="text-amber-500 mr-2">📝</span>
				<h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">
					Notes
				</h2>
			</div>
			<div className="p-4">
				<div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
					{faction.notes}
				</div>
			</div>
		</div>
	)
}
