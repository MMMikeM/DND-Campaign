import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { Foreshadowing } from "~/lib/entities"

interface ConnectionsContentProps {
	item: Foreshadowing
}

const ConnectionLink = ({
	label,
	icon,
	href,
	name,
}: {
	label: string
	icon: React.ReactNode
	href?: string | null
	name?: string | null
}) => {
	if (!href || !name) return null
	return (
		<div className="flex items-center space-x-2">
			{icon}
			<span className="font-medium text-sm">{label}:</span>
			<Link href={href} className="text-primary hover:underline text-sm">
				{name}
			</Link>
		</div>
	)
}

export function ConnectionsContent({ item }: ConnectionsContentProps) {
	const { sourceStage, sourceNpc, sourceFaction, targetQuest, targetTwist, targetNpc, targetArc } = item

	const source = sourceStage
		? {
				type: "Quest Stage",
				href: `/quests/${sourceStage.quest?.slug}/stages/${sourceStage.slug}`,
				name: `${sourceStage.quest?.name} - ${sourceStage.name}`,
				icon: <Icons.Milestone className="h-4 w-4 text-gray-500" />,
			}
		: sourceNpc
			? {
					type: "NPC",
					href: `/npcs/${sourceNpc.slug}`,
					name: sourceNpc.name,
					icon: <Icons.User className="h-4 w-4 text-gray-500" />,
				}
			: sourceFaction
				? {
						type: "Faction",
						href: `/factions/${sourceFaction.slug}`,
						name: sourceFaction.name,
						icon: <Icons.Flag className="h-4 w-4 text-gray-500" />,
					}
				: null

	const target = targetQuest
		? {
				type: "Quest",
				href: `/quests/${targetQuest.slug}`,
				name: targetQuest.name,
				icon: <Icons.Scroll className="h-4 w-4 text-gray-500" />,
			}
		: targetTwist // Assuming targetTwist might not have a direct linkable page or name
			? {
					type: "Quest Twist",
					href: null,
					name: `Twist ID: ${targetTwist.id} (${targetTwist.twist_type})`,
					icon: <Icons.GitBranch className="h-4 w-4 text-gray-500" />,
				}
			: targetNpc
				? {
						type: "NPC",
						href: `/npcs/${targetNpc.slug}`,
						name: targetNpc.name,
						icon: <Icons.User className="h-4 w-4 text-gray-500" />,
					}
				: targetArc
					? {
							type: "Narrative Arc",
							href: `/narrative/${targetArc.slug}`,
							name: targetArc.name,
							icon: <Icons.Workflow className="h-4 w-4 text-gray-500" />,
						}
					: null

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Source"
				icon={<Icons.LocateFixed className="h-4 w-4 mr-2 text-blue-600" />}
				emptyMessage="Source of foreshadowing not specified."
			>
				{source ? (
					<div className="p-4 space-y-2">
						<div className="flex items-center space-x-2">
							{source.icon}
							<span className="font-medium text-sm">{source.type}:</span>
							{source.href ? (
								<Link href={source.href} className="text-primary hover:underline text-sm">
									{source.name}
								</Link>
							) : (
								<span className="text-muted-foreground text-sm">{source.name}</span>
							)}
						</div>
					</div>
				) : null}
			</InfoCard>

			<InfoCard
				title="Target"
				icon={<Icons.Crosshair className="h-4 w-4 mr-2 text-red-600" />}
				emptyMessage="Target of foreshadowing not specified."
			>
				{target ? (
					<div className="p-4 space-y-2">
						<div className="flex items-center space-x-2">
							{target.icon}
							<span className="font-medium text-sm">{target.type}:</span>
							{target.href ? (
								<Link href={target.href} className="text-primary hover:underline text-sm">
									{target.name}
								</Link>
							) : (
								<span className="text-muted-foreground text-sm">{target.name}</span>
							)}
						</div>
					</div>
				) : null}
			</InfoCard>
		</div>
	)
}

export default ConnectionsContent
