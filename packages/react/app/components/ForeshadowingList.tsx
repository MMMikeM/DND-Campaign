import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"

type EntityRef = { name: string; slug?: string } | null

export interface ForeshadowingSeed {
	id: number
	name: string
	description: string[]
	creativePrompts: string[]
	tags: string[]
	subtlety: string
	narrativeWeight: string
	suggestedDeliveryMethods: string[]
	gmNotes?: string[]
	sourceItem?: EntityRef
	sourceLore?: EntityRef
	sourceNpc?: EntityRef
	sourceQuest?: EntityRef
	sourceQuestStage?: EntityRef
	sourceSite?: EntityRef
	targetArea?: EntityRef
	targetConflict?: EntityRef
	targetConsequence?: EntityRef
	targetFaction?: EntityRef
	targetItem?: EntityRef
	targetLore?: EntityRef
	targetNpc?: EntityRef
	targetQuest?: EntityRef
	targetRegion?: EntityRef
	targetSite?: EntityRef
}

type RefKey = keyof ForeshadowingSeed & (`source${string}` | `target${string}`)

type RefConfig = { key: RefKey; label: string; route: string | null }

export const sourceRefs: RefConfig[] = [
	{ key: "sourceQuest", label: "Quest", route: "quests" },
	{ key: "sourceQuestStage", label: "Quest Stage", route: null },
	{ key: "sourceNpc", label: "NPC", route: "npcs" },
	{ key: "sourceSite", label: "Site", route: "sites" },
	{ key: "sourceLore", label: "Lore", route: "lore" },
	{ key: "sourceItem", label: "Item", route: null },
]

export const targetRefs: RefConfig[] = [
	{ key: "targetQuest", label: "Quest", route: "quests" },
	{ key: "targetNpc", label: "NPC", route: "npcs" },
	{ key: "targetConflict", label: "Conflict", route: "conflicts" },
	{ key: "targetConsequence", label: "Consequence", route: "consequences" },
	{ key: "targetFaction", label: "Faction", route: "factions" },
	{ key: "targetLore", label: "Lore", route: "lore" },
	{ key: "targetSite", label: "Site", route: "sites" },
	{ key: "targetArea", label: "Area", route: "areas" },
	{ key: "targetRegion", label: "Region", route: "regions" },
	{ key: "targetItem", label: "Item", route: null },
]

const ForeshadowingRefs = ({
	seed,
	refs,
	heading,
}: {
	seed: ForeshadowingSeed
	refs: RefConfig[]
	heading: string
}) => {
	const present = refs.filter(({ key }) => seed[key])

	if (present.length === 0) {
		return null
	}

	return (
		<div className="mt-2 text-sm">
			<h5 className="font-semibold">{heading}</h5>
			{present.map((config) => (
				<ForeshadowingRef key={config.key} seed={seed} config={config} />
			))}
		</div>
	)
}

/** Renders one source or target of `seed`; the caller filters out refs the seed doesn't have. */
export const ForeshadowingRef = ({
	seed,
	config: { key, label, route },
}: {
	seed: ForeshadowingSeed
	config: RefConfig
}) => {
	const entity = seed[key] as NonNullable<EntityRef>

	return route && entity.slug ? (
		<Link className="text-primary hover:underline" href={`/${route}/${entity.slug}`}>
			{label}: {entity.name}
		</Link>
	) : (
		<span>
			{label}: {entity.name}
		</span>
	)
}

const ForeshadowingCard = (seed: ForeshadowingSeed) => {
	const { name, description, subtlety, narrativeWeight, creativePrompts, tags, suggestedDeliveryMethods } = seed

	return (
		<div className="border rounded p-4">
			<div className="flex justify-between items-start">
				<h4 className="font-medium text-lg">{name}</h4>
				<Tags tags={tags} />
			</div>
			<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
				<span className="capitalize">
					<strong>Subtlety:</strong> {subtlety}
				</span>
				<span className="capitalize">
					<strong>Weight:</strong> {narrativeWeight}
				</span>
				{suggestedDeliveryMethods.length > 0 && (
					<span className="capitalize">
						<strong>Delivery:</strong> {suggestedDeliveryMethods.join(", ")}
					</span>
				)}
			</div>
			<List items={description} />
			<List items={creativePrompts} heading="Creative Prompts" spacing="sm" className="mt-2" />
			{seed.gmNotes && <List items={seed.gmNotes} heading="GM Notes" spacing="sm" className="mt-2" />}
			<ForeshadowingRefs seed={seed} refs={sourceRefs} heading="Planted Via:" />
			<ForeshadowingRefs seed={seed} refs={targetRefs} heading="Hints At:" />
		</div>
	)
}

export const ForeshadowingList = ({
	incoming = [],
	outgoing = [],
	emptyMessage = "No foreshadowing is linked to this entity.",
}: {
	incoming?: ForeshadowingSeed[]
	outgoing?: ForeshadowingSeed[]
	emptyMessage?: string
}) => {
	const sections = [
		{ heading: "Incoming", items: incoming },
		{ heading: "Outgoing", items: outgoing },
	].filter(({ items }) => items.length > 0)

	const showHeadings = incoming.length > 0 && outgoing.length > 0

	return (
		<InfoCard
			title="Foreshadowing"
			icon={<Icons.Eye className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage={emptyMessage}
		>
			{sections.map(({ heading, items }) => (
				<div key={heading} className="space-y-4 mb-4 last:mb-0">
					{showHeadings && <h3 className="font-semibold text-muted-foreground">{heading}</h3>}
					{items.map((seed) => (
						<ForeshadowingCard key={seed.id} {...seed} />
					))}
				</div>
			))}
		</InfoCard>
	)
}
