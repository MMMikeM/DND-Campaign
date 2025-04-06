import * as Icons from "lucide-react"
import { Link } from "~/components/Link"
import { InfoCard } from "~/components/InfoCard"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"
import { Fragment } from "react/jsx-runtime"

export function InfluenceContent(faction: Faction) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<RegionInfluenceCard faction={faction} />
				<FactionRelationsCard faction={faction} />
			</div>
			<FactionInfluenceInfo faction={faction} />
		</div>
	)
}

const InfluenceTitle = ({ item }: { item: Faction["influence"][number] }) => {
	const dataToDisplay: { href: string; name: string; icon: React.ReactNode } = {
		href: "",
		name: "",
		icon: null,
	}

	if (item.location) {
		dataToDisplay.href = `/locations/${item.location.slug}`
		dataToDisplay.name = item.location.name
		dataToDisplay.icon = <Icons.MapPin className="h-4 w-4 mr-1 text-red-400" />
	}
	if (item.region) {
		dataToDisplay.href = `/regions/${item.region.slug}`
		dataToDisplay.name = item.region.name
		dataToDisplay.icon = <Icons.Map className="h-4 w-4 mr-1 text-blue-400" />
	}
	if (item.quest) {
		dataToDisplay.href = `/quests/${item.quest.slug}`
		dataToDisplay.name = item.quest.name
		dataToDisplay.icon = <Icons.Scroll className="h-4 w-4 mr-1 text-orange-400" />
	}

	const { href, icon, name } = dataToDisplay

	if (!href || !icon || !name) {
		return null
	}

	return (
		<Link href={href} className="flex flex-wrap gap-2 items-center justify-start">
			{icon}
			<h4 className="text-lg font-semibold">{name}</h4>
		</Link>
	)
}

function FactionInfluenceInfo({ faction }: { faction: Faction }) {
	return (
		<InfoCard
			title={`${faction.name}'s Sphere of Influence`}
			icon={<Icons.Globe className="h-5 w-5 mr-2 text-primary" />}
			emptyMessage={`No influence information available for ${faction.name}`}
		>
			{faction.influence && faction.influence.length > 0 && (
				<div className="grid gap-6 md:grid-cols-2">
					{faction.influence.map((item) => (
						<div key={item.id} className="overflow-hidden border rounded-lg">
							<div className="p-4 ">
								<div className="flex items-center justify-between mb-3">
									<InfluenceTitle item={item} />
									<BadgeWithTooltip variant="default" tooltipContent="Influence Level">
										{item.powerLevel}
									</BadgeWithTooltip>
								</div>

								<div className="space-y-3 mb-4">
									<List items={item.description} className="text-sm" />
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</InfoCard>
	)
}

function RegionInfluenceCard({ faction }: { faction: Faction }) {
	return (
		<InfoCard
			title="Regional Impact"
			icon={<Icons.Map className="h-5 w-5 mr-2 text-green-500" />}
			emptyMessage={`No regional impact data for ${faction.name}`}
		>
			{faction.relatedRegions.map((regionData) => (
				<Fragment key={regionData.id}>
					<div className="flex items-center justify-between mb-2">
						{regionData.region && (
							<Link
								href={`/regions/${regionData.region.slug}`}
								className="font-medium text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
							>
								{regionData.region.name}
							</Link>
						)}
						{regionData.controlLevel && (
							<BadgeWithTooltip
								variant="default"
								tooltipContent="Control Level"
								className={`
                    ${
											regionData.controlLevel === "contested"
												? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
												: regionData.controlLevel === "influenced"
													? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
													: regionData.controlLevel === "controlled"
														? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
														: regionData.controlLevel === "dominated"
															? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
															: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
										}`}
							>
								{regionData.controlLevel}
							</BadgeWithTooltip>
						)}
					</div>

					{regionData.presence && regionData.presence.length > 0 && (
						<div className="mb-3">
							<p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Presence:</p>
							<List items={regionData.presence} className="text-sm" />
						</div>
					)}

					{regionData.priorities && regionData.priorities.length > 0 && (
						<div>
							<p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Regional Priorities:</p>
							<List items={regionData.priorities} className="text-sm" />
						</div>
					)}
				</Fragment>
			))}
		</InfoCard>
	)
}

function FactionRelationsCard({ faction }: { faction: Faction }) {
	return (
		<InfoCard
			title="Relations"
			icon={<Icons.Network className="h-5 w-5 mr-2" />}
			emptyMessage="No relations with other factions established."
		>
			{faction.outgoingRelationships && faction.outgoingRelationships.length > 0 ? (
				<div className="space-y-4 p-4">
					{faction.outgoingRelationships.map((relation) => (
						<div key={`relation-${relation.id}`} className="border rounded p-3">
							<div className="flex justify-between">
								<h4 className="font-medium">
									{relation.targetFaction && (
										<Link href={`/factions/${relation.targetFaction.slug}`} className="hover:text-indigo-500">
											{relation.targetFaction.name}
										</Link>
									)}
								</h4>
								<BadgeWithTooltip
									variant={
										relation.diplomaticStatus === "ally" ? "default" : relation.diplomaticStatus === "enemy" ? "destructive" : "secondary"
									}
									tooltipContent="Political standing between factions"
								>
									{relation.diplomaticStatus} ({relation.strength})
								</BadgeWithTooltip>
							</div>

							{relation.description && relation.description.length > 0 && (
								<div className="mt-2">
									<List items={relation.description} />
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="py-8 text-center">
					<Icons.AlertCircle className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
					<p className="text-muted-foreground">No relations with other factions established.</p>
				</div>
			)}
		</InfoCard>
	)
}
