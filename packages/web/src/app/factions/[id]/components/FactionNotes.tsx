import type { Faction } from "./types"
import { GradientCard, createCardHeader } from "@/components/GradientCard"

interface FactionNotesProps {
	faction: Faction
}

export function FactionNotes({ faction }: FactionNotesProps) {
	if (!faction.notes) return null

	const notesIcon = <span className="text-amber-500 mr-2">📝</span>
	const header = createCardHeader("Notes", notesIcon, "amber")

	return (
		<GradientCard headerContent={header} colorTheme="amber">
			<div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
				{faction.notes}
			</div>
		</GradientCard>
	)
}
