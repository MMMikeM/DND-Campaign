import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"

interface DetailsContentProps {
	region: Region
}

export const DetailsContent: React.FC<DetailsContentProps> = ({ region }) => {
	const { hazards, pointsOfInterest, security, rumors } = region

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Hazards"
				icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No known hazards"
			>
				<List items={hazards} spacing="sm" textColor="default" emptyText="No known hazards" />
			</InfoCard>

			<InfoCard
				title="Points of Interest"
				icon={<Icons.MapPin className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No notable points of interest"
			>
				<List items={pointsOfInterest} spacing="sm" textColor="default" emptyText="No notable points of interest" />
			</InfoCard>

			<InfoCard
				title="Security"
				icon={<Icons.Shield className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No security information available"
			>
				<List items={security} spacing="sm" textColor="default" emptyText="No security information available" />
			</InfoCard>

			<InfoCard
				title="Rumors"
				icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No rumors circulating"
			>
				<List items={rumors} spacing="sm" textColor="default" emptyText="No rumors circulating" />
			</InfoCard>
		</div>
	)
}

export default DetailsContent
