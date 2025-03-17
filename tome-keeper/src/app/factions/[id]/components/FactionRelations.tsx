import type { Faction } from "./types"
import { GradientCard, createCardHeader } from "@/components/GradientCard"

interface FactionRelationsProps {
	faction: Faction
}

export function FactionRelations({ faction }: FactionRelationsProps) {
	const allies = faction.allies
	const enemies = faction.enemies

	if ((!allies || allies.length === 0) && (!enemies || enemies.length === 0)) return null

	const alliesIcon = <span className="text-green-500">🤝</span>
	const enemiesIcon = <span className="text-red-500">⚔️</span>

	const alliesHeader = createCardHeader("Allies", alliesIcon, "green")
	const enemiesHeader = createCardHeader("Enemies", enemiesIcon, "red")

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{/* Allies */}
			{allies && allies.length > 0 && (
				<GradientCard headerContent={alliesHeader} colorTheme="green">
					<ul className="space-y-2 dark:text-gray-300">
						{allies.map((ally) => (
							<li key={`ally-${ally}`} className="flex items-start">
								<span className="text-green-400 mr-2 mt-1">•</span>
								<span>{ally}</span>
							</li>
						))}
					</ul>
				</GradientCard>
			)}

			{/* Enemies */}
			{enemies && enemies.length > 0 && (
				<GradientCard headerContent={enemiesHeader} colorTheme="red">
					<ul className="space-y-2 dark:text-gray-300">
						{enemies.map((enemy) => (
							<li key={`enemy-${enemy}`} className="flex items-start">
								<span className="text-red-400 mr-2 mt-1">•</span>
								<span>{enemy}</span>
							</li>
						))}
					</ul>
				</GradientCard>
			)}
		</div>
	)
}
