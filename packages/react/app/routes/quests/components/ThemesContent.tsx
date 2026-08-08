import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Quest } from "~/lib/entities"

type ThemesContentProps = Pick<
	Quest,
	| "creativePrompts"
	| "emotionalShape"
	| "eventType"
	| "impactSeverity"
	| "intendedRhythmEffect"
	| "narrativePlacement"
	| "primaryPlayerExperienceGoal"
>

export const ThemesContent = ({
	creativePrompts,
	emotionalShape,
	eventType,
	impactSeverity,
	intendedRhythmEffect,
	narrativePlacement,
	primaryPlayerExperienceGoal,
}: ThemesContentProps) => (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
		<InfoCard title="Player Experience Goal" icon={<Icons.Target className="h-4 w-4 mr-2 text-primary" />}>
			<p className="text-sm text-muted-foreground">{primaryPlayerExperienceGoal}</p>
		</InfoCard>

		<InfoCard title="Emotional Shape" icon={<Icons.Activity className="h-4 w-4 mr-2 text-primary" />}>
			<p className="text-sm text-muted-foreground capitalize">{emotionalShape}</p>
		</InfoCard>

		<InfoCard title="Narrative Placement" icon={<Icons.Map className="h-4 w-4 mr-2 text-primary" />}>
			<p className="text-sm text-muted-foreground capitalize">{narrativePlacement}</p>
		</InfoCard>

		<InfoCard title="Intended Rhythm Effect" icon={<Icons.AudioWaveform className="h-4 w-4 mr-2 text-primary" />}>
			<p className="text-sm text-muted-foreground capitalize">{intendedRhythmEffect}</p>
		</InfoCard>

		<InfoCard title="Event Type" icon={<Icons.Zap className="h-4 w-4 mr-2 text-primary" />}>
			<p className="text-sm text-muted-foreground capitalize">{eventType}</p>
		</InfoCard>

		<InfoCard title="Impact Severity" icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-primary" />}>
			<p className="text-sm text-muted-foreground capitalize">{impactSeverity}</p>
		</InfoCard>

		<InfoCard
			title="Creative Prompts"
			icon={<Icons.PenTool className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No creative prompts available"
			className="md:col-span-2"
		>
			<List items={creativePrompts} spacing="sm" />
		</InfoCard>
	</div>
)
