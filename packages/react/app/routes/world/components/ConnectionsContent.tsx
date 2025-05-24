import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { WorldChange } from "~/lib/entities"

interface ConnectionsContentProps {
	change: WorldChange
}

export function ConnectionsContent({ change }: ConnectionsContentProps) {
	const { sourceQuest, sourceDecision, sourceConflict, leadsToQuest, sourceType } = change

	let sourceLink = null
	if (sourceType === "quest" && sourceQuest) {
		sourceLink = {
			href: `/quests/${sourceQuest.slug}`,
			name: sourceQuest.name,
			icon: <Icons.Scroll className="h-4 w-4 text-gray-500" />,
		}
	} else if (sourceType === "conflict" && sourceConflict) {
		sourceLink = {
			href: `/conflicts/${sourceConflict.slug}`,
			name: sourceConflict.name,
			icon: <Icons.Swords className="h-4 w-4 text-gray-500" />,
		}
	} else if (sourceType === "decision" && sourceDecision) {
		sourceLink = {
			href: null,
			name: `Decision ID: ${sourceDecision.id}`,
			icon: <Icons.GitBranch className="h-4 w-4 text-gray-500" />,
		}
	} else if (sourceType) {
		sourceLink = {
			href: null,
			name: `Type: ${sourceType}`,
			icon: <Icons.HelpCircle className="h-4 w-4 text-gray-500" />,
		}
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Source of Change"
				icon={<Icons.LocateFixed className="h-4 w-4 mr-2 text-blue-600" />}
				emptyMessage="Source of this change not specified."
			>
				{sourceLink ? (
					<div className="p-4 space-y-2">
						<div className="flex items-center space-x-2">
							{sourceLink.icon}
							<span className="font-medium text-sm capitalize">{sourceType}:</span>
							{sourceLink.href ? (
								<Link href={sourceLink.href} className="text-primary hover:underline text-sm">
									{sourceLink.name}
								</Link>
							) : (
								<span className="text-muted-foreground text-sm">{sourceLink.name}</span>
							)}
						</div>
					</div>
				) : null}
			</InfoCard>

			<InfoCard
				title="Leads To Quest"
				icon={<Icons.ArrowRight className="h-4 w-4 mr-2 text-green-600" />}
				emptyMessage="This change does not directly lead to a specific quest."
			>
				{leadsToQuest ? (
					<div className="p-4 space-y-2">
						<div className="flex items-center space-x-2">
							<Icons.Scroll className="h-4 w-4 text-gray-500" />
							<Link href={`/quests/${leadsToQuest.slug}`} className="text-primary hover:underline text-sm">
								{leadsToQuest.name}
							</Link>
						</div>
					</div>
				) : null}
			</InfoCard>
		</div>
	)
}

export default ConnectionsContent
