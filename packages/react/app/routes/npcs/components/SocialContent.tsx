import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

interface SocialContentProps {
	npc: NPC
}

export function SocialContent({ npc }: SocialContentProps) {
	const { dialogue, rumours, preferredTopics, avoidTopics } = npc

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<InfoCard
					title="Dialogue"
					icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No dialogue specified."
				>
					{dialogue && dialogue.length > 0 && (
						<>
							<p className="text-sm text-muted-foreground mb-4">Characteristic phrases and speech patterns</p>
							<List items={dialogue} spacing="sm" textColor="muted" />
						</>
					)}
				</InfoCard>

				<InfoCard
					title="Rumors"
					icon={<Icons.MessagesSquare className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No rumors specified."
				>
					{rumours && rumours.length > 0 && (
						<>
							<p className="text-sm text-muted-foreground mb-4">What others say about this character</p>
							<List items={rumours} spacing="sm" textColor="muted" />
						</>
					)}
				</InfoCard>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard
					title="Preferred Topics"
					icon={<Icons.ThumbsUp className="h-4 w-4 mr-2 text-emerald-600" />}
					emptyMessage="No preferred topics specified."
				>
					{preferredTopics && preferredTopics.length > 0 && (
						<>
							<p className="text-sm text-muted-foreground mb-4">Subjects this NPC enjoys discussing</p>
							<List items={preferredTopics} spacing="sm" textColor="muted" />
						</>
					)}
				</InfoCard>

				<InfoCard
					title="Avoided Topics"
					icon={<Icons.ThumbsDown className="h-4 w-4 mr-2 text-red-500" />}
					emptyMessage="No avoided topics specified."
				>
					{avoidTopics && avoidTopics.length > 0 && (
						<>
							<p className="text-sm text-muted-foreground mb-4">Subjects this NPC dislikes discussing</p>
							<List items={avoidTopics} spacing="sm" textColor="muted" />
						</>
					)}
				</InfoCard>
			</div>
		</>
	)
}
