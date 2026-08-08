import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Site } from "~/lib/entities"

export const DetailsContent = ({
	creativePrompts,
	intendedSiteFunction,
}: Pick<Site, "creativePrompts" | "intendedSiteFunction">) => (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
		<InfoCard title="Intended Site Function" icon={<Icons.Puzzle className="h-4 w-4 text-primary" />}>
			<p className="text-sm text-muted-foreground capitalize">{intendedSiteFunction}</p>
		</InfoCard>

		<InfoCard title="Creative Prompts" icon={<Icons.Lightbulb className="h-4 w-4 text-primary" />}>
			<List items={creativePrompts} spacing="sm" emptyText="No creative prompts available." />
		</InfoCard>
	</div>
)
