import type { Faction } from "./types"

interface FactionMembersProps {
	faction: Faction
}

export function FactionMembers({ faction }: FactionMembersProps) {
	if (!faction.members || faction.members.length === 0) return null

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
			<div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
				<span className="text-gray-500 mr-2">👥</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Members
				</h2>
			</div>
			<div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
							<p className="text-gray-700 dark:text-gray-300 mt-1">
								{member.description}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
