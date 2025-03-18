import type { NPC } from "./types"

export const NPCBackground = ({ currentNpc }: { currentNpc: NPC }) => {
	return (
		currentNpc.background && (
			<div className="bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-800/30 shadow-sm overflow-hidden">
				<div className="flex items-center p-4 border-b border-purple-200 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-900/20">
					<span className="text-purple-500 mr-2">📖</span>
					<h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">Background</h3>
				</div>
				<div className="p-5">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
						{currentNpc.background}
					</p>
				</div>
			</div>
		)
	)
}
