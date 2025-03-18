import type { Faction } from "./types"
import Link from "next/link"
import { GradientCard, createCardHeader } from "@/components/GradientCard"

interface FactionQuestsProps {
	faction: Faction
}

export function FactionQuests({ faction }: FactionQuestsProps) {
	if (!faction.quests || faction.quests.length === 0) return null

	const questsIcon = <span className="text-indigo-500 mr-2">📜</span>
	const header = createCardHeader("Quests", questsIcon, "cyan")

	return (
		<GradientCard headerContent={header} colorTheme="cyan">
			<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
				{faction.quests.map((quest) => (
					<li key={`quest-${quest}`} className="relative">
						<Link
							href={`/quests/${quest}`}
							className="w-full text-left p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 transition-colors flex items-center text-indigo-700 dark:text-indigo-300"
						>
							<span className="mr-2">📋</span>
							{quest}
						</Link>
					</li>
				))}
			</ul>
		</GradientCard>
	)
}
