import type { ChangeEvent } from "react"
import { idToName } from "@/server/utils/contentUtils"
import type { Faction } from "./types"
import { getFactionTypeStyle } from "./utils"
import { EyeIcon } from "@/app/npcs/[id]/components/icons"
import { EyeSlashIcon } from "@/app/npcs/[id]/components/icons"
import { Chip } from "@/components/Chip"

interface FactionHeaderProps {
	factionId: string
	factionIds: string[]
	faction: Faction
	handleFactionChange: (e: ChangeEvent<HTMLSelectElement>) => void
	showDMContent?: {
		showTrueGoal: boolean
		showTrueLeader: boolean
		showSecrets: boolean
	}
	toggleAllDMContent?: () => void
}

export function FactionHeader({
	factionId,
	factionIds,
	faction,
	handleFactionChange,
	showDMContent,
	toggleAllDMContent,
}: FactionHeaderProps) {
	const typeStyle = getFactionTypeStyle(faction.type ?? "default")

	// Calculate if any DM content is showing
	const isDMContentVisible =
		showDMContent &&
		(showDMContent.showTrueGoal || showDMContent.showTrueLeader || showDMContent.showSecrets)

	return (
		<header className="relative">
			{/* Faction selector */}
			<div className="p-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center">
				<div className="flex-1 flex items-center gap-2 max-w-4xl">
					<label
						htmlFor="npc-select"
						className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
					>
						Faction:
					</label>
					<div className="relative flex-1">
						<select
							id="npc-select"
							value={factionId}
							onChange={handleFactionChange}
							className="w-full py-1.5 px-3 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
						>
							{factionIds.map((id) => (
								<option key={id} value={id}>
									{idToName(id)}
								</option>
							))}
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
					<button
						type="button"
						onClick={toggleAllDMContent}
						className={`flex items-center justify-center h-8 w-8 text-sm font-medium rounded-md transition-all duration-200 ${
							isDMContentVisible
								? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
								: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
						}`}
						aria-label={isDMContentVisible ? "Hide all DM content" : "Show all DM content"}
						title={isDMContentVisible ? "Hide all DM content" : "Show all DM content"}
					>
						{isDMContentVisible ? (
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
				</div>
			</div>

			{/* Improved faction title bar with badge */}
			<div className="p-6 pb-4">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
					{idToName(factionId)}
				</h1>

				<div className="flex flex-wrap items-center gap-2">
					{faction.type && (
						<Chip
							color={typeStyle.chipColor}
							icon={<span>{typeStyle.icon}</span>}
							size="md"
							withBorder
							animate
						>
							{faction.type}
						</Chip>
					)}

					{/* DM Content toggle button */}
					{toggleAllDMContent && (
						<Chip
							color={isDMContentVisible ? "green" : "gray"}
							icon={<span>{isDMContentVisible ? "🔓" : "🔒"}</span>}
							size="md"
							withBorder
							animate
							onClick={toggleAllDMContent}
						>
							{isDMContentVisible ? "Hide DM Content" : "Show DM Content"}
						</Chip>
					)}
				</div>
			</div>
		</header>
	)
}
