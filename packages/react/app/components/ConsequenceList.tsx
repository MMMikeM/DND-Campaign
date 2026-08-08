import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"

type EntityRef = { id: number; name: string; slug?: string } | null

export interface Consequence {
	id: number
	name: string
	slug: string
	description: string[]
	creativePrompts: string[]
	tags: string[]
	consequenceType: string
	severity: string
	visibility: string
	timeframe: string
	sourceType: string
	playerImpactFeel: string
	conflictImpactDescription?: string | null
	complicationDetails?: string | null
	escalationDetails?: string | null
	twistRevealDetails?: string | null
	triggerQuest?: EntityRef
	triggerQuestStageDecision?: EntityRef
	affectedArea?: EntityRef
	affectedConflict?: EntityRef
	affectedConsequence?: EntityRef
	affectedFaction?: EntityRef
	affectedNpc?: EntityRef
	affectedQuest?: EntityRef
	affectedRegion?: EntityRef
	affectedSite?: EntityRef
}

type RefKey = keyof Consequence & (`trigger${string}` | `affected${string}`)
type RefConfig = { key: RefKey; label: string; route: string | null }

const triggerRefs: RefConfig[] = [
	{ key: "triggerQuest", label: "Quest", route: "quests" },
	{ key: "triggerQuestStageDecision", label: "Decision", route: null },
]

const affectedRefs: RefConfig[] = [
	{ key: "affectedQuest", label: "Quest", route: "quests" },
	{ key: "affectedNpc", label: "NPC", route: "npcs" },
	{ key: "affectedConflict", label: "Conflict", route: "conflicts" },
	{ key: "affectedFaction", label: "Faction", route: "factions" },
	{ key: "affectedSite", label: "Site", route: "sites" },
	{ key: "affectedArea", label: "Area", route: "areas" },
	{ key: "affectedRegion", label: "Region", route: "regions" },
	{ key: "affectedConsequence", label: "Consequence", route: "consequences" },
]

const ConsequenceRefs = ({
	consequence,
	refs,
	heading,
}: {
	consequence: Consequence
	refs: RefConfig[]
	heading: string
}) => {
	const present = refs.filter(({ key }) => consequence[key])

	if (present.length === 0) {
		return null
	}

	return (
		<div className="mt-2 text-sm">
			<h5 className="font-semibold">{heading}</h5>
			{present.map(({ key, label, route }) => {
				const entity = consequence[key] as NonNullable<EntityRef>

				return route && entity.slug ? (
					<Link key={key} className="text-primary hover:underline" href={`/${route}/${entity.slug}`}>
						{label}: {entity.name}
					</Link>
				) : (
					<span key={key}>
						{label}: {entity.name}
					</span>
				)
			})}
		</div>
	)
}

const Framing = ({ consequence }: { consequence: Consequence }) => {
	const { consequenceType, severity, visibility, timeframe, sourceType, playerImpactFeel } = consequence

	return (
		<>
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
			<p className="text-sm text-muted-foreground">Player impact: {playerImpactFeel}</p>
		</>
	)
}

/**
 * The entity that caused this consequence renders it in full; the entity it landed
 * on renders only the part that concerns it, and links back to the cause.
 */
const TriggeredCard = (consequence: Consequence) => {
	const { name, slug, description, creativePrompts, tags, complicationDetails, escalationDetails, twistRevealDetails } =
		consequence

	return (
		<div className="border rounded p-4">
			<div className="flex justify-between items-start">
				<Link href={`/consequences/${slug}`} className="font-medium text-lg text-primary hover:underline">
					{name}
				</Link>
				<Tags tags={tags} />
			</div>

			<Framing consequence={consequence} />

			{complicationDetails && <p className="text-sm mt-2">{complicationDetails}</p>}
			{escalationDetails && <p className="text-sm mt-2">{escalationDetails}</p>}
			{twistRevealDetails && <p className="text-sm mt-2">{twistRevealDetails}</p>}

			<List items={description} spacing="sm" className="mt-2" />
			<List items={creativePrompts} heading="Creative Prompts" spacing="sm" className="mt-2" />
			<ConsequenceRefs consequence={consequence} refs={affectedRefs} heading="Lands On:" />
		</div>
	)
}

const AffectingCard = (consequence: Consequence) => {
	const { name, slug, conflictImpactDescription } = consequence

	return (
		<div className="border rounded p-4">
			<Link href={`/consequences/${slug}`} className="font-medium text-primary hover:underline">
				{name}
			</Link>

			<Framing consequence={consequence} />

			{conflictImpactDescription && <p className="text-sm mt-2">{conflictImpactDescription}</p>}
			<ConsequenceRefs consequence={consequence} refs={triggerRefs} heading="Caused By:" />
		</div>
	)
}

export const ConsequenceList = ({
	triggered = [],
	affecting = [],
	emptyMessage = "No consequences are linked to this entity.",
}: {
	triggered?: Consequence[]
	affecting?: Consequence[]
	emptyMessage?: string
}) => {
	const sections = [
		{ heading: "Sets Off", items: triggered, Card: TriggeredCard },
		{ heading: "Affected By", items: affecting, Card: AffectingCard },
	].filter(({ items }) => items.length > 0)

	const showHeadings = triggered.length > 0 && affecting.length > 0

	return (
		<InfoCard
			title="Consequences"
			icon={<Icons.Activity className="h-4 w-4 mr-2 text-amber-600" />}
			emptyMessage={emptyMessage}
			contentClassName="space-y-4"
		>
			{sections.map(({ heading, items, Card }) => (
				<div key={heading} className="space-y-4">
					{showHeadings && <h4 className="font-semibold">{heading}</h4>}
					{items.map((consequence) => (
						<Card key={consequence.id} {...consequence} />
					))}
				</div>
			))}
		</InfoCard>
	)
}
