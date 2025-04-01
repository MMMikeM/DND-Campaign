import React from "react"
import { NavLink } from "react-router"
import * as Icons from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { List } from "~/components/List"
import { SimpleCard } from "~/components/SimpleCard"
import type { NPC } from "~/lib/entities"
import { Link } from "~/components/ui/link"
import {
	Ban,
	Book,
	Brain,
	Building,
	CalendarClock,
	ExternalLink,
	FileText,
	HandMetal,
	HeartHandshake,
	MessagesSquare,
	User,
	Users,
} from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Badge } from "~/components/ui/badge"

// Helper functions for badge variants
export const getTrustLevelVariant = (level: string) => {
	switch (level) {
		case "high":
			return "default"
		case "medium":
			return "secondary"
		case "low":
			return "outline"
		case "none":
			return "destructive"
		default:
			return "outline"
	}
}

export const getWealthVariant = (wealth: string) => {
	switch (wealth) {
		case "wealthy":
		case "rich":
			return "default"
		case "moderate":
			return "secondary"
		case "poor":
		case "destitute":
			return "destructive"
		default:
			return "outline"
	}
}

export const getAlignmentVariant = (alignment: string) => {
	if (alignment.includes("good")) return "default"
	if (alignment.includes("evil")) return "destructive"
	return "secondary"
}

export const getAdaptabilityVariant = (adaptability: string) => {
	switch (adaptability) {
		case "opportunistic":
		case "flexible":
			return "default"
		case "reluctant":
			return "secondary"
		case "rigid":
			return "destructive"
		default:
			return "outline"
	}
}

export const getRelationshipStrengthVariant = (strength: string) => {
	switch (strength) {
		case "unbreakable":
		case "strong":
			return "default"
		case "moderate":
			return "secondary"
		case "weak":
			return "outline"
		default:
			return "outline"
	}
}

export const getRelationshipTypeVariant = (type: string) => {
	switch (type) {
		case "ally":
			return "default"
		case "neutral":
			return "secondary"
		case "enemy":
			return "destructive"
		default:
			return "outline"
	}
}

// NPC Header component
export const NpcHeader: React.FC<{
	name: string
	race: string
	occupation: string
	gender: string
	alignment: string
}> = ({ name, race, occupation, gender, alignment }) => (
	<div className="mb-6">
		<h1 className="text-3xl font-bold flex items-center">
			<Icons.User className="h-6 w-6 mr-3 text-indigo-500" />
			{name}
		</h1>
		<div className="flex flex-wrap gap-2 mt-2">
			<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character race">
				<Icons.UserCircle className="h-3.5 w-3.5 mr-1" />
				{race}
			</BadgeWithTooltip>
			<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character's occupation">
				<Icons.Briefcase className="h-3.5 w-3.5 mr-1" />
				{occupation}
			</BadgeWithTooltip>
			<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character gender">
				<Icons.User className="h-3.5 w-3.5 mr-1" />
				{gender}
			</BadgeWithTooltip>
			<BadgeWithTooltip
				variant={getAlignmentVariant(alignment)}
				className="flex items-center"
				tooltipContent="Moral compass and ethical stance"
			>
				<Icons.Heart className="h-3.5 w-3.5 mr-1" />
				{alignment}
			</BadgeWithTooltip>
		</div>
	</div>
)

