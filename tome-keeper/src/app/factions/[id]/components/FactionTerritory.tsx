import type { Faction } from "./types"
import { GradientCard, createCardHeader } from "@/components/GradientCard"

interface FactionTerritoryProps {
	faction: Faction
}

export function FactionTerritory({ faction }: FactionTerritoryProps) {
	if (!faction.territory) return null

	const territoryIcon = <span className="text-green-500 mr-2">🗺️</span>
	const header = createCardHeader("Territory", territoryIcon, "green")

	return (
		<GradientCard headerContent={header} colorTheme="green">
			<p className="text-gray-700 dark:text-gray-300">{faction.territory}</p>
		</GradientCard>
	)
}
