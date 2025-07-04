import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Site } from "~/lib/entities"

export const DetailsContent = ({
	lightingDescription,
	soundscape,
	smells,
	weather,
	descriptors,
	creativePrompts,
	intendedSiteFunction,
	gmNotes,
}: Pick<
	Site,
	| "lightingDescription"
	| "soundscape"
	| "smells"
	| "weather"
	| "descriptors"
	| "creativePrompts"
	| "intendedSiteFunction"
	| "gmNotes"
>) => (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
		<InfoCard title="Lighting" icon={<Icons.Sun className="h-4 w-4 text-primary" />}>
			<List items={lightingDescription} spacing="sm" emptyText="No specific lighting details." />
		</InfoCard>

		<InfoCard title="Soundscape" icon={<Icons.Volume2 className="h-4 w-4 text-primary" />}>
			<List items={soundscape} spacing="sm" emptyText="No specific soundscape details." />
		</InfoCard>

		<InfoCard title="Smells" icon={<Icons.Wind className="h-4 w-4 text-primary" />}>
			<List items={smells} spacing="sm" emptyText="No specific smells noted." />
		</InfoCard>

		<InfoCard title="Weather" icon={<Icons.Cloud className="h-4 w-4 text-primary" />}>
			<List items={weather} spacing="sm" emptyText="No specific weather patterns noted." />
		</InfoCard>

		<InfoCard title="Descriptors" icon={<Icons.Quote className="h-4 w-4 text-primary" />}>
			<List items={descriptors} spacing="sm" emptyText="No descriptors listed." />
		</InfoCard>

		<InfoCard title="Creative Prompts" icon={<Icons.Lightbulb className="h-4 w-4 text-primary" />}>
			<List items={creativePrompts} spacing="sm" emptyText="No creative prompts available." />
		</InfoCard>
		<InfoCard title="Intended Site Function" icon={<Icons.Puzzle className="h-4 w-4 text-primary" />}>
			<p className="text-sm text-muted-foreground">{intendedSiteFunction}</p>
		</InfoCard>
		<InfoCard title="GM Notes" icon={<Icons.Scroll className="h-4 w-4 text-primary" />}>
			<List items={gmNotes} spacing="sm" emptyText="No GM notes available." />
		</InfoCard>
	</div>
)
