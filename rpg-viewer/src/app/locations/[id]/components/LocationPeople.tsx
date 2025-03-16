import type { Location } from "./types"
import { formatName } from "./types"

// NPCs section component
export function LocationNPCs({
	location,
	navigateToFile,
}: {
	location: Location
	navigateToFile: (path: string) => void
}) {
	if (!location.npcs || location.npcs.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">👤</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					NPCs
				</h2>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{location.npcs.map((npc) => (
						<li key={`npc-${npc}`} className="relative">
							<button
								className="w-full text-left p-2 rounded-md bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 transition-colors flex items-center text-blue-700 dark:text-blue-300"
								type="button"
								onClick={() => navigateToFile(`${npc}.yaml`)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault()
										navigateToFile(`${npc}.yaml`)
									}
								}}
							>
								<span className="mr-2">👤</span>
								{formatName(npc)}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

// Factions section component
export function LocationFactions({
	location,
	navigateToFile,
}: {
	location: Location
	navigateToFile: (path: string) => void
}) {
	if (!location.factions || location.factions.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">🏛️</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Factions
				</h2>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{location.factions.map((faction) => (
						<li key={`faction-${faction}`} className="relative">
							<button
								className="w-full text-left p-2 rounded-md bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center text-amber-700 dark:text-amber-300"
								type="button"
								onClick={() => navigateToFile(`/factions/${faction}`)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault()
										navigateToFile(`/factions/${faction}`)
									}
								}}
							>
								<span className="mr-2">🏛️</span>
								{formatName(faction)}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
