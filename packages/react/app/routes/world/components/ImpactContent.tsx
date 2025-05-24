import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { WorldChange } from "~/lib/entities"

const AffectedList = ({
	title,
	icon,
	item,
	basePath,
}: {
	title: string
	icon: React.ReactNode
	item: { id: number; name: string; slug: string } | null
	basePath: string
}) => {
	if (!item) {
		return null
	}

	return (
		<InfoCard title={title} icon={icon} emptyMessage={`No ${title.toLowerCase()} affected.`}>
			<div className="space-y-2 p-4">
				<Link key={item.id} href={`/${basePath}/${item.slug}`} className="block text-sm text-primary hover:underline">
					{item.name}
				</Link>
			</div>
		</InfoCard>
	)
}

export function ImpactContent({ change }: { change: WorldChange }) {
	const { affectedFaction, affectedRegion, affectedArea, affectedSite, affectedNpc } = change

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<AffectedList
				title="Affected Factions"
				icon={<Icons.Flag className="h-4 w-4 mr-2 text-red-600" />}
				item={affectedFaction}
				basePath="factions"
			/>
			<AffectedList
				title="Affected Regions"
				icon={<Icons.Map className="h-4 w-4 mr-2 text-green-600" />}
				item={affectedRegion}
				basePath="regions"
			/>
			<AffectedList
				title="Affected Locations"
				icon={<Icons.MapPin className="h-4 w-4 mr-2 text-purple-600" />}
				item={affectedArea}
				basePath="locations"
			/>
			<AffectedList
				title="Affected Sites"
				icon={<Icons.MapPin className="h-4 w-4 mr-2 text-purple-600" />}
				item={affectedSite}
				basePath="sites"
			/>
			<AffectedList
				title="Affected NPCs"
				icon={<Icons.User className="h-4 w-4 mr-2 text-indigo-600" />}
				item={affectedNpc}
				basePath="npcs"
			/>
		</div>
	)
}

export { ImpactContent }
