import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import type { Site } from "~/lib/entities"
import MapVariants from "~/routes/maps/components/VariantContent"
import type { MapVariant } from "~/routes/maps/utils"

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

	// Add an orientation helper to each variant (copied from the maps route loader)
	const variants: MapVariant[] = mapGroup.variants.map((variant) => {
		if (!variant.mapFile?.imageWidth || !variant.mapFile?.imageHeight) {
			return { ...variant, orientation: "square" } as const
		}

		const aspectRatio = variant.mapFile.imageWidth / variant.mapFile.imageHeight
		const orientation = aspectRatio > 1.2 ? "landscape" : aspectRatio < 0.8 ? "portrait" : "square"

		return { ...variant, orientation } as const
	})

	return (
		<div className="mt-6">
			<MapVariants variants={variants} />
		</div>
	)
}
