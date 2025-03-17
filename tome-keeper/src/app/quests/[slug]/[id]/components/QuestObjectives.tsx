import type { QuestComponentProps } from "./types"

export default function QuestObjectives({ quest }: QuestComponentProps) {
	if (!quest.objectives || quest.objectives.length === 0) return null

	return (
		<div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800/30 shadow-sm">
			<div className="flex items-center mb-2">
				<span className="text-green-500 mr-2">✅</span>
				<h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
					Objectives
				</h3>
			</div>
			<ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
				{quest.objectives.map((objective, index) => (
					<li key={`objective-${quest.id}-${index}`} className="pl-1">
						{objective}
					</li>
				))}
			</ul>
		</div>
	)
}
