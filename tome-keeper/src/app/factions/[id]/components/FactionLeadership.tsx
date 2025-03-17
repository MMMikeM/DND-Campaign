import type { Faction } from "./types"

interface FactionLeadershipProps {
	faction: Faction
}

export function FactionLeadership({ faction }: FactionLeadershipProps) {
	if (!faction.leadership || faction.leadership.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">👑</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Leadership
				</h2>
			</div>
			<div className="p-4 grid grid-cols-1 gap-4">
				{faction.leadership.map((leader) => (
					<div
						key={`leader-${leader.name}`}
						className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
					>
						<h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center">
							<span className="mr-2">👤</span>
							{leader.name}
							{leader.role && (
								<span className="ml-2 px-2 py-0.5 text-xs font-normal bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
									{leader.role}
								</span>
							)}
						</h3>
						{leader.description && (
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								{leader.description}
							</p>
						)}
						{leader.secret && (
							<div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800/50">
								<p className="text-red-700 dark:text-red-300 text-sm flex items-center">
									<span className="mr-1">🔒</span>
									<span className="italic font-medium">Secret:</span>{" "}
									{leader.secret}
								</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
