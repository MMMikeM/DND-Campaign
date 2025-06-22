import { List } from "~/components/List"
import type { Area } from "~/lib/entities"

export const DetailsContent = ({
	hazards,
	defenses,
	rumors,
	creativePrompts,
	atmosphereType,
	gmNotes,
	revelationLayersSummary,
}: Pick<
	Area,
	"hazards" | "defenses" | "rumors" | "creativePrompts" | "atmosphereType" | "gmNotes" | "revelationLayersSummary"
>) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<p className="capitalize">{atmosphereType?.replace(/_/g, " ")}</p>

			<List items={hazards} spacing="sm" emptyText="No known hazards." />

			<List items={defenses} spacing="sm" emptyText="No notable defenses." />

			<List items={rumors} spacing="sm" emptyText="No rumors circulating." />

			<List items={revelationLayersSummary} spacing="sm" emptyText="No revelation layers available." />

			<List items={creativePrompts} spacing="sm" emptyText="No creative prompts available." />

			<List items={gmNotes} heading="GM Notes" spacing="sm" emptyText="No GM notes." />
		</div>
	)
}
