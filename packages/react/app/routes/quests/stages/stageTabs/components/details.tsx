import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Quest } from "~/lib/entities"

export default function StageDetailsTab(selectedStage: Quest["stages"][0]) {
	const { clues, incomingConsequences, location, dramatic_moments, sensory_elements, encounters } = selectedStage

	return (
		<div className="space-y-6">
			{/* Dramatic & Sensory Elements */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Dramatic Elements */}
				<InfoCard title="Dramatic Elements" icon={<Icons.Theater className="h-4 w-4 mr-2" />}>
					<List
						items={dramatic_moments}
						spacing="sm"
						textColor="default"
						icon={<Icons.Star className="h-4 w-4 mr-2 text-amber-500" />}
					/>
				</InfoCard>

				{/* Sensory Elements */}
				<InfoCard title="Sensory Elements" icon={<Icons.Eye className="h-4 w-4 mr-2" />}>
					<List
						items={sensory_elements}
						spacing="sm"
						textColor="default"
						icon={<Icons.Eye className="h-4 w-4 mr-2 text-purple-500" />}
					/>
				</InfoCard>
			</div>

			{/* Encounters */}
			{encounters && encounters.length > 0 && (
				<InfoCard title="Encounters" icon={<Icons.Swords className="h-4 w-4 mr-2" />}>
					<List
						items={encounters}
						spacing="sm"
						textColor="default"
						icon={<Icons.Target className="h-4 w-4 mr-2 text-red-500" />}
					/>
				</InfoCard>
			)}

			{/* Clues */}
			{clues && clues.length > 0 ? (
				<InfoCard title="Clues" icon={<Icons.Search className="h-4 w-4 mr-2" />}>
					<div className="space-y-4">
						{clues.map((clue, index) => (
							<div key={clue.id || index} className="space-y-2 border-b pb-2 last:border-0">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									<List
										heading="Description"
										items={clue.description}
										spacing="sm"
										textColor="default"
										icon={<Icons.FileText className="h-4 w-4 mr-2 text-blue-500" />}
									/>
									<List
										heading="Reveals"
										items={clue.reveals}
										spacing="sm"
										textColor="default"
										icon={<Icons.Lightbulb className="h-4 w-4 mr-2 text-amber-500" />}
									/>
								</div>
								<List
									heading="Discovery Condition"
									items={clue.discoveryCondition}
									spacing="sm"
									textColor="default"
									icon={<Icons.Key className="h-4 w-4 mr-2 text-green-500" />}
								/>
							</div>
						))}
					</div>
				</InfoCard>
			) : (
				<InfoCard title="Clues" icon={<Icons.Search className="h-4 w-4 mr-2" />}>
					<p className="text-sm text-muted-foreground">No clues available for this stage.</p>
				</InfoCard>
			)}

			{/* Incoming Consequences */}
			{incomingConsequences && incomingConsequences.length > 0 ? (
				<InfoCard title="Incoming Consequences" icon={<Icons.AlertTriangle className="h-4 w-4 mr-2" />}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{incomingConsequences.map((consequence, index) => (
							<div key={consequence.id || index} className="space-y-2 border p-3 rounded-md">
								<div className="flex items-center space-x-2">
									<span className="font-medium text-sm">Type:</span>
									<span className="text-sm">{consequence.consequence_type}</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="font-medium text-sm">Severity:</span>
									<span className="text-sm">{consequence.severity}</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="font-medium text-sm">Visibility:</span>
									<span className="text-sm">{consequence.visibility}</span>
								</div>
								<List
									heading="Description"
									items={consequence.description}
									spacing="sm"
									textColor="default"
									icon={<Icons.Info className="h-4 w-4 mr-2" />}
								/>
							</div>
						))}
					</div>
				</InfoCard>
			) : (
				<InfoCard title="Incoming Consequences" icon={<Icons.AlertTriangle className="h-4 w-4 mr-2" />}>
					<p className="text-sm text-muted-foreground">No incoming consequences for this stage.</p>
				</InfoCard>
			)}

			{/* Location */}
			{location && (
				<InfoCard title="Location" icon={<Icons.MapPin className="h-4 w-4 mr-2" />}>
					<div className="space-y-3">
						<div className="text-sm">
							<span className="font-medium">Name:</span> {location.name}
						</div>
						<div className="text-sm">
							<span className="font-medium">ID:</span> {location.id}
						</div>
					</div>
				</InfoCard>
			)}
		</div>
	)
}
