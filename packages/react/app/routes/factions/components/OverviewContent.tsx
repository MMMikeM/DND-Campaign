import * as Icons from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Faction } from "~/lib/entities"

export function OverviewContent({
	name,
	publicGoal,
	secretGoal,
	primaryHqSite,
	description,
	gmNotes,
	history,
	publicPerception,
}: Pick<
	Faction,
	"name" | "publicGoal" | "secretGoal" | "primaryHqSite" | "description" | "gmNotes" | "history" | "publicPerception"
>) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
			<InfoCard
				title="Faction Goals"
				icon={<Icons.Target className="h-5 w-5 mr-2 text-purple-500" />}
				className="lg:col-span-4"
				emptyMessage={`No defined goals for ${name}`}
			>
				<div className="space-y-4">
					<h3 className="text-sm font-medium flex items-center text-slate-800 dark:text-slate-200">
						<Icons.Globe className="h-4 w-4 mr-2 text-blue-500" />
						Public Goal
					</h3>
					<p className="text-slate-700 dark:text-slate-300">{publicGoal}</p>

					<h3 className="text-sm font-medium flex items-center text-slate-800 dark:text-slate-200">
						<Icons.Lock className="h-4 w-4 mr-2 text-red-500" />
						Secret Goal
					</h3>
					<p className="text-slate-700 dark:text-slate-300">{secretGoal}</p>
				</div>
			</InfoCard>

			<InfoCard
				title="Headquarters"
				icon={<Icons.Home className="h-5 w-5 mr-2 text-orange-500" />}
				emptyMessage={`No headquarters information for ${name}`}
				className="row-span-2 col-span-2"
				contentClassName="space-y-4"
			>
				{primaryHqSite && (
					<Fragment key={primaryHqSite.id}>
						<Link
							href={`/locations/${primaryHqSite.slug}`}
							className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-primary transition-colors flex items-center"
						>
							<Icons.MapPin className="h-4 w-4 mr-2 text-rose-500" />
							{primaryHqSite.name}
						</Link>
						<List items={primaryHqSite.description} className="mb-4" heading="Description" initialCollapsed={false} />
						<List items={primaryHqSite.creativePrompts} className="mb-4" heading="Creative Prompts" />
					</Fragment>
				)}
			</InfoCard>

			<InfoCard
				title="Description"
				icon={<Icons.FileText className="h-5 w-5 mr-2 text-amber-500" />}
				emptyMessage={`No description available for ${name}`}
				className="lg:col-span-2"
			>
				<List items={description} />
			</InfoCard>
			<InfoCard
				title="Key Notes"
				icon={<Icons.ClipboardList className="h-5 w-5 mr-2 text-amber-500" />}
				emptyMessage={`No GM notes for ${name}`}
				className="lg:col-span-2"
			>
				<List items={gmNotes} />
			</InfoCard>
			<InfoCard
				title="History"
				icon={<Icons.Scroll className="h-5 w-5 mr-2 text-amber-500" />}
				emptyMessage={`No history available for ${name}`}
				className="lg:col-span-3"
			>
				<List items={history} />
			</InfoCard>
			<InfoCard
				title="Public Perception"
				icon={<Icons.Eye className="h-5 w-5 mr-2 text-blue-500" />}
				emptyMessage={`No public perception available for ${name}`}
				className="lg:col-span-3"
			>
				<p className="text-slate-700 dark:text-slate-300">{publicPerception}</p>
			</InfoCard>
		</div>
	)
}
