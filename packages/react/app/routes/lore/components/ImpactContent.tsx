import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Lore } from "~/lib/entities"

type ImpactContentProps = Pick<
	Lore,
	"modernRelevance" | "aestheticsAndSymbols" | "interactionsAndRules" | "conflictingNarratives"
>

export function ImpactContent({
	modernRelevance,
	aestheticsAndSymbols,
	interactionsAndRules,
	conflictingNarratives,
}: ImpactContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard title="Modern Relevance" icon={<Icons.TrendingUp className="h-4 w-4 mr-2" />}>
					{modernRelevance}
				</InfoCard>
				<InfoCard title="Aesthetics & Symbols" icon={<Icons.Palette className="h-4 w-4 mr-2" />}>
					<List items={aestheticsAndSymbols} />
				</InfoCard>
			</div>
			<div className="space-y-6">
				<InfoCard title="Interactions & Rules" icon={<Icons.Gavel className="h-4 w-4 mr-2" />}>
					<List items={interactionsAndRules} />
				</InfoCard>
				<InfoCard title="Conflicting Narratives" icon={<Icons.GitBranch className="h-4 w-4 mr-2" />}>
					<List items={conflictingNarratives} />
				</InfoCard>
			</div>
		</div>
	)
}
