import { nameToId } from "@/server/utils/contentUtils"
import type { QuestLocationProps } from "./types"
import Link from "next/link"

export default function QuestLocation({ quest }: QuestLocationProps) {
	if (!quest.location) return null

	return (
		<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800/30 shadow-sm">
			<div className="flex items-center mb-2">
				<span className="text-emerald-500 mr-2">📍</span>
				<h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
					Location
				</h3>
			</div>
			<Link
				href={`/locations/${nameToId(quest.location)}`}
				className="text-gray-800 dark:text-gray-200 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors bg-transparent border-none p-0 text-left w-full inline-block"
			>
				{quest.location}
			</Link>
		</div>
	)
}
