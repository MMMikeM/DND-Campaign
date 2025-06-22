import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

export function ConsequencesContent({
	triggeredConsequences,
	affectingConsequences,
}: Pick<Conflict, "affectingConsequences" | "triggeredConsequences">) {
	return (
		<div>
			<h2 className="text-lg font-medium">Consequences</h2>
			{triggeredConsequences.map((consequence) => (
				<Consequence key={consequence.id} {...consequence} />
			))}
			<h2 className="text-lg font-medium">Affected By</h2>
			{affectingConsequences.map((affectedByConsequence) => (
				<AffectedByConsequence key={affectedByConsequence.id} {...affectedByConsequence} />
			))}
		</div>
	)
}

function Consequence(consequence: Conflict["triggeredConsequences"][number]) {
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
		</div>
	)
}

function AffectedByConsequence(affectedByConsequence: Conflict["affectingConsequences"][number]) {
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
		</div>
	)
}
