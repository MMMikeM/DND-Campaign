import { tables } from "@tome-master/shared"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

const { consequenceAffectedEntityTypes, consequenceTriggerTypes } = tables.narrativeEventTables.enums

export function ConsequencesContent({
	consequences,
	affectedByConsequences,
}: Pick<Conflict, "consequences" | "affectedByConsequences">) {
	return (
		<div>
			<h2 className="text-lg font-medium">Consequences</h2>
			{consequences.map((consequence) => (
				<Consequence key={consequence.id} {...consequence} />
			))}
			<h2 className="text-lg font-medium">Affected By</h2>
			{affectedByConsequences.map((affectedByConsequence) => (
				<AffectedByConsequence key={affectedByConsequence.id} {...affectedByConsequence} />
			))}
		</div>
	)
}

const AffectedLink = ({
	...consequence
}: Conflict["consequences"][number] & {
	affectedEntityType: (typeof consequenceAffectedEntityTypes)[number] | string | null
}) => {
	switch (consequence.affectedEntityType) {
		case "area":
			return <Link href={`/areas/${consequence.affectedArea?.slug}`}>{consequence.affectedArea?.name}</Link>
		case "conflict":
			return <Link href={`/conflicts/${consequence.affectedConflict?.slug}`}>{consequence.affectedConflict?.name}</Link>
		case "faction":
			return <Link href={`/factions/${consequence.affectedFaction?.slug}`}>{consequence.affectedFaction?.name}</Link>
		case "npc":
			return <Link href={`/npcs/${consequence.affectedNpc?.slug}`}>{consequence.affectedNpc?.name}</Link>
		case "quest":
			return <Link href={`/quests/${consequence.affectedQuest?.slug}`}>{consequence.affectedQuest?.name}</Link>
		case "region":
			return <Link href={`/regions/${consequence.affectedRegion?.slug}`}>{consequence.affectedRegion?.name}</Link>
		case "site":
			return <Link href={`/sites/${consequence.affectedSite?.slug}`}>{consequence.affectedSite?.name}</Link>
		default:
			throw new Error(`Unknown affected entity type: ${consequence.affectedEntityType}`)
	}
}

function Consequence(consequence: Conflict["consequences"][number]) {
	const {
		conflictImpactDescription,
		consequenceType,
		creativePrompts,
		description,
		gmNotes,
		name,
		playerImpactFeel,
		severity,
		slug,
		sourceType,
		tags,
		timeframe,
		visibility,
	} = consequence
	return (
		<div>
			<Link href={`/conflicts/${slug}`}>{name}</Link>
			<p>{consequenceType}</p>
			<p>{description}</p>
			<p>{conflictImpactDescription}</p>
			<p>{playerImpactFeel}</p>
			<p>{severity}</p>
			<p>{sourceType}</p>
			<p>{timeframe}</p>
			<p>{tags}</p>
			<p>{visibility}</p>
			<p>{creativePrompts}</p>
			<p>{gmNotes}</p>

			<AffectedLink {...consequence} />
		</div>
	)
}

const TriggerLink = ({
	...consequence
}: Conflict["affectedByConsequences"][number] & {
	triggerEntityType: (typeof consequenceTriggerTypes)[number] | string | null
}) => {
	switch (consequence.triggerEntityType) {
		case "quest":
			return <Link href={`/quests/${consequence.triggerQuest?.slug}`}>{consequence.triggerQuest?.name}</Link>
		case "decision":
			return (
				<Link href={`/quests/${consequence.triggerStageDecision?.slug}`}>{consequence.triggerStageDecision?.name}</Link>
			)
		case "conflict":
			return <Link href={`/conflicts/${consequence.triggerConflict?.slug}`}>{consequence.triggerConflict?.name}</Link>
		default:
			throw new Error(`Unknown trigger entity type: ${consequence.triggerEntityType}`)
	}
}

function AffectedByConsequence(affectedByConsequence: Conflict["affectedByConsequences"][number]) {
	const {
		conflictImpactDescription,
		consequenceType,
		creativePrompts,
		description,
		gmNotes,
		name,
		playerImpactFeel,
		severity,
		slug,
		sourceType,
		tags,
		timeframe,
		visibility,
	} = affectedByConsequence
	return (
		<div>
			<Link href={`/conflicts/${slug}`}>{name}</Link>
			<p>{description}</p>
			<p>{conflictImpactDescription}</p>
			<p>{playerImpactFeel}</p>
			<p>{severity}</p>
			<p>{sourceType}</p>
			<p>{timeframe}</p>
			<p>{tags}</p>
			<p>{visibility}</p>
			<p>{consequenceType}</p>
			<p>{creativePrompts}</p>
			<p>{gmNotes}</p>

			<TriggerLink {...affectedByConsequence} />
		</div>
	)
}
