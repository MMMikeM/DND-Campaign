import type { NPC } from "./types"

export function NPCPersonality({ npc }: { npc: NPC }) {
	if (!npc.personality) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-purple-200 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-900/20">
				<span className="text-purple-500 mr-2">😀</span>
				<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">
					Personality
				</h3>
			</div>
			<div className="p-4">{npc.personality}</div>
		</div>
	)
}
