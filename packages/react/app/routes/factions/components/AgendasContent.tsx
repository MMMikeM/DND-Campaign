import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Badge } from "~/components/ui/badge"
import type { Faction } from "~/lib/entities"

export function AgendasContent({ agendas }: Faction) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{agendas.map((agenda) => (
				<InfoCard
					key={`agenda-${agenda.id}`}
					title={agenda.name}
					icon={<Icons.Briefcase className="h-5 w-5 mr-2 text-blue-500" />}
				>
					<div className="flex flex-wrap gap-2 mb-4">
						<Badge variant="outline" className="flex items-center gap-1">
							<Icons.Target className="h-3 w-3" />
							{agenda.agendaType}
						</Badge>

						<Badge variant="outline">{agenda.currentStage}</Badge>

						<Badge
							variant={
								agenda.importance === "high" ? "destructive" : agenda.importance === "medium" ? "default" : "secondary"
							}
						>
							{agenda.importance}
						</Badge>

						<Badge variant="outline">{agenda.ultimateAim}</Badge>
					</div>

					<List items={agenda.description} listStyle="none" spacing="md" />

					<div className="mb-4">
						<h4 className="text-sm font-medium mb-2 flex items-center">
							<Icons.CheckCircle className="h-4 w-4 mr-1 text-green-500" />
							Objectives
						</h4>
						<List items={agenda.storyHooks} spacing="sm" />
					</div>

					<List items={agenda.creativePrompts} spacing="sm" textColor="muted" textSize="sm" />
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
