import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

export function ConsequencesContent({ affectingConsequences }: Pick<Conflict, "affectingConsequences">) {
	return (
		<InfoCard
			title="Affected By"
			description="Consequences that have landed on this conflict"
			icon={<Icons.Activity className="h-4 w-4 mr-2 text-amber-600" />}
			emptyMessage="No consequences have affected this conflict."
			contentClassName="space-y-4"
		>
			{affectingConsequences.map((consequence) => (
				<Consequence key={consequence.id} consequence={consequence} />
			))}
		</InfoCard>
	)
}

type ConsequenceRecord = Conflict["affectingConsequences"][number]

const Consequence = ({ consequence }: { consequence: ConsequenceRecord }) => {
	const {
		affectingConsequences,
		complicationDetails,
		conflictImpactDescription,
		consequenceType,
		creativePrompts,
		description,
		escalationDetails,
		incomingForeshadowing,
		name,
		playerImpactFeel,
		severity,
		slug,
		sourceType,
		tags,
		timeframe,
		triggerQuest,
		triggerQuestStageDecision,
		twistRevealDetails,
		visibility,
	} = consequence

	return (
		<div className="border rounded p-4 bg-background dark:bg-muted/30">
			<Link href={`/consequences/${slug}`} className="text-md font-semibold text-primary hover:underline">
				{name}
			</Link>

			<div className="flex flex-wrap gap-x-2 gap-y-1 my-2 text-xs text-muted-foreground capitalize">
				<span>{consequenceType}</span>
				<span>·</span>
				<span>{severity}</span>
				<span>·</span>
				<span>{visibility}</span>
				<span>·</span>
				<span>{timeframe}</span>
				<span>·</span>
				<span>from {sourceType}</span>
			</div>

			{/* Guaranteed non-null by chk_conflict_impact_description_required whenever a conflict is affected. */}
			<p className="text-sm mb-2">{conflictImpactDescription}</p>
			<p className="text-sm text-muted-foreground mb-3">Player impact: {playerImpactFeel}</p>

			<Detail icon={<Icons.GitBranch className="h-3.5 w-3.5 mr-1.5" />} label="Complication" text={complicationDetails} />
			<Detail icon={<Icons.TrendingUp className="h-3.5 w-3.5 mr-1.5" />} label="Escalation" text={escalationDetails} />
			<Detail icon={<Icons.Sparkle className="h-3.5 w-3.5 mr-1.5" />} label="Twist Reveal" text={twistRevealDetails} />

			<List items={description} heading="Description" spacing="sm" textColor="muted" collapsible={false} />
			<List items={creativePrompts} heading="Creative Prompts" spacing="sm" textColor="muted" />

			{/* chk_single_trigger permits at most one of these. */}
			<Ref icon={<Icons.Scroll className="h-3.5 w-3.5 mr-1.5" />} label="Triggered by quest" to="quests" entity={triggerQuest} />
			<Ref
				icon={<Icons.GitFork className="h-3.5 w-3.5 mr-1.5" />}
				label="Triggered by decision"
				entity={triggerQuestStageDecision}
			/>

			{affectingConsequences.length > 0 && (
				<RefList
					icon={<Icons.Link2 className="h-3.5 w-3.5 mr-1.5" />}
					label="Knock-on from"
					to="consequences"
					entities={affectingConsequences}
				/>
			)}

			{incomingForeshadowing.length > 0 && (
				<RefList
					icon={<Icons.Eye className="h-3.5 w-3.5 mr-1.5" />}
					label="Foreshadowed by"
					to="foreshadowing"
					entities={incomingForeshadowing}
				/>
			)}

			<Tags tags={tags} variant="secondary" maxDisplay={8} />
		</div>
	)
}

const Detail = ({ icon, label, text }: { icon: React.ReactNode; label: string; text: string | null }) => {
	if (!text) return null

	return (
		<div className="mb-2">
			<h4 className="font-medium text-sm flex items-center">
				{icon}
				{label}
			</h4>
			<p className="text-sm text-muted-foreground">{text}</p>
		</div>
	)
}

type EntityRef = { id: number; name: string; slug: string } | null

const Ref = ({
	icon,
	label,
	to,
	entity,
}: {
	icon: React.ReactNode
	label: string
	to?: string
	entity: EntityRef
}) => {
	if (!entity) return null

	return (
		<div className="mb-2 text-sm flex items-center">
			{icon}
			<span className="font-medium mr-2">{label}:</span>
			{to ? <Link href={`/${to}/${entity.slug}`}>{entity.name}</Link> : <span>{entity.name}</span>}
		</div>
	)
}

const RefList = ({
	icon,
	label,
	to,
	entities,
}: {
	icon: React.ReactNode
	label: string
	to: string
	entities: NonNullable<EntityRef>[]
}) => (
	<div className="mb-2 text-sm">
		<h4 className="font-medium flex items-center">
			{icon}
			{label}
		</h4>
		<div className="flex flex-wrap gap-x-3 text-muted-foreground">
			{entities.map((entity) => (
				<Link key={entity.id} href={`/${to}/${entity.slug}`}>
					{entity.name}
				</Link>
			))}
		</div>
	</div>
)