// Overview Card component
export const OverviewCard: React.FC<{
	name: string
	appearance: string[]
	background: string[]
	attitude: string
	socialStatus: string
	age: string
	personality: string[]
}> = ({ name, appearance, background, attitude, socialStatus, age, personality }) => (
	<Card className="mb-6">
		<CardHeader>
			<CardTitle className="text-xl">Overview</CardTitle>
			<CardDescription>Essential information about {name}</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="space-y-4">
				{appearance && appearance.length > 0 && (
					<div>
						<List
							heading="Appearance"
							items={appearance}
							position="outside"
							spacing="sm"
							textColor="muted"
							icon={<Icons.Eye className="h-4 w-4 mr-2" />}
						/>
					</div>
				)}

				{background && background.length > 0 && (
					<div className="border-t pt-4">
						<List
							heading="Background"
							items={background}
							position="outside"
							spacing="sm"
							textColor="muted"
							icon={<Icons.BookOpen className="h-4 w-4 mr-2" />}
						/>
					</div>
				)}

				<div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2 flex items-center">
							<Icons.Info className="h-4 w-4 mr-2" />
							Characteristics
						</h3>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Age:</span>
								<span className="text-sm">{age}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Attitude:</span>
								<span className="text-sm">{attitude}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Social Status:</span>
								<span className="text-sm">{socialStatus}</span>
							</div>
						</div>
					</div>

					{personality && personality.length > 0 && (
						<div>
							<h3 className="font-medium mb-2 flex items-center">
								<Icons.User className="h-4 w-4 mr-2" />
								Personality Traits
							</h3>
							<ul className="list-disc list-inside space-y-1">
								{personality.map((trait) => (
									<li key={`trait-${trait}`} className="text-sm text-muted-foreground">
										{trait}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</CardContent>
	</Card>
)

export function RelationshipsCard({ npc }: { npc: NPC }) {
	if (!npc.relations || npc.relations.length === 0) {
		return null
	}

	return (
		<SimpleCard
			title="Relationships"
			icon={<Icons.Users className="h-4 w-4 mr-2" />}
			description="Connections with other NPCs"
		>
			<div className="space-y-3">
				{npc.relations.map((relation) => (
					<div key={`relationship-${relation.id}`} className="border rounded-md p-3">
						<div className="flex justify-between items-center">
							<div>
								<span className="text-sm font-medium">
									<NavLink to={`/npcs/${relation.npc?.slug}`} className="hover:text-indigo-500">
										{relation.npc?.name}
									</NavLink>
								</span>
							</div>
							<div className="flex space-x-2">
								<BadgeWithTooltip tooltipContent={`Relationship type`}>{relation.type}</BadgeWithTooltip>
								<BadgeWithTooltip tooltipContent={`Strength`}>{relation.strength}</BadgeWithTooltip>
							</div>
						</div>
					</div>
				))}
			</div>
		</SimpleCard>
	)
}

// Update the DialogueCard component to use better keys
export const DialogueCard: React.FC<{
	dialogue: string[]
}> = ({ dialogue }) => {
	if (!dialogue || dialogue.length === 0) {
		return null
	}

	return (
		<SimpleCard
			title="Dialogue Examples"
			icon={<Icons.MessageSquare className="h-4 w-4" />}
			description="Sample dialogue this NPC might say"
		>
			<div className="space-y-2">
				{dialogue.map((line, index) => (
					<div key={`dialogue-${index}-${line.slice(0, 10)}`} className="flex items-start space-x-2">
						<Icons.Quote className="h-4 w-4 mt-1 text-muted-foreground" />
						<p className="text-sm text-muted-foreground italic">{line}</p>
					</div>
				))}
			</div>
		</SimpleCard>
	)
}

// Update the TraitsCard component to use better keys
export const TraitsCard: React.FC<{
	personalityTraits: string[]
}> = ({ personalityTraits }) => {
	if (!personalityTraits || personalityTraits.length === 0) {
		return null
	}

	return (
		<SimpleCard
			title="Personality Traits"
			icon={<Icons.Fingerprint className="h-4 w-4" />}
			description="Defining traits of this character"
		>
			<div className="space-y-2">
				{personalityTraits.map((trait, index) => (
					<div key={`trait-${index}-${trait.slice(0, 10)}`} className="flex items-start space-x-2">
						<Icons.HandMetal className="h-4 w-4 mt-1 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">{trait}</p>
					</div>
				))}
			</div>
		</SimpleCard>
	)
}

// Conversation Card component
export const ConversationCard: React.FC<{
	preferredTopics: string[]
	avoidTopics: string[]
}> = ({ preferredTopics, avoidTopics }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.MessageCircle className="h-4 w-4 mr-2" />
				Conversation Topics
			</CardTitle>
			<CardDescription>What this character likes to talk about</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{preferredTopics && preferredTopics.length > 0 && (
					<div>
						<List
							heading="Preferred Topics"
							items={preferredTopics}
							position="outside"
							spacing="sm"
							textColor="muted"
							icon={<Icons.ThumbsUp className="h-4 w-4 mr-2 text-green-500" />}
						/>
					</div>
				)}

				{avoidTopics && avoidTopics.length > 0 && (
					<div>
						<List
							heading="Avoids Discussing"
							items={avoidTopics}
							position="outside"
							spacing="sm"
							textColor="muted"
							icon={<Icons.ThumbsDown className="h-4 w-4 mr-2 text-red-500" />}
						/>
					</div>
				)}
			</div>
		</CardContent>
	</Card>
)

// Motives Card component
export const MotivesCard: React.FC<{
	drives: string[]
	fears: string[]
	biases: string[]
}> = ({ drives, fears, biases }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.Compass className="h-4 w-4 mr-2" />
				Motivations & Fears
			</CardTitle>
			<CardDescription>What drives and scares this character</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{drives && drives.length > 0 && (
					<div>
						<List
							heading="Primary Drives"
							items={drives}
							position="outside"
							spacing="sm"
							textColor="muted"
							icon={<Icons.Rocket className="h-4 w-4 mr-2 text-indigo-500" />}
						/>
					</div>
				)}

				{fears && fears.length > 0 && (
					<div>
						<List
							heading="Fears"
							items={fears}
							position="outside"
							spacing="sm"
							textColor="muted"
							icon={<Icons.ShieldAlert className="h-4 w-4 mr-2 text-amber-500" />}
						/>
					</div>
				)}

				{biases && biases.length > 0 && (
					<div>
						<List
							heading="Biases"
							items={biases}
							position="outside"
							spacing="sm"
							textColor="muted"
							icon={<Icons.Filter className="h-4 w-4 mr-2" />}
						/>
					</div>
				)}
			</div>
		</CardContent>
	</Card>
)

// Knowledge & Secrets Card component
export const KnowledgeCard: React.FC<{
	knowledge: string[]
	secrets: string[]
	rumors: string[]
}> = ({ knowledge, secrets, rumors }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.BookOpen className="h-4 w-4 mr-2" />
				Knowledge & Secrets
			</CardTitle>
			<CardDescription>What this character knows and hides</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="space-y-6">
				{knowledge && knowledge.length > 0 && (
					<List
						heading="Knowledge"
						items={knowledge}
						position="outside"
						spacing="sm"
						textColor="muted"
						icon={<Icons.Brain className="h-4 w-4 mr-2" />}
					/>
				)}

				{rumors && rumors.length > 0 && (
					<List
						heading="Rumors"
						items={rumors}
						position="outside"
						spacing="sm"
						textColor="muted"
						icon={<Icons.MessageSquare className="h-4 w-4 mr-2" />}
					/>
				)}

				{secrets && secrets.length > 0 && (
					<div className="border-t pt-4">
						<h3 className="font-medium mb-2 flex items-center text-red-500">
							<Icons.Lock className="h-4 w-4 mr-2" />
							Secrets
						</h3>
						<div className="space-y-2 border-2 border-dashed border-red-200 p-4 bg-red-50 dark:bg-red-950/20">
							<List
								items={secrets}
								position="outside"
								spacing="sm"
								textColor="muted"
								icon={<Icons.LockKeyhole className="h-4 w-4 mr-2 text-red-500" />}
							/>
						</div>
					</div>
				)}
			</div>
		</CardContent>
	</Card>
)

// Factions Card component
export const FactionsCard: React.FC<{
	relatedFactions: NPC["relatedFactions"]
}> = ({ relatedFactions }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.Flag className="h-4 w-4 mr-2" />
				Faction Affiliations
			</CardTitle>
			<CardDescription>Organizations this character is connected to</CardDescription>
		</CardHeader>
		<CardContent>
			{relatedFactions && relatedFactions.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{relatedFactions.map((factionRelation) => (
						<div key={factionRelation.id} className="border rounded p-4">
							{factionRelation.faction && (
								<Link href={`/factions/${factionRelation.faction.slug}`}>
									<h3 className="font-medium flex items-center">
										<Icons.Flag className="h-4 w-4 mr-2 text-indigo-500" />
										{factionRelation.faction.name}
									</h3>
								</Link>
							)}
							<div className="flex gap-2 mt-1">
								<BadgeWithTooltip variant="secondary" tooltipContent="Role in the faction">
									{factionRelation.role}
								</BadgeWithTooltip>
								<BadgeWithTooltip
									variant={
										factionRelation.loyalty === "high"
											? "default"
											: factionRelation.loyalty === "medium"
												? "secondary"
												: "outline"
									}
									tooltipContent="Level of loyalty to the faction"
								>
									Loyalty: {factionRelation.loyalty}
								</BadgeWithTooltip>
								<BadgeWithTooltip variant="outline" tooltipContent="Official rank or title">
									{factionRelation.rank}
								</BadgeWithTooltip>
							</div>
							<div className="mt-3">
								<p className="text-sm text-muted-foreground">{factionRelation.justification}</p>
							</div>
							{factionRelation.secrets && factionRelation.secrets.length > 0 && (
								<div className="mt-3 border-t pt-3">
									<h4 className="text-sm font-medium mb-1 flex items-center text-red-500">
										<Icons.Lock className="h-3.5 w-3.5 mr-1" />
										Faction Secrets
									</h4>
									<List
										items={factionRelation.secrets}
										position="outside"
										spacing="sm"
										textColor="muted"
										icon={<Icons.AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-6 text-muted-foreground">
					<p>No faction affiliations</p>
				</div>
			)}
		</CardContent>
	</Card>
)

// Quests Card component
export const QuestsCard: React.FC<{
	relatedQuests: NPC["relatedQuests"]
}> = ({ relatedQuests }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.Scroll className="h-4 w-4 mr-2" />
				Involved Quests
			</CardTitle>
			<CardDescription>Adventures this character is part of</CardDescription>
		</CardHeader>
		<CardContent>
			{relatedQuests && relatedQuests.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{relatedQuests.map((questRelation) => (
						<div key={questRelation.id} className="border rounded p-4">
							{questRelation.quest && (
								<Link href={`/quests/${questRelation.quest.slug}`}>
									<h3 className="font-medium flex items-center">
										<Icons.Scroll className="h-4 w-4 mr-2 text-indigo-500" />
										{questRelation.quest.name}
									</h3>
								</Link>
							)}
							<div className="flex gap-2 mt-1">
								<BadgeWithTooltip variant="secondary" tooltipContent="Role in the quest">
									{questRelation.role}
								</BadgeWithTooltip>
								<BadgeWithTooltip
									variant={
										questRelation.importance === "critical"
											? "destructive"
											: questRelation.importance === "major"
												? "default"
												: "outline"
									}
									tooltipContent="Importance to the quest"
								>
									{questRelation.importance}
								</BadgeWithTooltip>
							</div>
							<div className="mt-3">
								<List items={questRelation.description} textColor="muted" />
							</div>
							{questRelation.hiddenAspects && questRelation.hiddenAspects.length > 0 && (
								<div className="mt-3 border-t pt-3">
									<h4 className="text-sm font-medium mb-1 flex items-center text-red-500">
										<Icons.EyeOff className="h-3.5 w-3.5 mr-1" />
										Hidden Aspects
									</h4>
									<List
										items={questRelation.hiddenAspects}
										position="outside"
										spacing="sm"
										textColor="muted"
										icon={<Icons.Lock className="h-3.5 w-3.5 mr-1 text-red-500" />}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-6 text-muted-foreground">
					<p>No quest involvements</p>
				</div>
			)}
		</CardContent>
	</Card>
)

// Locations Card component
export const LocationsCard: React.FC<{
	relatedLocations: NPC["relatedLocations"]
}> = ({ relatedLocations }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.MapPin className="h-4 w-4 mr-2" />
				Locations
			</CardTitle>
			<CardDescription>Places where this character can be found</CardDescription>
		</CardHeader>
		<CardContent>
			{relatedLocations && relatedLocations.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{relatedLocations.map((locationRelation) => (
						<div key={locationRelation.id} className="border rounded p-4">
							{locationRelation.location && (
								<div>
									<Link href={`/locations/${locationRelation.location.slug}`}>
										<h3 className="font-medium flex items-center">
											<Icons.MapPin className="h-4 w-4 mr-2 text-indigo-500" />
											{locationRelation.location.name}
										</h3>
									</Link>
									{locationRelation.location.region && (
										<Link
											href={`/regions/${locationRelation.location.region.slug}`}
											className="text-sm text-muted-foreground hover:text-primary"
										>
											<span className="flex items-center mt-1">
												<Icons.Map className="h-3.5 w-3.5 mr-1" />
												{locationRelation.location.region.name}
											</span>
										</Link>
									)}
								</div>
							)}
							<div className="mt-3">
								<List items={locationRelation.description} textColor="muted" />
							</div>
							{locationRelation.creativePrompts && locationRelation.creativePrompts.length > 0 && (
								<div className="mt-3">
									<List
										heading="Scene Ideas"
										items={locationRelation.creativePrompts}
										position="outside"
										spacing="sm"
										textColor="muted"
										icon={<Icons.Sparkles className="h-3.5 w-3.5 mr-1" />}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-6 text-muted-foreground">
					<p>No associated locations</p>
				</div>
			)}
		</CardContent>
	</Card>
)

// Items Card component
export const ItemsCard: React.FC<{
	relatedItems: NPC["relatedItems"]
}> = ({ relatedItems }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.Package className="h-4 w-4 mr-2" />
				Items & Possessions
			</CardTitle>
			<CardDescription>Notable objects this character owns or seeks</CardDescription>
		</CardHeader>
		<CardContent>
			{relatedItems && relatedItems.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{relatedItems.map((item) => (
						<div key={item.id} className="border rounded p-4">
							<h3 className="font-medium flex items-center">
								<Icons.Package className="h-4 w-4 mr-2 text-amber-500" />
								{item.name}
							</h3>
							<BadgeWithTooltip variant="outline" className="mt-1" tooltipContent={`Item type`}>
								{item.type}
							</BadgeWithTooltip>
							{item.significance && <p className="text-sm mt-2 text-muted-foreground">{item.significance}</p>}
							<List
								heading="Description"
								items={item.description}
								position="outside"
								spacing="sm"
								textColor="muted"
								className="mt-3"
							/>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-6 text-muted-foreground">
					<p>No notable items</p>
				</div>
			)}
		</CardContent>
	</Card>
)
