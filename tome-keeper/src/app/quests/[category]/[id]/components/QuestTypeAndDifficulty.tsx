import type { QuestComponentProps } from "./types"

export default function QuestTypeAndDifficulty({ quest }: QuestComponentProps) {
	if (!quest.type && !quest.difficulty) return null

	// Define difficulty colors
	const difficultyColors = {
		Easy: {
			bg: "bg-green-100 dark:bg-green-900/20",
			text: "text-green-800 dark:text-green-300",
			border: "border-green-200 dark:border-green-800/30",
		},
		Medium: {
			bg: "bg-blue-100 dark:bg-blue-900/20",
			text: "text-blue-800 dark:text-blue-300",
			border: "border-blue-200 dark:border-blue-800/30",
		},
		Hard: {
			bg: "bg-amber-100 dark:bg-amber-900/20",
			text: "text-amber-800 dark:text-amber-300",
			border: "border-amber-200 dark:border-amber-800/30",
		},
		"Very Hard": {
			bg: "bg-orange-100 dark:bg-orange-900/20",
			text: "text-orange-800 dark:text-orange-300",
			border: "border-orange-200 dark:border-orange-800/30",
		},
		Legendary: {
			bg: "bg-red-100 dark:bg-red-900/20",
			text: "text-red-800 dark:text-red-300",
			border: "border-red-200 dark:border-red-800/30",
		},
	}

	// Get difficulty colors or default
	const difficultyColor =
		quest.difficulty && difficultyColors[quest.difficulty]
			? difficultyColors[quest.difficulty]
			: {
					bg: "bg-gray-100 dark:bg-gray-900/20",
					text: "text-gray-800 dark:text-gray-300",
					border: "border-gray-200 dark:border-gray-800/30",
				}

	return (
		<div
			className={`${difficultyColor.bg} p-4 rounded-lg border ${difficultyColor.border} shadow-sm`}
		>
			<div className="flex flex-col space-y-3">
				{quest.type && (
					<div>
						<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
							Quest Type
						</h3>
						<div className="text-gray-700 dark:text-gray-300 font-medium">
							{quest.type}
						</div>
					</div>
				)}

				{quest.difficulty && (
					<div>
						<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
							Difficulty
						</h3>
						<div className={`${difficultyColor.text} font-medium`}>
							{quest.difficulty}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
