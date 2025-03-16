import type { Location } from "./types"
import { formatName } from "./types"
import { MapIcon, EncounterIcon, TreasureIcon } from "./icons"

// Areas section component
export function LocationAreas({
	location,
	navigateToFile,
}: {
	location: Location
	navigateToFile: (path: string) => void
}) {
	if (!location.areas || Object.keys(location.areas).length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">
					<MapIcon />
				</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Areas
				</h2>
			</div>
			<div className="p-4 grid grid-cols-1 gap-4">
				{Object.entries(location.areas).map(([areaId, area]) => (
					<div
						key={`area-${areaId}`}
						className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
					>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
							<span className="text-indigo-500 mr-2">
								<MapIcon />
							</span>
							{formatName(areaId)}
						</h3>

						{area.description && (
							<div className="mb-4">
								<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
									{area.description}
								</p>
							</div>
						)}

						{area.features && area.features.length > 0 && (
							<div className="mb-4 bg-white dark:bg-gray-800/40 p-3 rounded-md border border-gray-200 dark:border-gray-700">
								<h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
									<span className="text-indigo-500 mr-2">✨</span>
									Features
								</h4>
								<ul className="space-y-1">
									{area.features.map((feature) => (
										<li
											key={`area-feature-${feature.substring(0, 20)}`}
											className="flex items-start"
										>
											<span className="text-indigo-400 mr-2 mt-1">•</span>
											<span className="text-gray-700 dark:text-gray-300">
												{feature}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{area.encounters && area.encounters.length > 0 && (
							<div className="mb-4 bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-200 dark:border-red-800/30">
								<h4 className="text-md font-medium text-red-700 dark:text-red-400 mb-2 flex items-center">
									<span className="text-red-500 mr-2">
										<EncounterIcon />
									</span>
									Encounters
								</h4>
								<ul className="space-y-1">
									{area.encounters.map((encounter) => (
										<li
											key={`area-encounter-${encounter.substring(0, 20)}`}
											className="flex items-start"
										>
											<span className="text-red-400 mr-2 mt-1">•</span>
											<span className="text-gray-700 dark:text-gray-300">
												{encounter}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{area.treasure && area.treasure.length > 0 && (
							<div className="mb-4 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md border border-amber-200 dark:border-amber-800/30">
								<h4 className="text-md font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center">
									<span className="text-amber-500 mr-2">
										<TreasureIcon />
									</span>
									Treasure
								</h4>
								<ul className="space-y-1">
									{area.treasure.map((item) => (
										<li
											key={`area-treasure-${item.substring(0, 20)}`}
											className="flex items-start"
										>
											<span className="text-amber-400 mr-2 mt-1">•</span>
											<span className="text-gray-700 dark:text-gray-300">
												{item}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{area.npcs && area.npcs.length > 0 && (
							<div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md border border-blue-200 dark:border-blue-800/30">
								<h4 className="text-md font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center">
									<span className="text-blue-500 mr-2">👤</span>
									NPCs
								</h4>
								<ul className="space-y-1">
									{area.npcs.map((npc) => (
										<li key={`area-npc-${npc}`} className="flex items-start">
											<span className="text-blue-400 mr-2 mt-1">•</span>
											<button
												type="button"
												className="text-blue-600 dark:text-blue-400 hover:underline"
												onClick={() => navigateToFile(`${npc}.yaml`)}
											>
												{formatName(npc)}
											</button>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
