import * as Icons from "lucide-react"
import { ForeshadowingList } from "~/components/ForeshadowingList"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { QuestStage } from "~/lib/entities"

export default function StageDetailsTab(selectedStage: QuestStage) {
	const {
		dramatic_moments,
		sensory_elements,
		encounters,
		site,
		completionPaths,
		creativePrompts,
		description,
		dramatic_question,
		deliveryNpc,
		id,
		incomingDecisions,
		intendedComplexityLevel,
		itemConnections,
		name,
		npcInvolvement,
		objectives,
		outgoingDecisions,
		outgoingForeshadowing,
		quest,
		questId,
		slug,
		stageImportance,
		stageOrder,
		stageType,
		tags,
	} = selectedStage

	return (
		<div className="space-y-6">
			{/* Dramatic & Sensory Elements */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Dramatic Elements */}
				<InfoCard title="Dramatic Elements" icon={<Icons.Theater className="h-4 w-4 mr-2" />}>
					<List items={dramatic_moments} spacing="sm" textColor="default" />
				</InfoCard>

				{/* Sensory Elements */}
				<InfoCard title="Sensory Elements" icon={<Icons.Eye className="h-4 w-4 mr-2" />}>
					<List items={sensory_elements} spacing="sm" textColor="default" />
				</InfoCard>
			</div>

			{/* Encounters */}
			{encounters && encounters.length > 0 && (
				<InfoCard title="Encounters" icon={<Icons.Swords className="h-4 w-4 mr-2" />}>
					<List items={encounters} spacing="sm" textColor="default" />
				</InfoCard>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{site && (
					<InfoCard title="Site" icon={<Icons.MapPin className="h-4 w-4 mr-2" />}>
						<Link href={`/sites/${site.slug}`} className="text-sm text-primary hover:underline">
							{site.name}
						</Link>
					</InfoCard>
				)}

				{deliveryNpc && (
					<InfoCard title="Delivered By" icon={<Icons.UserCircle className="h-4 w-4 mr-2" />}>
						<Link href={`/npcs/${deliveryNpc.slug}`} className="text-sm text-primary hover:underline">
							{deliveryNpc.name}
						</Link>
					</InfoCard>
				)}
			</div>

			<InfoCard
				title="NPC Involvement"
				icon={<Icons.Users className="h-4 w-4 mr-2" />}
				emptyMessage="No NPCs are involved in this stage."
			>
				{npcInvolvement.map(({ id: involvementId, roleInStage, involvementDetails }) => (
					<div key={`involvement-${involvementId}`} className="border-b last:border-b-0 p-3">
						<p className="text-sm font-medium">{roleInStage}</p>
						<List items={involvementDetails} spacing="sm" textColor="muted" />
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Items"
				icon={<Icons.Package className="h-4 w-4 mr-2" />}
				emptyMessage="No items are tied to this stage."
			>
				{itemConnections.map(({ id: connectionId, sourceItem, relationship }) => (
					<div key={`item-${connectionId}`} className="border-b last:border-b-0 p-3">
						<span className="text-sm font-medium">{sourceItem.name}</span>
						<span className="text-sm text-muted-foreground ml-2">{relationship}</span>
					</div>
				))}
			</InfoCard>

			<ForeshadowingList
				outgoing={outgoingForeshadowing}
				emptyMessage="This stage plants no foreshadowing."
			/>
		</div>
	)
}
