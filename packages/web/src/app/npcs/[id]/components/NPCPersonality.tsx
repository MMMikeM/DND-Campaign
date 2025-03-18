import type { NPC } from "./types"

export function NPCPersonality({ npc }: { npc: NPC }) {
	if (!npc.personality) return null

	return (
		<div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-4 border-b border-purple-200 dark:border-purple-800/30">
				<span className="text-purple-500 mr-2.5">😀</span>
				<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">Personality</h3>
			</div>
			<div className="p-5">
				<p className="text-gray-800 dark:text-gray-200 leading-relaxed">{npc.personality}</p>
			</div>
		</div>
	)
}
