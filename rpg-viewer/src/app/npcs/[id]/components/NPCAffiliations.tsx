import type { NPC } from "./types"

export function NPCAffiliations({ npc }: { npc: NPC }) {
	if (!npc.affiliations) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-cyan-200 dark:border-cyan-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-cyan-200 dark:border-cyan-800/30 bg-cyan-50 dark:bg-cyan-900/20">
				<span className="text-cyan-500 mr-2">🏢</span>
				<h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
					Affiliations
				</h3>
			</div>
			<div className="p-4">
				<ul className="space-y-2">
					{Array.isArray(npc.affiliations) ? (
						npc.affiliations.map((affiliation, index) => (
							<li
								key={`aff-${affiliation.substring(0, 20)}-${index}`}
								className="flex items-start"
							>
								<span className="text-cyan-400 mr-2 mt-1">•</span>
								<span className="text-gray-700 dark:text-gray-300">
									{affiliation}
								</span>
							</li>
						))
					) : (
						<li className="flex items-start">
							<span className="text-cyan-400 mr-2 mt-1">•</span>
							<span className="text-gray-700 dark:text-gray-300">
								{npc.affiliations}
							</span>
						</li>
					)}
				</ul>
			</div>
		</div>
	)
}
