import type { ChangeEvent } from "react"
import { getNPCRoleStyle } from "./types"
import type { NPC } from "./types"
import { EyeIcon, EyeSlashIcon } from "./icons"
import { nameToId } from "@/server/utils/contentUtils"

const getNpcId = (npc: NPC): string => {
	return npc.id || (npc.name ? nameToId(npc.name) : "")
}

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
	return (
		<header className="relative">
			{/* NPC selector - improved and more compact styling */}
			<div className="p-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center">
				<div className="flex-1 flex items-center gap-2">
					<label
						htmlFor="npc-select"
						className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
					>
						NPC:
					</label>
					<div className="relative flex-1">
						<select
							id="npc-select"
							value={npcId}
							onChange={handleNpcChange}
							className="w-full py-1.5 px-3 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
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
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>

					{/* DM Content Toggle Button - moved to the right side of the selector */}
					{npc.secret && (
						<button
							type="button"
							onClick={toggleAllDMContent}
							className={`flex items-center justify-center h-8 w-8 text-sm font-medium rounded-md transition-all duration-200 ${
								showSecret || showInventory
									? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
									: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
							}`}
							aria-label={
								showSecret || showInventory ? "Hide all DM content" : "Show all DM content"
							}
							title={showSecret || showInventory ? "Hide all DM content" : "Show all DM content"}
						>
							{showSecret || showInventory ? (
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

			{/* NPC title bar with integrated role and location badges */}
			<div className="px-4 py-4">
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<h1
							className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1.5 tracking-tight"
							id={`npc-${getNpcId(npc)}`}
						>
							{npc.name}
						</h1>

						{/* Basic NPC Info - improved styling */}
						<div className="text-sm text-gray-600 dark:text-gray-400 mb-2.5 flex flex-wrap items-center gap-2">
							{([npc.race, npc.gender, npc.occupation] as (string | undefined)[])
								.filter(Boolean)
								.map((attribute, index, arr) => (
									<span
										// Create a stable key using both attribute and index
										key={`npc-attr-${attribute?.replace(/\s+/g, "-")}-${index}`}
										className="flex items-center"
									>
										{attribute}
										{index < arr.length - 1 && (
											<span className="mx-1.5 text-gray-400 dark:text-gray-600">•</span>
										)}
									</span>
								))}
						</div>

						{/* Role and Location badges - integrated into header */}
						<div className="flex flex-wrap gap-2 ">
							{npc.role && (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 shadow-sm">
									<span className="mr-1">👤</span> {npc.role}
								</span>
							)}
							{npc.location && Array.isArray(npc.location) && npc.location.length > 0 && (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 shadow-sm">
									<span className="mr-1">📍</span> {npc.location[0].description}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
