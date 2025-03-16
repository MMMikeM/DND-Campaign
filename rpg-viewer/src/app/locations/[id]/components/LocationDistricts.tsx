import type { Location } from "./types"
import { formatName } from "./types"

// Districts section component
export function LocationDistricts({
	location,
	navigateToFile,
}: {
	location: Location
	navigateToFile: (path: string) => void
}) {
	if (!location.districts || Object.keys(location.districts).length === 0)
		return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">🏙️</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Districts
				</h2>
			</div>
			<div className="p-4">
				{Object.entries(location.districts).map(([districtId, district]) => (
					<div
						key={`district-${districtId}`}
						className="mb-4 last:mb-0 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 overflow-hidden shadow-sm"
					>
						<div className="p-3 bg-blue-100 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800/30">
							<h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center">
								<span className="text-blue-500 mr-2">🏙️</span>
								{formatName(districtId)}
							</h3>
						</div>

						{district.description && (
							<div className="p-4 pb-2">
								<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
									{district.description}
								</p>
							</div>
						)}

						<div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
							{district.features && district.features.length > 0 && (
								<div className="bg-white dark:bg-gray-800/40 p-3 rounded-md border border-gray-200 dark:border-gray-700">
									<h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
										<span className="text-blue-500 mr-2">✨</span>
										Features
									</h4>
									<ul className="space-y-1">
										{district.features.map((feature) => (
											<li
												key={`district-feature-${feature.substring(0, 20)}`}
												className="flex items-start"
											>
												<span className="text-blue-400 mr-2 mt-1">•</span>
												<span className="text-gray-700 dark:text-gray-300">
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{district.npcs && district.npcs.length > 0 && (
								<div className="bg-white dark:bg-gray-800/40 p-3 rounded-md border border-gray-200 dark:border-gray-700">
									<h4 className="text-md font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center">
										<span className="text-blue-500 mr-2">👤</span>
										NPCs
									</h4>
									<ul className="space-y-1">
										{district.npcs.map((npc) => (
											<li
												key={`district-npc-${npc}`}
												className="flex items-start"
											>
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
					</div>
				))}
			</div>
		</div>
	)
}
