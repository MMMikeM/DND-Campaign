import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"

export function AgendasContent({ agendas }: Pick<Faction, "agendas">) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{agendas.map((agenda) => (
				<InfoCard
					key={`agenda-${agenda.id}`}
					title={agenda.name}
					icon={<Icons.Briefcase className="h-5 w-5 mr-2 text-blue-500" />}
				>
					<div className="flex flex-wrap gap-2 mb-4">
						<BadgeWithTooltip tooltipContent={"Type of agenda"}>
							<Icons.Target className="h-3 w-3" />
							{agenda.agendaType}
						</BadgeWithTooltip>

						<BadgeWithTooltip tooltipContent={"Current stage of agenda"}>
							<Icons.Target className="h-3 w-3" />
							{agenda.currentStage}
						</BadgeWithTooltip>

						<BadgeWithTooltip tooltipContent={"Importance of agenda"}>
							<Icons.Target className="h-3 w-3" />
							{agenda.importance}
						</BadgeWithTooltip>
					</div>

					<p>Objective: {agenda.ultimateAim}</p>
					<List
						icon={<Icons.Info className="h-4 w-4 mr-2" />}
						heading="Description"
						items={agenda.description}
						initialCollapsed={true}
					/>

					<List
						icon={<Icons.Info className="h-4 w-4 mr-2" />}
						heading="Story Hooks"
						items={agenda.storyHooks}
						initialCollapsed={true}
					/>
				</InfoCard>
			)) ?? (
				<div className="col-span-full py-12 text-center border rounded-lg bg-slate-50 dark:bg-slate-900">
					<Icons.AlertCircle className="h-10 w-10 mx-auto text-slate-400 mb-3" />
					<p className="text-muted-foreground">No active agendas for this faction.</p>
				</div>
			)}
		</div>
	)
}
