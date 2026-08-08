import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { Consequence } from "~/lib/entities"

type EntityRef = { id: number; name: string; slug: string } | null

type ConnectionsContentProps = Pick<
	Consequence,
	| "affectedArea"
	| "affectedConflict"
	| "affectedConsequence"
	| "affectedFaction"
	| "affectedNpc"
	| "affectedQuest"
	| "affectedRegion"
	| "affectedSite"
	| "affectingConsequences"
	| "triggerQuest"
	| "triggerQuestStageDecision"
>

const Ref = ({ label, to, entity }: { label: string; to?: string; entity: EntityRef }) => {
	if (!entity) return null

	return (
		<div className="border-b last:border-0 p-3">
			<span className="text-sm font-medium mr-2">{label}:</span>
			{to ? <Link href={`/${to}/${entity.slug}`}>{entity.name}</Link> : <span>{entity.name}</span>}
		</div>
	)
}

export function ConnectionsContent({
	affectedArea,
	affectedConflict,
	affectedConsequence,
	affectedFaction,
	affectedNpc,
	affectedQuest,
	affectedRegion,
	affectedSite,
	affectingConsequences,
	triggerQuest,
	triggerQuestStageDecision,
}: ConnectionsContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* chk_single_trigger allows at most one of these. */}
			<InfoCard
				title="Caused By"
				icon={<Icons.ArrowLeftCircle className="h-4 w-4 mr-2 text-blue-600" />}
				emptyMessage="No trigger recorded."
			>
				<Ref label="Quest" to="quests" entity={triggerQuest} />
				<Ref label="Decision" entity={triggerQuestStageDecision} />
			</InfoCard>

			{/* chk_single_affected_entity allows exactly one of these. */}
			<InfoCard
				title="Lands On"
				icon={<Icons.ArrowRightCircle className="h-4 w-4 mr-2 text-amber-600" />}
				emptyMessage="No affected entity recorded."
			>
				<Ref label="Quest" to="quests" entity={affectedQuest} />
				<Ref label="NPC" to="npcs" entity={affectedNpc} />
				<Ref label="Conflict" to="conflicts" entity={affectedConflict} />
				<Ref label="Faction" to="factions" entity={affectedFaction} />
				<Ref label="Site" to="sites" entity={affectedSite} />
				<Ref label="Area" to="areas" entity={affectedArea} />
				<Ref label="Region" to="regions" entity={affectedRegion} />
				<Ref label="Consequence" to="consequences" entity={affectedConsequence} />
			</InfoCard>

			<InfoCard
				title="Knock-On From"
				icon={<Icons.Link2 className="h-4 w-4 mr-2 text-purple-600" />}
				emptyMessage="No other consequence led here."
				className="md:col-span-2"
			>
				{affectingConsequences.map(({ id, name, slug }) => (
					<div key={`affecting-${id}`} className="border-b last:border-0 p-3">
						<Link href={`/consequences/${slug}`}>{name}</Link>
					</div>
				))}
			</InfoCard>
		</div>
	)
}
