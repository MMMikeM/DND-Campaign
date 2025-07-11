import { List } from "~/components/List"
import type { Area } from "~/lib/entities"

export const DetailsContent = ({
	featuresAndHazards,
	loreAndSecrets,
}: Pick<Area, "featuresAndHazards" | "loreAndSecrets">) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<List
				items={featuresAndHazards}
				heading="Features & Hazards"
				spacing="sm"
				emptyText="No features and hazards available."
			/>

			<List items={loreAndSecrets} heading="Lore & Secrets" spacing="sm" emptyText="No lore and secrets available." />
		</div>
	)
}
