import type { Location } from "./types"
import { formatName } from "./types"

// Quests section component
export function LocationQuests({
	location,
	navigateToFile,
}: {
	location: Location
	navigateToFile: (path: string) => void
}) {
	if (!location.quests || Object.keys(location.quests).length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">📜</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Quests
				</h2>
			</div>
			<div className="p-4">
				{Object.entries(location.quests).map(([questId, quest]) => (
					<div
						key={`quest-${questId}`}
						className="mb-4 last:mb-0 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800/30 overflow-hidden shadow-sm"
					>
						<div className="p-3 bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800/30">
							<h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 flex items-center">
								<span className="text-amber-500 mr-2">📜</span>
								{quest.title || formatName(questId)}
							</h3>

							{quest.quest_giver && (
								<div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center">
									<span className="mr-1">👤</span>
									Quest Giver:
									<button
										type="button"
										className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
										onClick={() => navigateToFile(`${quest.quest_giver}.yaml`)}
									>
										{formatName(quest.quest_giver)}
									</button>
								</div>
							)}
						</div>

						{quest.description && (
							<div className="p-4 pb-2">
								<p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
									{quest.description}
								</p>
							</div>
						)}

						<div className="px-4 pb-4 space-y-3">
							{quest.rewards && quest.rewards.length > 0 && (
								<div className="bg-white dark:bg-gray-800/40 p-3 rounded-md border border-gray-200 dark:border-gray-700">
									<h4 className="text-md font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center">
										<span className="text-amber-500 mr-2">💰</span>
										Rewards
									</h4>
									<ul className="space-y-1">
										{quest.rewards.map((reward) => (
											<li
												key={`quest-reward-${reward.substring(0, 20)}`}
												className="flex items-start"
											>
												<span className="text-amber-400 mr-2 mt-1">•</span>
												<span className="text-gray-700 dark:text-gray-300">
													{reward}
												</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{quest.related_locations &&
								quest.related_locations.length > 0 && (
									<div className="bg-white dark:bg-gray-800/40 p-3 rounded-md border border-gray-200 dark:border-gray-700">
										<h4 className="text-md font-medium text-green-700 dark:text-green-400 mb-2 flex items-center">
											<span className="text-green-500 mr-2">🗺️</span>
											Related Locations
										</h4>
										<ul className="space-y-1">
											{quest.related_locations.map((loc) => (
												<li
													key={`quest-location-${loc}`}
													className="flex items-start"
												>
													<span className="text-green-400 mr-2 mt-1">•</span>
													<button
														type="button"
														className="text-blue-600 dark:text-blue-400 hover:underline"
														onClick={() => navigateToFile(`/locations/${loc}`)}
													>
														{formatName(loc)}
													</button>
												</li>
											))}
										</ul>
									</div>
								)}

							{(quest.prerequisites && quest.prerequisites.length > 0) ||
							(quest.follow_ups && quest.follow_ups.length > 0) ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{quest.prerequisites && quest.prerequisites.length > 0 && (
										<div className="bg-white dark:bg-gray-800/40 p-3 rounded-md border border-gray-200 dark:border-gray-700">
											<h4 className="text-md font-medium text-purple-700 dark:text-purple-400 mb-2 flex items-center">
												<span className="text-purple-500 mr-2">⏮️</span>
												Prerequisites
											</h4>
											<ul className="space-y-1">
												{quest.prerequisites.map((prereq) => (
													<li
														key={`quest-prereq-${prereq}`}
														className="flex items-start"
													>
														<span className="text-purple-400 mr-2 mt-1">•</span>
														<span className="text-gray-700 dark:text-gray-300">
															{formatName(prereq)}
														</span>
													</li>
												))}
											</ul>
										</div>
									)}

									{quest.follow_ups && quest.follow_ups.length > 0 && (
										<div className="bg-white dark:bg-gray-800/40 p-3 rounded-md border border-gray-200 dark:border-gray-700">
											<h4 className="text-md font-medium text-indigo-700 dark:text-indigo-400 mb-2 flex items-center">
												<span className="text-indigo-500 mr-2">⏭️</span>
												Follow-up Quests
											</h4>
											<ul className="space-y-1">
												{quest.follow_ups.map((followUp) => (
													<li
														key={`quest-followup-${followUp}`}
														className="flex items-start"
													>
														<span className="text-indigo-400 mr-2 mt-1">•</span>
														<span className="text-gray-700 dark:text-gray-300">
															{formatName(followUp)}
														</span>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							) : null}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
