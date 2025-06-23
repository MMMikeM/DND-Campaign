import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import type { Site } from "~/lib/entities"
import MapVariants from "~/routes/maps/components/VariantContent"

export const MapContent = ({ mapGroup }: Pick<Site, "mapGroup">) => {
	if (!mapGroup || mapGroup.variants.length === 0) {
		return (
			<InfoCard
				title="Map"
				icon={<Icons.Map className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No tactical map is linked to this site."
			/>
		)
	}

	return (
		<div className="mt-6">
			<MapVariants variants={mapGroup.variants} />
		</div>
	)
}
