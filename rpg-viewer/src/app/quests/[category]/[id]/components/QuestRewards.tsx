import type { QuestComponentProps } from "./types"

export default function QuestRewards({ quest }: QuestComponentProps) {
	// If no rewards, don't render anything
	if (!quest.rewards) return null

	// Check if rewards is an array
	const isRewardsArray = Array.isArray(quest.rewards)

	// Check if rewards is an object with paths
	const isRewardsObject = !isRewardsArray && typeof quest.rewards === "object"

	// If rewards is empty (empty array or object), don't render
	if (
		(isRewardsArray && quest.rewards.length === 0) ||
		(isRewardsObject && Object.keys(quest.rewards).length === 0)
	) {
		return null
	}

	return (
		<div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm">
			<div className="flex items-center mb-2">
				<span className="text-amber-500 mr-2">🏆</span>
				<h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
					Rewards
				</h3>
			</div>

			{/* Render array of rewards */}
			{isRewardsArray && (
				<ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
					{quest.rewards.map((reward, index) => (
						<li key={`reward-${quest.id}-${index}`} className="pl-1">
							{reward}
						</li>
					))}
				</ul>
			)}

			{/* Render object with paths and rewards */}
			{isRewardsObject && (
				<div className="space-y-4">
					{Object.entries(quest.rewards).map(([pathName, rewards]) => (
						<div key={`reward-path-${pathName}`}>
							<h4 className="font-medium text-amber-700 dark:text-amber-300 capitalize mb-2">
								{pathName.replace(/_/g, " ")}:
							</h4>
							{Array.isArray(rewards) ? (
								<ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
									{rewards.map((reward, idx) => (
										<li
											key={`reward-${quest.id}-${pathName}-${idx}-${String(reward).substring(0, 10)}`}
											className="pl-1"
										>
											{reward}
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-800 dark:text-gray-200 pl-5">
									{String(rewards)}
								</p>
							)}
						</div>
					))}
				</div>
			)}

			{/* Fallback for string or other types */}
			{!isRewardsArray && !isRewardsObject && (
				<p className="text-gray-800 dark:text-gray-200">
					{String(quest.rewards)}
				</p>
			)}
		</div>
	)
}
