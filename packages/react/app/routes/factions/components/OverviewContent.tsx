import * as Icons from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Faction } from "~/lib/entities"

export function OverviewContent(faction: Faction) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
			<InfoCard
				title="Faction Goals"
				icon={<Icons.Target className="h-5 w-5 mr-2 text-purple-500" />}
				className="lg:col-span-4"
				emptyMessage={`No defined goals for ${faction.name}`}
			>
				<div className="space-y-4">
					<h3 className="text-sm font-medium flex items-center text-slate-800 dark:text-slate-200">
						<Icons.Globe className="h-4 w-4 mr-2 text-blue-500" />
						Public Goal
					</h3>
					<p className="text-slate-700 dark:text-slate-300">{faction.publicGoal}</p>

					<h3 className="text-sm font-medium flex items-center text-slate-800 dark:text-slate-200">
						<Icons.Lock className="h-4 w-4 mr-2 text-red-500" />
						Secret Goal
					</h3>
					<p className="text-slate-700 dark:text-slate-300">{faction.secretGoal}</p>
				</div>
			</InfoCard>

			<InfoCard
				title="Headquarters"
				icon={<Icons.Home className="h-5 w-5 mr-2 text-orange-500" />}
				emptyMessage={`No headquarters information for ${faction.name}`}
				className="row-span-2 col-span-2"
				contentClassName="space-y-4"
			>
				{faction.headquarters.map(({ creativePrompts, description, site, id }) => (
					<Fragment key={id}>
						<Link
							href={`/locations/${site.slug}`}
							className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-primary transition-colors flex items-center"
						>
							<Icons.MapPin className="h-4 w-4 mr-2 text-rose-500" />
							{site.name}
						</Link>
						<List items={description} className="mb-4" heading="Description" initialCollapsed={false} />
						<List items={creativePrompts} className="mb-4" heading="Creative Prompts" />
					</Fragment>
				))}
			</InfoCard>

			<InfoCard
				title="Description"
				icon={<Icons.FileText className="h-5 w-5 mr-2 text-amber-500" />}
				emptyMessage={`No description available for ${faction.name}`}
				className="lg:col-span-2"
			>
				<List items={faction.description} />
			</InfoCard>
			<InfoCard
				title="Key Notes"
				icon={<Icons.ClipboardList className="h-5 w-5 mr-2 text-amber-500" />}
				emptyMessage={`No GM notes for ${faction.name}`}
				className="lg:col-span-2"
			>
				<List items={faction.notes} />
			</InfoCard>
		</div>
	)
}
