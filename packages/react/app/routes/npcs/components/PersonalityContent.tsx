import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

export function PersonalityContent({ personalityTraits, biases, drives, fears, mannerisms, voiceNotes }: NPC) {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<InfoCard
					title="Personality Traits"
					icon={<Icons.UserCircle className="h-4 w-4 mr-2 text-indigo-600" />}
					emptyMessage="No personality traits specified."
				>
					<List items={personalityTraits} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Biases"
					icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No biases specified."
				>
					<List items={biases} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<InfoCard
					title="Drives"
					icon={<Icons.Brain className="h-4 w-4 mr-2 text-purple-600" />}
					emptyMessage="No drives specified."
				>
					<List items={drives} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Fears"
					icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-red-500" />}
					emptyMessage="No fears specified."
				>
					<List items={fears} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard
					title="Mannerisms"
					icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No mannerisms specified."
				>
					<List items={mannerisms} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Voice Notes"
					icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />}
					emptyMessage="No voice notes specified."
				>
					<List items={voiceNotes} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>
		</>
	)
}
