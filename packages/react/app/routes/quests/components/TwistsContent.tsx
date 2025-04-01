import React from "react"
import * as Icons from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { List } from "~/components/List"
import { InfoCard } from "~/components/InfoCard"
import type { Quest } from "~/lib/entities"

interface TwistsContentProps {
	quest: Quest
}

export const TwistsContent: React.FC<TwistsContentProps> = ({ quest }) => {
	const { twists } = quest

	const getTwistTypeIcon = (type: string) => {
		switch (type) {
			case "reversal":
				return <Icons.RefreshCw className="h-4 w-4 text-orange-500" />
			case "revelation":
				return <Icons.BookOpen className="h-4 w-4 text-blue-500" />
			case "betrayal":
				return <Icons.Skull className="h-4 w-4 text-red-500" />
			case "complication":
				return <Icons.AlertTriangle className="h-4 w-4 text-amber-500" />
			default:
				return <Icons.HelpCircle className="h-4 w-4" />
		}
	}

	if (!twists || twists.length === 0) {
		return (
			<div className="text-center p-12 text-muted-foreground">
				<Icons.Search className="h-10 w-10 mx-auto mb-4" />
				<h3 className="text-lg font-semibold mb-2">No twists defined</h3>
				<p>This quest doesn't have any plot twists defined yet.</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{twists.map((twist) => (
				<InfoCard
					key={twist.id}
					title={twist.twist_type.charAt(0).toUpperCase() + twist.twist_type.slice(1)}
					icon={getTwistTypeIcon(twist.twist_type)}
					className="h-full"
				>
					<div>
						<div className="flex justify-end mb-3">
							<div className="flex gap-2">
								<Badge
									variant={
										twist.impact === "major" ? "destructive" : twist.impact === "moderate" ? "default" : "outline"
									}
								>
									{twist.impact}
								</Badge>
								<Badge variant="secondary">{twist.narrative_placement}</Badge>
							</div>
						</div>

						<p className="text-sm text-muted-foreground mb-4">
							{twist.impact === "major"
								? "Game-changing plot twist"
								: twist.impact === "moderate"
									? "Significant development"
									: "Minor story twist"}
						</p>

						<List
							items={twist.description}
							spacing="sm"
							textColor="default"
							bulletColor={
								twist.twist_type === "betrayal"
									? "red"
									: twist.twist_type === "revelation"
										? "blue"
										: twist.twist_type === "reversal"
											? "amber"
											: "purple"
							}
						/>

						<div className="mt-4 pt-2 border-t">
							<h4 className="text-xs font-medium text-muted-foreground mb-2">GM Notes:</h4>
							<List
								items={twist.creativePrompts}
								spacing="sm"
								textColor="muted"
								icon={<Icons.Lightbulb className="h-4 w-4 mr-2 text-amber-500" />}
							/>
						</div>
					</div>
				</InfoCard>
			))}
		</div>
	)
}

export default TwistsContent
