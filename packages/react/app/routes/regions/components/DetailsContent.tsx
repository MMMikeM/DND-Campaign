import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"

type DetailsContentProps = Pick<Region, "featuresAndHazards">

export const DetailsContent: React.FC<DetailsContentProps> = ({ featuresAndHazards }) => {
	return (
		<InfoCard
			title="Features & Hazards"
			icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No notable features or hazards"
		>
			<List items={featuresAndHazards} spacing="sm" textColor="default" />
		</InfoCard>
	)
}
