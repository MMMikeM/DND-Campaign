import { motion } from "framer-motion"
import type { NPC } from "./types"
import { SecretToggleButton } from "../../../../components/SecretToggleButton"

export function NPCSecret({
	npc,
	showSecret,
	toggleSecret,
}: {
	npc: NPC
	showSecret: boolean
	toggleSecret: () => void
}) {
	if (!npc.secret) return null

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-lg border ${showSecret ? "border-green-200 dark:border-green-800/30" : "border-red-200 dark:border-red-800/30"} shadow-sm overflow-hidden relative transition-colors duration-300`}
		>
			<div
				className={`flex items-center justify-between p-3 border-b ${showSecret ? "border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20" : "border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20"} transition-colors duration-300`}
			>
				<div className="flex items-center">
					<span
						className={`${showSecret ? "text-green-500" : "text-red-500"} mr-2 transition-colors duration-300`}
					>
						{showSecret ? "🔓" : "🔒"}
					</span>
					<h3
						className={`text-lg font-semibold ${showSecret ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"} flex items-center transition-colors duration-300`}
					>
						<span>Secret</span>
					</h3>
				</div>
				<SecretToggleButton showSecret={showSecret} toggleSecret={toggleSecret} className="ml-2" />
			</div>
			<div className="p-4 relative">
				<div
					className={`text-gray-700 dark:text-gray-300 transition-all duration-300 ${
						showSecret ? "" : "blur-md select-none"
					}`}
				>
					{npc.secret}
				</div>

				{!showSecret && (
					<div className="absolute inset-0 flex items-center justify-center">
						<button
							onClick={toggleSecret}
							type="button"
							className="px-3 py-1 bg-red-100 dark:bg-red-800/70 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 text-sm font-medium rounded-md transition"
						>
							Click to reveal
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
