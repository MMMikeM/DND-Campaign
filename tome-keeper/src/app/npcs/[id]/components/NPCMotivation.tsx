import type { NPC } from "./types"

export function NPCMotivation({ npc }: { npc: NPC }) {
	if (!npc.motivation) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-rose-200 dark:border-rose-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-rose-200 dark:border-rose-800/30 bg-rose-50 dark:bg-rose-900/20">
				<span className="text-rose-500 mr-2">🎯</span>
				<h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">
					Motivation
				</h3>
			</div>
			<div className="p-4">
				<div className="text-gray-700 dark:text-gray-300">{npc.motivation}</div>
			</div>
		</div>
	)
}
