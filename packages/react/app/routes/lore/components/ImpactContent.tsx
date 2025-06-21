import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Lore } from "~/lib/entities"

type ImpactContentProps = Pick<
	Lore,
	"modernRelevance" | "aesthetics_and_symbols" | "interactions_and_rules" | "conflicting_narratives"
>

export function ImpactContent({
	modernRelevance,
	aesthetics_and_symbols,
	interactions_and_rules,
	conflicting_narratives,
}: ImpactContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard title="Modern Relevance" icon={<Icons.TrendingUp className="h-4 w-4 mr-2" />}>
					{modernRelevance}
				</InfoCard>
				<InfoCard title="Aesthetics & Symbols" icon={<Icons.Palette className="h-4 w-4 mr-2" />}>
					<List items={aesthetics_and_symbols} />
				</InfoCard>
			</div>
			<div className="space-y-6">
				<InfoCard title="Interactions & Rules" icon={<Icons.Gavel className="h-4 w-4 mr-2" />}>
					<List items={interactions_and_rules} />
				</InfoCard>
				<InfoCard title="Conflicting Narratives" icon={<Icons.GitBranch className="h-4 w-4 mr-2" />}>
					<List items={conflicting_narratives} />
				</InfoCard>
			</div>
		</div>
	)
}
