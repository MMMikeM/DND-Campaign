import type { Faction } from "./types"

interface FactionRelationsProps {
	faction: Faction
}

export function FactionRelations({ faction }: FactionRelationsProps) {
	const allies = faction.allies
	const enemies = faction.enemies

	if ((!allies || allies.length === 0) && (!enemies || enemies.length === 0))
		return null

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{/* Allies */}
			{allies && allies.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800/30 shadow-sm overflow-hidden">
					<div className="flex items-center p-4 border-b border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20">
						<span className="text-green-500 mr-2">🤝</span>
						<h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
							Allies
						</h2>
					</div>
					<div className="p-4">
						<ul className="space-y-2 dark:text-gray-300">
							{allies.map((ally) => (
								<li key={`ally-${ally}`} className="flex items-start">
									<span className="text-green-400 mr-2 mt-1">•</span>
									<span>{ally}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			{/* Enemies */}
			{enemies && enemies.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800/30 shadow-sm overflow-hidden">
					<div className="flex items-center p-4 border-b border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20">
						<span className="text-red-500 mr-2">⚔️</span>
						<h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
							Enemies
						</h2>
					</div>
					<div className="p-4">
						<ul className="space-y-2 dark:text-gray-300">
							{enemies.map((enemy) => (
								<li key={`enemy-${enemy}`} className="flex items-start">
									<span className="text-red-400 mr-2 mt-1">•</span>
									<span>{enemy}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}
