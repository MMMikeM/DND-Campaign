import type { Faction } from "./types"

interface FactionGoalsProps {
	faction: Faction
}

export function FactionGoals({ faction }: FactionGoalsProps) {
	if (!faction.public_goal && !faction.true_goal) return null

	return (
		<div className="grid grid-cols-1 gap-4 mb-6">
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
				{/* Handle rich faction schema with public_goal/true_goal */}
				{faction.public_goal && (
					<div className="p-4 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center mb-2">
							<span className="text-emerald-500 mr-2">🌐</span>
							<h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
								Public Goal
							</h3>
						</div>
						<p className="text-gray-700 dark:text-gray-300">
							{faction.public_goal}
						</p>
					</div>
				)}

				{faction.true_goal && (
					<div className="p-4">
						<div className="flex items-center mb-2">
							<span className="text-rose-500 mr-2">🎭</span>
							<h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">
								True Goal
							</h3>
						</div>
						<p className="text-gray-700 dark:text-gray-300">
							{faction.true_goal}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
