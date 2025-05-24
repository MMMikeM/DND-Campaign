import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Area } from "~/lib/entities"

export const DetailsContent: React.FC<Area> = ({ hazards, defenses, rumors, creativePrompts }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard title="Hazards" icon={<Icons.AlertTriangle className="h-4 w-4 text-primary" />}>
				<List items={hazards} spacing="sm" emptyText="No known hazards." />
			</InfoCard>

			<InfoCard title="Defenses" icon={<Icons.Shield className="h-4 w-4 text-primary" />}>
				<List items={defenses} spacing="sm" emptyText="No notable defenses." />
			</InfoCard>

			<InfoCard title="Rumors" icon={<Icons.MessageSquare className="h-4 w-4 text-primary" />}>
				<List items={rumors} spacing="sm" emptyText="No rumors circulating." />
			</InfoCard>

			<InfoCard title="Creative Prompts" icon={<Icons.Lightbulb className="h-4 w-4 text-primary" />}>
				<List items={creativePrompts} spacing="sm" emptyText="No creative prompts available." />
			</InfoCard>
		</div>
	)
}

export default DetailsContent
