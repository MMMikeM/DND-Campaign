import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { Site } from "~/lib/entities"

type qhkeys = keyof Site["questHooks"][number]
type qskeys = keyof Site["questStages"][number]
type ifkeys = keyof Site["incomingForeshadowing"][number]
type ckeys = keyof Site["consequences"][number]

export const NarrativeContent = ({
	questHooks,
	questStages,
	incomingForeshadowing,
	consequences,
}: Pick<Site, "questHooks" | "questStages" | "incomingForeshadowing" | "consequences">) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Quest Hooks"
				icon={<Icons.Anchor className="h-4 w-4 text-primary" />}
				emptyMessage="No quest hooks originate from this site."
			>
				{questHooks.map(
					({
						id,
						name,
						creativePrompts,
						description,
						gmNotes,
						tags,
						questId,
						siteId,
						deliveryNpcId,
						hookSourceType,
						factionId,
						hookType,
						presentationStyle,
						trustRequired,
						source,
						npcRelationshipToParty,
						dialogueHint,
						hookContent,
						discoveryConditions,
						slug,
						quest,
					}) => (
						<div key={id} className="border rounded p-3 mb-2">
							{questId && (
								<Link href={`/quests/${quest.slug}`}>
									<h4 className="font-medium text-primary hover:underline">{quest.name}</h4>
								</Link>
							)}
							<p className="text-sm mt-1">{hookContent}</p>
						</div>
					),
				)}
			</InfoCard>

			<InfoCard
				title="Quest Stages"
				icon={<Icons.Footprints className="h-4 w-4 text-primary" />}
				emptyMessage="No quest stages are set in this site."
			>
				{questStages.map((stage) => (
					<div key={stage.id} className="border rounded p-3 mb-2">
						{stage.quest && (
							<Link href={`/quests/${stage.quest.slug}`}>
								<h4 className="font-medium text-primary hover:underline">
									{stage.quest.name} - {stage.name}
								</h4>
							</Link>
						)}
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Foreshadowing"
				icon={<Icons.Eye className="h-4 w-4 text-primary" />}
				emptyMessage="No foreshadowing is linked to this site."
			>
				{incomingForeshadowing.map(
					({
						id,
						name,
						creativePrompts,
						description,
						gmNotes,
						tags,
						targetQuestId,
						targetNpcId,
						targetNarrativeEventId,
						targetConflictId,
						targetItemId,
						targetNarrativeDestinationId,
						targetLoreId,
						targetFactionId,
						targetSiteId,
						sourceQuestId,
						sourceQuestStageId,
						sourceSiteId,
						sourceNpcId,
						sourceItemDescriptionId,
						sourceLoreId,
						subtlety,
						narrativeWeight,
						suggestedDeliveryMethods,
						slug,
					}) => (
						<div key={id} className="border rounded p-3 mb-2">
							<h4 className="font-medium">{name}</h4>
							<p className="text-sm mt-1">{description}</p>
						</div>
					),
				)}
			</InfoCard>

			<InfoCard
				title="Consequences"
				icon={<Icons.AlertTriangle className="h-4 w-4 text-primary" />}
				emptyMessage="No consequences have affected this site."
			>
				{consequences.map((consequence) => (
					<div key={consequence.id} className="border rounded p-3 mb-2">
						<h4 className="font-medium">{consequence.name}</h4>
						<p className="text-sm mt-1">{consequence.description}</p>
					</div>
				))}
			</InfoCard>
		</div>
	)
}
