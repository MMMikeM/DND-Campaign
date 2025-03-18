import type { Faction } from "./types"
import { GradientCard, createCardHeader } from "@/components/GradientCard"

interface FactionMembersProps {
	faction: Faction
}

export function FactionMembers({ faction }: FactionMembersProps) {
	if (!faction.members || faction.members.length === 0) return null

	const membersIcon = <span className="text-gray-500 mr-2">👥</span>
	const header = createCardHeader("Members", membersIcon, "gray")

	return (
		<GradientCard headerContent={header} colorTheme="gray">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{faction.members.map((member) => (
					<div
						key={`member-${member.name}`}
						className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md border border-gray-200 dark:border-gray-700"
					>
						<h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
							<span className="mr-1">👤</span>
							{member.name}
						</h3>
						{member.description && (
							<p className="text-gray-700 dark:text-gray-300 mt-1">{member.description}</p>
						)}
					</div>
				))}
			</div>
		</GradientCard>
	)
}
