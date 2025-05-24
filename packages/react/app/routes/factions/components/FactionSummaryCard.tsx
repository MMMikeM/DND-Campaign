import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Link } from "~/components/ui/link"

interface FactionSummaryCardProps {
	faction: {
		name: string
		slug: string
		type: string
		alignment: string
		size: string
		publicGoal: string
	}
}

export function FactionSummaryCard({ faction }: FactionSummaryCardProps) {
	if (!faction) {
		return null
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Link href={`/factions/${faction.slug}`}>{faction.name}</Link>
				</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="flex flex-wrap gap-2 mb-4">
					<span className="text-sm text-muted-foreground">{faction.type}</span>
					<span className="text-sm text-muted-foreground">{faction.alignment}</span>
					<span className="text-sm text-muted-foreground">{faction.size}</span>
				</div>

				<p className="text-sm">{faction.publicGoal}</p>
			</CardContent>

			<CardFooter>
				<Link href={`/factions/${faction.slug}`} className="text-sm">
					View Details →
				</Link>
			</CardFooter>
		</Card>
	)
}
