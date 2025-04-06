import * as Icons from "lucide-react"
import { Link } from "~/components/ui/link"
import { Badge } from "~/components/ui/badge"
import { InfoCard } from "~/components/InfoCard"
import type { Faction } from "~/lib/entities"
import { List } from "~/components/List"
import { AlignmentBadge } from "~/components/alignment-badge"

const getSizeBadgeClasses = (size: string) => {
	const classes = {
		massive: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
		large: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		medium: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
		small: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
		tiny: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
	}
	return classes[size as keyof typeof classes] || classes.tiny
}

const getWealthBadgeClasses = (wealth: string) => {
	const classes = {
		wealthy: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
		rich: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
		moderate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		poor: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
		destitute: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
	}
	return classes[wealth as keyof typeof classes] || classes.poor
}

const getReachBadgeClasses = (reach: string) => {
	const classes = {
		global: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
		continental: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
		national: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		regional: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
		local: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
	}
	return classes[reach as keyof typeof classes] || classes.local
}

export function OverviewContent(faction: Faction) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<InfoCard
					title="Faction Stats"
					icon={<Icons.BarChart3 className="h-5 w-5 mr-2 text-blue-500" />}
					className="lg:col-span-1"
				>
					<div className="divide-y divide-slate-200 dark:divide-slate-700">
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
							{faction.alignment && (
								<div>
									<h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Alignment</h3>
									<AlignmentBadge alignment={faction.alignment} />
								</div>
							)}

							{faction.size && (
								<div>
									<h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Size</h3>
									<Badge className={getSizeBadgeClasses(faction.size)}>{faction.size}</Badge>
								</div>
							)}

							{faction.wealth && (
								<div>
									<h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Wealth</h3>
									<Badge className={getWealthBadgeClasses(faction.wealth)}>{faction.wealth}</Badge>
								</div>
							)}

							{faction.reach && (
								<div>
									<h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Reach</h3>
									<Badge className={getReachBadgeClasses(faction.reach)}>{faction.reach}</Badge>
								</div>
							)}

							{faction.type && (
								<div className="col-span-2">
									<h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</h3>
									<p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">{faction.type}</p>
								</div>
							)}
						</div>
					</div>
				</InfoCard>

				<InfoCard
					title="Faction Goals"
					icon={<Icons.Target className="h-5 w-5 mr-2 text-purple-500" />}
					className="lg:col-span-2"
					emptyMessage={`No defined goals for ${faction.name}`}
				>
					<div className="p-5 space-y-4">
						{faction.publicGoal && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium flex items-center text-slate-800 dark:text-slate-200">
									<Icons.Globe className="h-4 w-4 mr-2 text-blue-500" />
									Public Goal
								</h3>
								<div className="pl-6">
									<p className="text-slate-700 dark:text-slate-300">{faction.publicGoal}</p>
								</div>
							</div>
						)}

						{faction.secretGoal && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium flex items-center text-slate-800 dark:text-slate-200">
									<Icons.Lock className="h-4 w-4 mr-2 text-red-500" />
									Secret Goal
								</h3>
								<div className="pl-6 border-l-2 border-red-200 dark:border-red-900">
									<p className="text-slate-700 dark:text-slate-300">{faction.secretGoal}</p>
								</div>
							</div>
						)}
					</div>
				</InfoCard>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* <InfoCard
          title="Headquarters"
          icon={<Icons.Home className="h-5 w-5 mr-2 text-orange-500" />}
          emptyMessage={`No headquarters information for ${faction.name}`}
        >
          {faction.headquarters && faction.headquarters.length > 0 && (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {faction.headquarters.map((hq) => (
                <div key={hq.id} className="p-5">
                  {hq.location && (
                    <div className="mb-4">
                      <Link 
                        href={`/locations/${hq.location.slug}`} 
                        className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-primary transition-colors flex items-center"
                      >
                        <Icons.MapPin className="h-4 w-4 mr-2 text-rose-500" />
                        {hq.location.name}
                      </Link>
                    </div>
                  )}
                  
                  {hq.description && hq.description.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {hq.description.map((desc, i) => (
                        <p key={i} className="text-slate-700 dark:text-slate-300">
                          {desc}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {hq.creativePrompts && hq.creativePrompts.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 italic">Adventure Hooks:</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {hq.creativePrompts.map((prompt, i) => (
                          <li key={i}>{prompt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </InfoCard> */}

				<InfoCard
					title="Description"
					icon={<Icons.FileText className="h-5 w-5 mr-2 text-amber-500" />}
					emptyMessage={`No description available for ${faction.name}`}
				>
					<List items={faction.description} />
				</InfoCard>
				<InfoCard
					title="Key Notes"
					icon={<Icons.ClipboardList className="h-5 w-5 mr-2 text-amber-500" />}
					emptyMessage={`No GM notes for ${faction.name}`}
				>
					<ul className="space-y-3">
						{faction.notes.map((note) => (
							<li key={note} className="flex items-start gap-3">
								<div className="flex-shrink-0 mt-1">
									<div className="h-2 w-2 rounded-full bg-amber-500" />
								</div>
								<span className="text-slate-700 dark:text-slate-300">{note}</span>
							</li>
						))}
					</ul>
				</InfoCard>
			</div>
		</div>
	)
}
