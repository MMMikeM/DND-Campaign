import * as Icons from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { List } from "~/components/List"
import { InfoCard } from "~/components/InfoCard"
import type { Faction } from "~/lib/entities"

interface OperationsContentProps {
	operations?: Faction["operations"]
}

export function OperationsContent({ operations }: OperationsContentProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{operations && operations.length > 0 ? (
				operations.map((operation) => (
					<InfoCard
						key={`operation-${operation.id}`}
						title={operation.name}
						icon={<Icons.Briefcase className="h-5 w-5 mr-2 text-blue-500" />}
					>
						<div className="flex flex-wrap gap-2 mb-4">
							<Badge variant="outline" className="flex items-center gap-1">
								<Icons.Target className="h-3 w-3" />
								{operation.type}
							</Badge>

							{operation.scale && <Badge variant="outline">{operation.scale} scale</Badge>}

							<Badge
								variant={
									operation.priority === "high"
										? "destructive"
										: operation.priority === "medium"
											? "default"
											: "secondary"
								}
							>
								{operation.priority}
							</Badge>

							<Badge variant="outline">{operation.status}</Badge>
						</div>

						{operation.description && operation.description.length > 0 && (
							<div className="mb-4">
								<List items={operation.description} listStyle="none" spacing="md" />
							</div>
						)}

						{operation.objectives && operation.objectives.length > 0 && (
							<div className="mb-4">
								<h4 className="text-sm font-medium mb-2 flex items-center">
									<Icons.CheckCircle className="h-4 w-4 mr-1 text-green-500" />
									Objectives
								</h4>
								<List items={operation.objectives} position="inside" spacing="sm" />
							</div>
						)}

						{operation.creativePrompts && operation.creativePrompts.length > 0 && (
							<div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
								<h4 className="text-sm font-medium mb-2 flex items-center text-slate-600 dark:text-slate-400">
									<Icons.Sparkles className="h-4 w-4 mr-1" />
									Story Hooks
								</h4>
								<List
									items={operation.creativePrompts}
									listStyle="disc"
									position="inside"
									spacing="sm"
									textColor="muted"
									textSize="sm"
								/>
							</div>
						)}
					</InfoCard>
				))
			) : (
				<div className="col-span-full py-12 text-center border rounded-lg bg-slate-50 dark:bg-slate-900">
					<Icons.AlertCircle className="h-10 w-10 mx-auto text-slate-400 mb-3" />
					<p className="text-muted-foreground">No active operations for this faction.</p>
				</div>
			)}
		</div>
	)
}
