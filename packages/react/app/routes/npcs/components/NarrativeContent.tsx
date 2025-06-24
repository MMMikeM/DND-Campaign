import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { NPC } from "~/lib/entities"

export function NarrativeContent({
	name,
	conflictParticipation,
	affectingConsequences,
	incomingForeshadowing,
	narrativeDestinationInvolvement,
}: Pick<
	NPC,
	| "name"
	| "conflictParticipation"
	| "affectingConsequences"
	| "incomingForeshadowing"
	| "narrativeDestinationInvolvement"
>) {
	return (
		<div className="space-y-6">
			<InfoCard
				title="Conflict Participation"
				description={`Conflicts ${name} is involved in`}
				icon={<Icons.Swords className="h-4 w-4 mr-2 text-red-600" />}
				emptyMessage="Not involved in any conflicts."
			>
				{conflictParticipation.map(({ id, conflict, role }) => (
					<div key={`conflict-${id}`} className="border-b last:border-b-0 p-3">
						<Link href={`/conflicts/${conflict.slug}`}>
							<h4 className="font-medium">{conflict.name}</h4>
						</Link>
						<p className="text-sm text-muted-foreground">Role: {role}</p>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Narrative Arcs"
				description={`Story arcs featuring ${name}`}
				icon={<Icons.GitMerge className="h-4 w-4 mr-2 text-purple-600" />}
				emptyMessage="Not involved in any narrative arcs."
			>
				{narrativeDestinationInvolvement.map(({ id, narrativeDestination, narrativeRole }) => (
					<div key={`narrative-arc-${id}`} className="border-b last:border-b-0 p-3">
						<Link href={`/narrative-destinations/${narrativeDestination.slug}`}>
							<h4 className="font-medium">{narrativeDestination.name}</h4>
						</Link>
						<p className="text-sm text-muted-foreground">Role: {narrativeRole}</p>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Foreshadowing"
				description={`Foreshadowing that hints at ${name}'s role`}
				icon={<Icons.Eye className="h-4 w-4 mr-2 text-blue-600" />}
				emptyMessage="No foreshadowing for this NPC."
			>
				{incomingForeshadowing.map(({ id, name: foreshadowingName, description }) => (
					<div key={`foreshadowing-${id}`} className="border-b last:border-b-0 p-3">
						<h4 className="font-medium">{foreshadowingName}</h4>
						<p className="text-sm text-muted-foreground">{description.join(" ")}</p>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Affecting Consequences"
				description={`Events that have impacted ${name}`}
				icon={<Icons.Activity className="h-4 w-4 mr-2 text-amber-600" />}
				emptyMessage="No consequences have affected this NPC."
			>
				{affectingConsequences.map(({ id, name: consequenceName, description }) => (
					<div key={`consequence-${id}`} className="border-b last:border-b-0 p-3">
						<h4 className="font-medium">{consequenceName}</h4>
						<p className="text-sm text-muted-foreground">{description.join(" ")}</p>
					</div>
				))}
			</InfoCard>
		</div>
	)
}
