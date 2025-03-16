import type { NPC } from "./types"

export function NPCQuests({
	npc,
	navigateToFile,
}: {
	npc: NPC
	navigateToFile: (path: string) => void
}) {
	if (!npc.quests) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20">
				<span className="text-amber-500 mr-2">📜</span>
				<h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
					Quests
				</h3>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{Array.isArray(npc.quests) ? (
						npc.quests.map((questId) => (
							<li key={`quest-${questId}`} className="relative">
								<button
									type="button"
									className="w-full text-left p-2 rounded-md bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center text-amber-700 dark:text-amber-300"
									onClick={() =>
										navigateToFile(`shattered-spire-quests.yaml#${questId}`)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault()
											navigateToFile(`shattered-spire-quests.yaml#${questId}`)
										}
									}}
								>
									<span className="mr-2">📋</span>
									{questId}
								</button>
							</li>
						))
					) : (
						<li className="relative">
							<button
								type="button"
								className="w-full text-left p-2 rounded-md bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center text-amber-700 dark:text-amber-300"
								onClick={() =>
									navigateToFile(`shattered-spire-quests.yaml#${npc.quests}`)
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault()
										navigateToFile(`shattered-spire-quests.yaml#${npc.quests}`)
									}
								}}
							>
								<span className="mr-2">📋</span>
								{npc.quests}
							</button>
						</li>
					)}
				</ul>
			</div>
		</div>
	)
}
