import type { NPC } from "./types"

export function NPCRelationships({ npc }: { npc: NPC }) {
	if (!npc.relationships) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-teal-200 dark:border-teal-800/30 bg-teal-50 dark:bg-teal-900/20">
				<span className="text-teal-500 mr-2">🔗</span>
				<h3 className="text-lg font-semibold text-teal-700 dark:text-teal-400">
					Relationships
				</h3>
			</div>
			<div className="p-4">
				<ul className="space-y-2">
					{Array.isArray(npc.relationships) ? (
						npc.relationships.map((relationship, index) => (
							<li
								key={`rel-${relationship.substring(0, 20)}-${index}`}
								className="flex items-start"
							>
								<span className="text-teal-400 mr-2 mt-1">•</span>
								<span className="text-gray-700 dark:text-gray-300">
									{relationship}
								</span>
							</li>
						))
					) : (
						<li className="flex items-start">
							<span className="text-teal-400 mr-2 mt-1">•</span>
							<span className="text-gray-700 dark:text-gray-300">
								{npc.relationships}
							</span>
						</li>
					)}
				</ul>
			</div>
		</div>
	)
}
