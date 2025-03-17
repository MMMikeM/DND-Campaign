import type { NPC } from "./types"
import Link from "next/link"

export function NPCQuests({
	npc,
}: {
	npc: NPC
}) {
	if (!npc.quests) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20">
				<span className="text-amber-500 mr-2">📜</span>
				<h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">Quests</h3>
			</div>
			<div className="p-4">
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{Array.isArray(npc.quests) ? (
						npc.quests.map((quest, index) => {
							// Handle both old format (string) and new format (object with id and description)
							const questId = typeof quest === "string" ? quest : quest.id
							const questDescription = typeof quest === "string" ? quest : quest.description

							return (
								<li key={`quest-${questId || index}`} className="relative">
									<Link
										href={`/quests/${questId}`}
										className="w-full text-left p-2 rounded-md bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center text-amber-700 dark:text-amber-300"
									>
										<span className="mr-2">📋</span>
										<div>
											<div className="font-medium">{questId}</div>
											{questDescription !== questId && (
												<div className="text-sm text-amber-600 dark:text-amber-400">
													{questDescription}
												</div>
											)}
										</div>
									</Link>
								</li>
							)
						})
					) : (
						<li className="relative">
							<Link
								href={`/quests/${npc.quests}`}
								className="w-full text-left p-2 rounded-md bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center text-amber-700 dark:text-amber-300"
							>
								<span className="mr-2">📋</span>
								{npc.quests}
							</Link>
						</li>
					)}
				</ul>
			</div>
		</div>
	)
}
