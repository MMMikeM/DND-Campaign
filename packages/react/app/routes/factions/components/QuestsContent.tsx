import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Faction } from "~/lib/entities"

export function QuestsContent({ questParticipation, questHooks }: Pick<Faction, "questParticipation" | "questHooks">) {
	return (
		<InfoCard
			title="Related Quests"
			icon={<Icons.Scroll className="h-5 w-5 mr-2 text-amber-500" />}
			emptyMessage={`No quests associated`}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
				{questParticipation.map(
					({
						creativePrompts,
						description,
						faction,
						gmNotes,
						importanceInQuest,
						involvementDetails,
						npc,
						quest,
						roleInQuest,
						tags,
					}) => (
						<div key={`quest-${quest.id}`} className="border rounded p-4">
							<h4 className="font-medium">
								<NavLink to={`/quests/${quest.slug}`} className="hover:text-indigo-500">
									{quest.name}
								</NavLink>
							</h4>
							<BadgeWithTooltip className="mt-1" tooltipContent="How this faction participates in the quest">
								{roleInQuest}
							</BadgeWithTooltip>
							{npc && (
								<Link href={`/npcs/${npc.slug}`} className="text-sm text-indigo-500">
									{npc.name}
								</Link>
							)}
							{faction && (
								<Link href={`/factions/${faction.slug}`} className="text-sm text-indigo-500">
									{faction.name}
								</Link>
							)}

							<p>Importance in Quest: {importanceInQuest}</p>
							<List items={description} heading="Description" />
							<List items={creativePrompts} heading="Creative Prompts" />
							<List items={gmNotes} heading="GM Notes" />
							<List items={tags} heading="Tags" />
							<List items={involvementDetails} heading="Involvement Details" />
						</div>
					),
				)}
				{questHooks.map(
					({
						id,
						name,
						creativePrompts,
						description,
						gmNotes,
						tags,
						hookSourceType,
						hookType,
						presentationStyle,
						trustRequired,
						source,
						npcRelationshipToParty,
						dialogueHint,
						hookContent,
						discoveryConditions,
						faction,
						site,
						quest,
						deliveryNpc,
						slug,
					}) => (
						<div key={id} className="border rounded p-4">
							<Link href={`/quests/${slug}`} className="text-sm text-indigo-500">
								{name}
							</Link>
							<p>Hook Type: {hookType}</p>
							<p>Hook Source Type: {hookSourceType}</p>
							<p>Presentation Style: {presentationStyle}</p>
							<p>Trust Required: {trustRequired}</p>
							<p>Source: {source}</p>
							<p>NPC Relationship to Party: {npcRelationshipToParty}</p>
							<p>Dialogue Hint: {dialogueHint}</p>

							{faction && (
								<Link href={`/factions/${faction.slug}`} className="text-sm text-indigo-500">
									{faction.name}
								</Link>
							)}

							{site && (
								<Link href={`/locations/${site.slug}`} className="text-sm text-indigo-500">
									{site.name}
								</Link>
							)}
							{quest && (
								<Link href={`/quests/${quest.slug}`} className="text-sm text-indigo-500">
									{quest.name}
								</Link>
							)}

							{deliveryNpc && (
								<Link href={`/npcs/${deliveryNpc.slug}`} className="text-sm text-indigo-500">
									{deliveryNpc.name}
								</Link>
							)}

							<List items={description} heading="Description" />
							<List items={creativePrompts} heading="Creative Prompts" />
							<List items={gmNotes} heading="GM Notes" />
							<List items={hookContent} heading="Hook Content" />
							<List items={discoveryConditions} heading="Discovery Conditions" />
							<Tags tags={tags} />
						</div>
					),
				)}
			</div>
		</InfoCard>
	)
}
