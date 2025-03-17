import type { Faction } from "./types"
import { GradientCard, createCardHeader } from "@/components/GradientCard"

interface FactionDescriptionProps {
	faction: Faction
}

export function FactionDescription({ faction }: FactionDescriptionProps) {
	if (!faction.description) return null

	const descriptionIcon = <span className="text-gray-500 mr-2">📝</span>
	const header = createCardHeader("Description", descriptionIcon, "gray")

	return (
		<div className="mb-6">
			<GradientCard headerContent={header} colorTheme="gray">
				<p className="text-gray-700 dark:text-gray-300">{faction.description}</p>
			</GradientCard>
		</div>
	)
}
