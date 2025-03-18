import type { NPC } from "./types"

export function NPCDescription({ npc }: { npc: NPC }) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800/30 shadow-sm overflow-hidden">
			<div className="flex items-center p-3 border-b border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/20">
				<span className="text-blue-500 mr-2">📝</span>
				<h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Description</h3>
			</div>
			<ul className="p-4">
				{npc.description.map((line) => (
					<li key={line}>{line}</li>
				))}
			</ul>
		</div>
	)
}
