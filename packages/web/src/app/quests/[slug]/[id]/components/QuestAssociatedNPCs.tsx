import type { QuestComponentProps } from "./types"

export default function QuestAssociatedNPCs({ quest }: QuestComponentProps) {
	if (!quest.associated_npc || quest.associated_npc.length === 0) return null

	return (
		<section className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800/30 shadow-sm">
			<h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
				<span className="mr-2">👥</span>
				Associated NPCs
			</h2>

			<div className="space-y-2">
				{quest.associated_npc.map((npc) => (
					<div
						key={npc}
						className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center"
					>
						<div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3">
							{npc.charAt(0).toUpperCase()}
						</div>
						<span className="text-gray-700 dark:text-gray-300">{npc}</span>
					</div>
				))}
			</div>
		</section>
	)
}
