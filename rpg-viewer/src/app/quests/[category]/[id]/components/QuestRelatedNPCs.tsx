import type { QuestRelatedNPCsProps } from "./types"

export default function QuestRelatedNPCs({
	quest,
	navigateToFile,
}: QuestRelatedNPCsProps) {
	if (!quest.related_npcs || quest.related_npcs.length === 0) return null

	const handleNPCClick = (npcName: string) => {
		// Convert NPC name to slug format for navigation
		const npcSlug = npcName
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")

		navigateToFile(`/npcs/${npcSlug}`)
	}

	return (
		<div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800/30 shadow-sm">
			<div className="flex items-center mb-2">
				<span className="text-indigo-500 mr-2">👥</span>
				<h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
					Related NPCs
				</h3>
			</div>
			<ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
				{quest.related_npcs.map((npc, index) => (
					<li key={`related-npc-${quest.id}-${index}`} className="pl-1">
						<button
							type="button"
							className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-transparent border-none p-0"
							onClick={() => handleNPCClick(npc)}
						>
							{npc}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}
