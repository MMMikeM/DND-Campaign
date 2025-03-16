import type { NPC } from "./types"

export function NPCStats({ npc }: { npc: NPC }) {
	if (!npc.stats) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">📊</span>
				<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
					Stats
				</h3>
			</div>
			<div className="p-4">
				<div className="text-gray-700 dark:text-gray-300 whitespace-pre-line font-mono bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
					{npc.stats}
				</div>
			</div>
		</div>
	)
}
