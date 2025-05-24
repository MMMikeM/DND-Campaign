import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import type { Site } from "~/lib/entities"

// InhabitantsContent.tsx
export const InhabitantsContent: React.FC<Site> = ({ npcs, territorialControl }) => {
	return (
		<div className="space-y-6">
			<InfoCard
				title="NPCs"
				icon={<Icons.Users className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No NPCs are present at this site."
			>
				{npcs.map((npc) => (
					<div key={`npc-${npc.id}`} className="border rounded p-4"></div>
				))}
			</InfoCard>

			<InfoCard
				title="Territorial Control"
				icon={<Icons.Flag className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No factions control this site."
			>
				{territorialControl.map(({ creativePrompts, description, faction, influenceLevel, presence, priorities }) => (
					<div key={`control-${faction.id}`} className="border rounded p-4">
						<h3 className="text-lg font-semibold">{faction.name}</h3>
						<p className="text-sm text-muted-foreground">{description}</p>
						<p className="text-sm text-muted-foreground">{presence}</p>
						<p className="text-sm text-muted-foreground">{priorities}</p>
						<p className="text-sm text-muted-foreground">{influenceLevel}</p>
						<p className="text-sm text-muted-foreground">{creativePrompts}</p>
					</div>
				))}
			</InfoCard>
		</div>
	)
}
