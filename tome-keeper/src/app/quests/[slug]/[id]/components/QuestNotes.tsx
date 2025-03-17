import type { QuestNotesProps } from "./types"

export default function QuestNotes({
	quest,
	showDMNotes,
	toggleDMNotes,
}: QuestNotesProps) {
	if (!quest.dm_notes) return null

	return (
		<div className="relative">
			{!showDMNotes ? (
				<div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800/30 shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<span className="text-purple-500 mr-2">🔒</span>
							<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">
								DM Notes
							</h3>
						</div>
						<button
							type="button"
							onClick={toggleDMNotes}
							className="px-3 py-1 bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-800 dark:text-purple-200 rounded-md text-sm transition-colors"
						>
							Show
						</button>
					</div>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						This section contains DM-only information.
					</p>
				</div>
			) : (
				<div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800/30 shadow-sm">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center">
							<span className="text-purple-500 mr-2">📝</span>
							<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">
								DM Notes
							</h3>
						</div>
						<button
							type="button"
							onClick={toggleDMNotes}
							className="px-3 py-1 bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-800 dark:text-purple-200 rounded-md text-sm transition-colors"
						>
							Hide
						</button>
					</div>
					<div className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
						{quest.dm_notes}
					</div>
				</div>
			)}
		</div>
	)
}
