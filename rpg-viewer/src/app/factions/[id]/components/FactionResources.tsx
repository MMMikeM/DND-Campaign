import type { Faction } from "./types"

interface FactionResourcesProps {
	faction: Faction
}

export function FactionResources({ faction }: FactionResourcesProps) {
	if (!faction.resources || faction.resources.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">💰</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Resources
				</h2>
			</div>
			<div className="p-4">
				<ul className="space-y-2 dark:text-gray-300">
					{faction.resources.map((resource) => (
						<li key={`resource-${resource}`} className="flex items-start">
							<span className="text-gray-400 mr-2 mt-1">•</span>
							<span>{resource}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
