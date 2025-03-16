import type { ChangeEvent } from "react"
import { formatName, getNPCRoleStyle } from "./types"
import type { NPC } from "./types"
import { EyeIcon, EyeSlashIcon } from "./icons"

// Helper function to get NPC ID
const getNpcId = (npc: NPC): string => {
	return npc.id || (npc.name ? npc.name.toLowerCase().replace(/\s+/g, "-") : "")
}

// Header component with NPC selector and title
export function NPCHeader({
	npc,
	npcId,
	npcs,
	handleNpcChange,
	showSecret,
	showInventory,
	toggleAllDMContent,
}: {
	npc: NPC
	npcId: string
	npcs: NPC[]
	handleNpcChange: (e: ChangeEvent<HTMLSelectElement>) => void
	showSecret: boolean
	showInventory: boolean
	toggleAllDMContent: () => void
}) {
	const roleStyle = getNPCRoleStyle(npc.role || "default")

	return (
		<header className="relative">
			{/* NPC selector */}
			<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
				<div>
					<label
						htmlFor="npc-select"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						NPC
					</label>
					<select
						id="npc-select"
						value={npcId}
						onChange={handleNpcChange}
						className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{npcs
							.filter((npc) => npc.name)
							.map((npc) => {
								const id = getNpcId(npc)
								return (
									<option key={id} value={id}>
										{npc.name}
									</option>
								)
							})}
					</select>
				</div>
			</div>

			{/* NPC title bar */}
			<div className="p-6 pb-4 flex items-start justify-between">
				<div className="flex-1">
					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<h1
								className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1"
								id={`npc-${getNpcId(npc)}`}
							>
								{npc.name}
							</h1>

							{/* DM Content Status */}
							{npc.secret && (
								<div className="flex items-center mt-1">
									<div
										className={`h-2 w-2 rounded-full mr-2 ${showSecret && showInventory ? "bg-green-500" : "bg-amber-500"}`}
									/>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{showSecret && showInventory
											? "All DM content visible"
											: "Some DM content hidden"}
									</span>
								</div>
							)}
						</div>

						{/* DM Content Toggle Button */}
						{npc.secret && (
							<button
								type="button"
								onClick={toggleAllDMContent}
								className={`flex items-center text-sm font-medium ml-4 p-2 rounded-full transition ${
									showSecret && showInventory
										? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
										: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
								}`}
								aria-label={
									showSecret && showInventory
										? "Hide all DM content"
										: "Show all DM content"
								}
								title={
									showSecret && showInventory
										? "Hide all DM content"
										: "Show all DM content"
								}
							>
								{showSecret && showInventory ? (
									<>
										<EyeSlashIcon />
										<span className="sr-only">Hide All DM Content</span>
									</>
								) : (
									<>
										<EyeIcon />
										<span className="sr-only">Show All DM Content</span>
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Role and Location badges */}
			{(npc.role || npc.location) && (
				<div className="px-6 pb-4">
					<div className="flex flex-wrap gap-2">
						{npc.role && (
							<span
								className={[
									"inline-flex",
									"items-center",
									"px-3",
									"py-1",
									"rounded-full",
									"text-sm",
									"font-medium",
									roleStyle.bgClass,
									roleStyle.textClass,
								].join(" ")}
							>
								<span className="mr-1">{roleStyle.icon}</span> {npc.role}
							</span>
						)}

						{npc.location && (
							<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
								<span className="mr-1">📍</span> {npc.location}
							</span>
						)}
					</div>
				</div>
			)}
		</header>
	)
}
