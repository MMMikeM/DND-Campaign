import type { Faction } from "./types"

interface FactionTerritoryProps {
	faction: Faction
}

export function FactionTerritory({ faction }: FactionTerritoryProps) {
	if (!faction.territory) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">🗺️</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Territory
				</h2>
			</div>
			<div className="p-4">
				<p className="text-gray-700 dark:text-gray-300">{faction.territory}</p>
			</div>
		</div>
	)
}
