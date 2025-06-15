import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Quest } from "~/lib/entities"

interface ThemesContentProps {
	quest: Quest
}

export const ThemesContent: React.FC<ThemesContentProps> = ({ quest }) => {
	const { themes, inspirations, creativePrompts } = quest

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Themes"
				icon={<Icons.Layers className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No themes defined"
			>
				<List items={themes} spacing="sm" icon={<Icons.Palette className="h-4 w-4 mr-2 text-indigo-500" />} />
			</InfoCard>

			<InfoCard
				title="Inspirations"
				icon={<Icons.Lightbulb className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No inspirations listed"
			>
				<List items={inspirations} spacing="sm" icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-amber-500" />} />
			</InfoCard>

			<InfoCard
				title="Creative Prompts"
				icon={<Icons.PenTool className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No creative prompts available"
				className="md:col-span-2"
			>
				<List items={creativePrompts} spacing="sm" icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-green-500" />} />
			</InfoCard>
		</div>
	)
}
