import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/Link"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"

export function InfluenceContent({ relations, territorialControl }: Faction) {
	return (
		<div className="space-y-6">
			<FactionRelationsCard relations={relations} />
			<FactionterritorialControlInfo territorialControl={territorialControl} />
		</div>
	)
}

type territorialControlItem = {
	name: string
	id: number
	slug: string
}

const TerritorialControlTitle = ({
	site,
	area,
	region,
}: {
	site: territorialControlItem | null
	area: territorialControlItem | null
	region: territorialControlItem | null
}) => {
	const dataToDisplay: { href: string; name: string; icon: React.ReactNode } = {
		href: "",
		name: "",
		icon: null,
	}

	if (site) {
		dataToDisplay.href = `/sites/${site.slug}`
		dataToDisplay.name = site.name
		dataToDisplay.icon = <Icons.MapPin className="h-4 w-4 mr-1 text-red-400" />
	}
	if (area) {
		dataToDisplay.href = `/areas/${area.slug}`
		dataToDisplay.name = area.name
		dataToDisplay.icon = <Icons.MapPin className="h-4 w-4 mr-1 text-violet-400" />
	}
	if (region) {
		dataToDisplay.href = `/regions/${region.slug}`
		dataToDisplay.name = region.name
		dataToDisplay.icon = <Icons.Map className="h-4 w-4 mr-1 text-blue-400" />
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

function FactionterritorialControlInfo({ territorialControl }: { territorialControl: Faction["territorialControl"] }) {
	return (
		<InfoCard
			title={`Sphere of territorialControl`}
			icon={<Icons.Globe className="h-5 w-5 mr-2 text-primary" />}
			emptyMessage={`No territorialControl information available`}
		>
			{territorialControl.map(
				({ id, area, creativePrompts, description, influenceLevel, presence, priorities, region, site }) => (
					<div key={id} className="overflow-hidden border-b">
						<div className="p-4 ">
							<div className="flex items-center justify-between mb-3">
								<TerritorialControlTitle site={site} area={area} region={region} />
								<BadgeWithTooltip variant="default" tooltipContent="territorialControl Level">
									{influenceLevel}
								</BadgeWithTooltip>
							</div>

							<div className="space-y-3 mb-4">
								<List items={presence} className="text-sm" maxItems={2} heading="Presence" />
								<List items={priorities} className="text-sm" maxItems={2} heading="Priorities" />
								<List items={description} className="text-sm" maxItems={2} heading="Description" />
								<List items={creativePrompts} className="text-sm" maxItems={2} heading="Creative Prompts" />
							</div>
						</div>
					</div>
				),
			)}
		</InfoCard>
	)
}

function FactionRelationsCard({ relations }: { relations: Faction["relations"] }) {
	return (
		<InfoCard
			title="Relations"
			icon={<Icons.Network className="h-5 w-5 mr-2" />}
			emptyMessage="No relations with other factions established."
		>
			{relations && relations.length > 0 ? (
				<div className="space-y-4 p-4">
					{relations.map(({ creativePrompts, description, diplomaticStatus, faction, id, strength }) => (
						<div key={`relation-${id}`} className="border-b border-slate-200 pb-4">
							<div className="flex justify-between">
								<h4 className="font-medium">
									{faction && (
										<Link href={`/factions/${faction.slug}`} className="hover:text-indigo-500">
											{faction.name}
										</Link>
									)}
								</h4>
								<BadgeWithTooltip
									variant={
										diplomaticStatus === "ally" ? "default" : diplomaticStatus === "enemy" ? "destructive" : "secondary"
									}
									tooltipContent="Political standing between factions"
								>
									{diplomaticStatus} ({strength})
								</BadgeWithTooltip>
							</div>

							<List items={description} heading="Description" maxItems={2} />
							<List items={creativePrompts} heading="Creative Prompts" maxItems={2} />
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
