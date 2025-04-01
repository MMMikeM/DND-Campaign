import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"

interface LoreContentProps {
	region: Region
}

export const LoreContent: React.FC<LoreContentProps> = ({ region }) => {
	const { history, secrets } = region

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Secrets"
				icon={<Icons.Lock className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No secrets uncovered yet"
			>
				<List items={secrets} spacing="sm" textColor="default" emptyText="No secrets uncovered yet" />
			</InfoCard>

			<InfoCard title="History" icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-primary" />}>
				<p className="whitespace-pre-line">{history}</p>
			</InfoCard>
		</div>
	)
}

export default LoreContent
