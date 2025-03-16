import type { QuestComponentProps } from "./types"

export default function QuestDescription({ quest }: QuestComponentProps) {
	if (!quest.description) return null

	return (
		<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30 shadow-sm">
			<div className="flex items-center mb-2">
				<span className="text-blue-500 mr-2">📜</span>
				<h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
					Description
				</h3>
			</div>
			<div className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
				{quest.description}
			</div>
		</div>
	)
}
