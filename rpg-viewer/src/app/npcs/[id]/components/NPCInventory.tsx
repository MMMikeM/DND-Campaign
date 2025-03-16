import type { NPC } from "./types"

export function NPCInventory({
	npc,
	showInventory,
	toggleInventory,
}: {
	npc: NPC
	showInventory: boolean
	toggleInventory: () => void
}) {
	if (!npc.inventory) return null

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-lg border ${showInventory ? "border-green-200 dark:border-green-800/30" : "border-yellow-200 dark:border-yellow-800/30"} shadow-sm overflow-hidden relative transition-colors duration-300`}
		>
			<div
				className={`flex items-center p-3 border-b ${showInventory ? "border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20" : "border-yellow-200 dark:border-yellow-800/30 bg-yellow-50 dark:bg-yellow-900/20"} transition-colors duration-300`}
			>
				<span
					className={`${showInventory ? "text-green-500" : "text-yellow-500"} mr-2 transition-colors duration-300`}
				>
					{showInventory ? "🔓" : "💼"}
				</span>
				<h3
					className={`text-lg font-semibold ${showInventory ? "text-green-700 dark:text-green-400" : "text-yellow-700 dark:text-yellow-400"} flex items-center transition-colors duration-300`}
				>
					<span>Inventory</span>
					<button
						onClick={toggleInventory}
						type="button"
						className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full transition-colors cursor-pointer flex items-center ${
							showInventory
								? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700"
								: "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700"
						}`}
						aria-label={
							showInventory
								? "Hide inventory content"
								: "Show inventory content"
						}
					>
						<span>DM Only</span>
						<span className="ml-1">{showInventory ? "👁️" : "👁️‍🗨️"}</span>
					</button>
				</h3>
			</div>
			<div className="p-4 relative">
				<ul
					className={`space-y-2 transition-all duration-300 ${
						showInventory ? "" : "blur-md select-none"
					}`}
				>
					{Array.isArray(npc.inventory) ? (
						npc.inventory.map((item, index) => (
							<li
								key={`inv-${item.substring(0, 20)}-${index}`}
								className="flex items-start"
							>
								<span className="text-yellow-400 mr-2 mt-1">•</span>
								<span className="text-gray-700 dark:text-gray-300">{item}</span>
							</li>
						))
					) : (
						<li className="flex items-start">
							<span className="text-yellow-400 mr-2 mt-1">•</span>
							<span className="text-gray-700 dark:text-gray-300">
								{npc.inventory}
							</span>
						</li>
					)}
				</ul>

				{!showInventory && (
					<div className="absolute inset-0 flex items-center justify-center">
						<button
							onClick={toggleInventory}
							type="button"
							className="px-3 py-1 bg-yellow-100 dark:bg-yellow-800/70 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-md transition"
						>
							Click to reveal
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
