import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Lore } from "~/lib/entities"

type DetailsContentProps = Pick<
	Lore,
	| "summary"
	| "surfaceImpression"
	| "livedReality"
	| "hiddenTruths"
	| "core_tenets_and_traditions"
	| "history_and_legacy"
>

export function DetailsContent({
	summary,
	surfaceImpression,
	livedReality,
	hiddenTruths,
	core_tenets_and_traditions,
	history_and_legacy,
}: DetailsContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard title="Summary" icon={<Icons.ScrollText className="h-4 w-4 mr-2" />}>
					<p className="text-sm text-muted-foreground">{summary}</p>
				</InfoCard>
				<InfoCard title="Surface Impression" icon={<Icons.Eye className="h-4 w-4 mr-2" />}>
					<p className="text-sm text-muted-foreground">{surfaceImpression}</p>
				</InfoCard>
				<InfoCard title="Lived Reality" icon={<Icons.Users className="h-4 w-4 mr-2" />}>
					<p className="text-sm text-muted-foreground">{livedReality}</p>
				</InfoCard>
				<p className="text-sm text-muted-foreground">{hiddenTruths}</p>
			</div>
			<div className="space-y-6">
				<InfoCard title="Core Tenets & Traditions" icon={<Icons.BookOpen className="h-4 w-4 mr-2" />}>
					<List items={core_tenets_and_traditions} />
				</InfoCard>
				<InfoCard title="History & Legacy" icon={<Icons.Landmark className="h-4 w-4 mr-2" />}>
					<List items={history_and_legacy} />
				</InfoCard>
			</div>
		</div>
	)
}
