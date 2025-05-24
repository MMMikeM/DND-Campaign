import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Badge } from "~/components/ui/badge"
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
		<div className="grid grid-cols-1 gap-6 ">
			{twists.map(({ twistType, creativePrompts, description, impact, narrativePlacement, id }) => (
				<InfoCard key={id} title={twistType} icon={getTwistTypeIcon(twistType)} className="h-full">
					<div>
						<div className="flex justify-end mb-3">
							<div className="flex gap-2">
								<Badge variant={impact === "major" ? "destructive" : impact === "moderate" ? "default" : "outline"}>
									{impact}
								</Badge>
								<Badge variant="secondary">{narrativePlacement}</Badge>
							</div>
						</div>

						<p className="text-sm text-muted-foreground mb-4">
							{impact === "major"
								? "Game-changing plot twist"
								: impact === "moderate"
									? "Significant development"
									: "Minor story twist"}
						</p>

						<List
							items={description}
							spacing="sm"
							textColor="default"
							bulletColor={
								twistType === "betrayal"
									? "red"
									: twistType === "revelation"
										? "blue"
										: twistType === "reversal"
											? "amber"
											: "purple"
							}
						/>

						<div className="mt-4 pt-2 border-t">
							<h4 className="text-xs font-medium text-muted-foreground mb-2">GM Notes:</h4>
							<List
								items={creativePrompts}
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

export { TwistsContent }
