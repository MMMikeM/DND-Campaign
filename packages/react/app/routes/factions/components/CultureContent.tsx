import * as Icons from "lucide-react"
import React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"

export function CultureContent({
	aesthetics,
	jargon,
	recognitionSigns,
	taboos,
	symbols,
	rituals,
}: Pick<Faction, "aesthetics" | "jargon" | "recognitionSigns" | "taboos" | "symbols" | "rituals">) {
	return (
		<>
			<InfoCard
				title="Symbols"
				icon={<Icons.Fingerprint className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No symbols information available"
			>
				<List items={symbols} />
			</InfoCard>

			<InfoCard
				title="Rituals"
				icon={<Icons.Calendar className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No rituals information available"
			>
				<List items={rituals} />
			</InfoCard>

			<InfoCard
				title="Taboos"
				icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No taboos information available"
			>
				<List items={taboos} />
			</InfoCard>

			<InfoCard
				title="Aesthetics"
				icon={<Icons.Palette className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No aesthetics information available"
			>
				<List items={aesthetics} />
			</InfoCard>

			<InfoCard
				title="Jargon"
				icon={<Icons.Languages className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No jargon information available"
			>
				<List items={jargon} />
			</InfoCard>

			<InfoCard
				title="Recognition Signs"
				icon={<Icons.Eye className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No recognition signs information available"
			>
				<List items={recognitionSigns} />
			</InfoCard>
		</>
	)
}
