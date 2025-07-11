import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

export function DetailsContent({ details }: Pick<NPC, "details">) {
	if (!details) {
		return <div className="text-center py-8 text-muted-foreground">No details available for this NPC.</div>
	}

	const {
		adaptability,
		availability,
		biases,
		capability,
		complexity,
		goalsAndFears,
		knowledge,
		proactivity,
		relatability,
		rumours,
		alignment,
		avoidTopics,
		preferredTopics,
		secretsAndHistory,
		wealth,
	} = details

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<InfoCard
					title="Goals & Fears"
					icon={<Icons.Target className="h-4 w-4 mr-2 text-indigo-600" />}
					emptyMessage="No goals and fears specified."
				>
					<List items={goalsAndFears} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Biases"
					icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No biases specified."
				>
					<List items={biases} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<InfoCard
				title="Character Profile"
				icon={<Icons.UserSquare className="h-4 w-4 mr-2 text-cyan-600" />}
				contentClassName="grid grid-cols-2 md:grid-cols-3 gap-4"
				className="mb-6"
			>
				<div>
					<h4 className="font-medium mb-1">Alignment</h4>
					<p className="text-muted-foreground capitalize">{alignment}</p>
				</div>
				<div>
					<h4 className="font-medium mb-1">Wealth</h4>
					<p className="text-muted-foreground capitalize">{wealth}</p>
				</div>
				<div>
					<h4 className="font-medium mb-1">Availability</h4>
					<p className="text-muted-foreground capitalize">{availability}</p>
				</div>
				<div>
					<h4 className="font-medium mb-1">Capability</h4>
					<p className="text-muted-foreground capitalize">{capability}</p>
				</div>
				<div>
					<h4 className="font-medium mb-1">Proactivity</h4>
					<p className="text-muted-foreground capitalize">{proactivity}</p>
				</div>
				<div>
					<h4 className="font-medium mb-1">Relatability</h4>
					<p className="text-muted-foreground capitalize">{relatability}</p>
				</div>
				<div>
					<h4 className="font-medium mb-1">Adaptability</h4>
					<p className="text-muted-foreground capitalize">{adaptability}</p>
				</div>
				<div>
					<h4 className="font-medium mb-1">Complexity</h4>
					<p className="text-muted-foreground capitalize">{complexity}</p>
				</div>
			</InfoCard>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<InfoCard
					title="Preferred Topics"
					icon={<Icons.Heart className="h-4 w-4 mr-2 text-green-600" />}
					emptyMessage="No preferred topics specified."
				>
					<List items={preferredTopics} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Topics to Avoid"
					icon={<Icons.X className="h-4 w-4 mr-2 text-red-500" />}
					emptyMessage="No topics to avoid specified."
				>
					<List items={avoidTopics} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard
					title="Knowledge"
					icon={<Icons.Brain className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No knowledge specified."
				>
					<List items={knowledge} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Secrets & History"
					icon={<Icons.Lock className="h-4 w-4 mr-2 text-purple-600" />}
					emptyMessage="No secrets or history specified."
				>
					<List items={secretsAndHistory} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>
		</>
	)
}
