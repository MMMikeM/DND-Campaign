import * as Icons from "lucide-react"
import { ConsequenceList } from "~/components/ConsequenceList"
import { ForeshadowingList } from "~/components/ForeshadowingList"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { NPC } from "~/lib/entities"

export function NarrativeContent({
	name,
	conflictParticipation,
	affectingConsequences,
	incomingForeshadowing,
	outgoingForeshadowing,
}: Pick<
	NPC,
	"name" | "conflictParticipation" | "affectingConsequences" | "incomingForeshadowing" | "outgoingForeshadowing"
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

			<ForeshadowingList
				incoming={incomingForeshadowing}
				outgoing={outgoingForeshadowing}
				emptyMessage="No foreshadowing is linked to this NPC."
			/>

			<ConsequenceList affecting={affectingConsequences} emptyMessage={`No consequences have affected ${name}.`} />
		</div>
	)
}
