import type { Faction } from "./types"

interface FactionDescriptionProps {
	faction: Faction
}

export function FactionDescription({ faction }: FactionDescriptionProps) {
	if (!faction.description) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">📝</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Description
				</h2>
			</div>
			<div className="p-4">
				<p className="text-gray-700 dark:text-gray-300">
					{faction.description}
				</p>
			</div>
		</div>
	)
}
