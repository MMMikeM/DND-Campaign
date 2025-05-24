import * as Icons from "lucide-react"
import React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"

export function CultureContent(faction: Faction) {
	return (
		<>
			{faction.culture.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{faction.culture.map((culture) => (
						<React.Fragment key={`culture-${culture.id}`}>
							<InfoCard
								title="Symbols"
								icon={<Icons.Fingerprint className="h-4 w-4 mr-2 text-primary" />}
								emptyMessage="No symbols information available"
							>
								<List items={culture.symbols} />
							</InfoCard>

							<InfoCard
								title="Rituals"
								icon={<Icons.Calendar className="h-4 w-4 mr-2 text-primary" />}
								emptyMessage="No rituals information available"
							>
								<List items={culture.rituals} />
							</InfoCard>

							<InfoCard
								title="Taboos"
								icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-primary" />}
								emptyMessage="No taboos information available"
							>
								<List items={culture.taboos} />
							</InfoCard>

							<InfoCard
								title="Aesthetics"
								icon={<Icons.Palette className="h-4 w-4 mr-2 text-primary" />}
								emptyMessage="No aesthetics information available"
							>
								<List items={culture.aesthetics} />
							</InfoCard>

							<InfoCard
								title="Jargon"
								icon={<Icons.Languages className="h-4 w-4 mr-2 text-primary" />}
								emptyMessage="No jargon information available"
							>
								<List items={culture.jargon} />
							</InfoCard>

							<InfoCard
								title="Recognition Signs"
								icon={<Icons.Eye className="h-4 w-4 mr-2 text-primary" />}
								emptyMessage="No recognition signs information available"
							>
								<List items={culture.recognitionSigns} />
							</InfoCard>
						</React.Fragment>
					))}
				</div>
			) : (
				<div className="py-12 text-center border rounded-lg bg-slate-50 dark:bg-slate-900">
					<Icons.AlertCircle className="h-10 w-10 mx-auto text-slate-400 mb-3" />
					<p className="text-muted-foreground">No cultural information available for this faction.</p>
				</div>
			)}
		</>
	)
}
