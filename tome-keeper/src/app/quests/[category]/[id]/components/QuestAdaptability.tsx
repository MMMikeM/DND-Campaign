import type { QuestComponentProps } from "./types"

export default function QuestAdaptability({ quest }: QuestComponentProps) {
	// If adaptability is not defined or null, don't render anything
	if (quest.adaptable === undefined || quest.adaptable === null) return null

	return (
		<div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800/30 shadow-sm">
			<h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
				<span className="mr-2">🔄</span>
				Adaptability
			</h2>

			<div className="flex items-center">
				<div
					className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center ${
						quest.adaptable
							? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300"
							: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300"
					}`}
				>
					{quest.adaptable ? "✓" : "✗"}
				</div>
				<span className="text-gray-700 dark:text-gray-300">
					{quest.adaptable
						? "This quest can be adapted to different settings"
						: "This quest is specific to its setting"}
				</span>
			</div>
		</div>
	)
}
