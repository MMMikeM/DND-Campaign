import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Button } from "~/components/ui/button"
import { Link } from "~/components/ui/link"
import { type Foreshadowing, getForeshadowing } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { getForeshadowingSubtletyVariant } from "./utils"

// --- Types and Interfaces ---

interface DetailsContentProps {
	item: Foreshadowing
}

interface ConnectionsContentProps {
	item: Foreshadowing
}

interface SourceTargetInfo {
	type: string
	href: string | null
	name: string
	icon: React.ReactNode
}

// --- Helper Functions ---

const getNarrativeWeightVariant = (weight: string): "default" | "destructive" | "outline" | "secondary" => {
	switch (weight) {
		case "crucial":
			return "destructive"
		case "major":
			return "default"
		case "supporting":
			return "secondary"
		case "minor":
		default:
			return "outline"
	}
}

// --- Loader ---

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const item = await getForeshadowing(params.slug)
	if (!item) {
		throw new Response("Foreshadowing item not found", { status: 404 })
	}

	return item
}

// --- Component Parts ---

export function Header({ name, type, subtlety }: Foreshadowing) {
	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Eye className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			<div className="flex flex-wrap gap-2 mt-2">
				<BadgeWithTooltip variant="outline" tooltipContent="Form of the foreshadowing" className="capitalize">
					<Icons.FileText className="h-3.5 w-3.5 mr-1" />
					{type}
				</BadgeWithTooltip>
				<BadgeWithTooltip
					variant={getForeshadowingSubtletyVariant(subtlety)}
					tooltipContent={`Subtlety: ${subtlety}`}
					className="capitalize"
				>
					<Icons.SignalLow className="h-3.5 w-3.5 mr-1" />
					{subtlety}
				</BadgeWithTooltip>
			</div>
		</div>
	)
}

function DetailsContent({ item }: DetailsContentProps) {
	const { description, discoveryCondition, subtlety, narrativeWeight, foreshadowsElement, type } = item

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard
					title="Description"
					icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No description provided."
				>
					<List items={description} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Discovery Conditions"
					icon={<Icons.Search className="h-4 w-4 mr-2 text-green-600" />}
					emptyMessage="No specific discovery conditions listed."
				>
					<List items={discoveryCondition} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<div className="space-y-6">
				<InfoCard title="Attributes" icon={<Icons.Info className="h-4 w-4 mr-2 text-indigo-600" />}>
					<div className="space-y-3 p-4">
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Type</span>
							<span className="text-muted-foreground text-sm capitalize">{type}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Subtlety</span>
							<BadgeWithTooltip
								variant={getForeshadowingSubtletyVariant(subtlety)}
								tooltipContent={`Subtlety: ${subtlety}`}
								className="capitalize"
							>
								{subtlety}
							</BadgeWithTooltip>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Narrative Weight</span>
							<BadgeWithTooltip
								variant={getNarrativeWeightVariant(narrativeWeight)}
								tooltipContent={`Narrative Weight: ${narrativeWeight}`}
								className="capitalize"
							>
								{narrativeWeight}
							</BadgeWithTooltip>
						</div>
					</div>
				</InfoCard>

				<InfoCard
					title="Foreshadowed Element"
					icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-yellow-600" />}
					emptyMessage="The specific element being foreshadowed is not defined."
				>
					<div className="p-4">
						<p className="text-sm text-muted-foreground">{foreshadowsElement}</p>
					</div>
				</InfoCard>
			</div>
		</div>
	)
}

function ConnectionsContent({ item }: ConnectionsContentProps) {
	const { sourceStage, sourceNpc, sourceFaction, targetQuest, targetTwist, targetNpc, targetArc } = item

	const source: SourceTargetInfo | null = sourceStage
		? {
				type: "Quest Stage",
				href: `/quests/${sourceStage.quest?.slug}/stages/${sourceStage.slug}`,
				name: `${sourceStage.quest?.name} - ${sourceStage.name}`,
				icon: <Icons.Milestone className="h-4 w-4 text-gray-500" />,
			}
		: sourceNpc
			? {
					type: "NPC",
					href: `/npcs/${sourceNpc.slug}`,
					name: sourceNpc.name,
					icon: <Icons.User className="h-4 w-4 text-gray-500" />,
				}
			: sourceFaction
				? {
						type: "Faction",
						href: `/factions/${sourceFaction.slug}`,
						name: sourceFaction.name,
						icon: <Icons.Flag className="h-4 w-4 text-gray-500" />,
					}
				: null

	const target: SourceTargetInfo | null = targetQuest
		? {
				type: "Quest",
				href: `/quests/${targetQuest.slug}`,
				name: targetQuest.name,
				icon: <Icons.Scroll className="h-4 w-4 text-gray-500" />,
			}
		: targetTwist
			? {
					type: "Quest Twist",
					href: null,
					name: `Twist ID: ${targetTwist.id} (${targetTwist.twistType})`,
					icon: <Icons.GitBranch className="h-4 w-4 text-gray-500" />,
				}
			: targetNpc
				? {
						type: "NPC",
						href: `/npcs/${targetNpc.slug}`,
						name: targetNpc.name,
						icon: <Icons.User className="h-4 w-4 text-gray-500" />,
					}
				: targetArc
					? {
							type: "Narrative Arc",
							href: `/narrative/${targetArc.slug}`,
							name: targetArc.name,
							icon: <Icons.Workflow className="h-4 w-4 text-gray-500" />,
						}
					: null

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{source ? (
				<div className="p-4 space-y-2">
					<div className="flex items-center space-x-2">
						<span className="font-medium text-sm">Source:</span> {source.icon}
						{source.href ? (
							<Link href={source.href} className="text-primary hover:underline text-sm">
								{source.type} - {source.name}
							</Link>
						) : (
							<span className="text-muted-foreground text-sm">{source.name}</span>
						)}
					</div>
				</div>
			) : null}

			{target ? (
				<div className="p-4 space-y-2">
					<div className="flex items-center space-x-2">
						<span className="font-medium text-sm"> Target: </span>
						{target.icon}
						{target.href ? (
							<Link href={target.href} className="text-primary hover:underline text-sm">
								{target.type} - {target.name}
							</Link>
						) : (
							<span className="text-muted-foreground text-sm">{target.name}</span>
						)}
					</div>
				</div>
			) : null}
		</div>
	)
}

// --- Main Component ---

export default function ForeshadowingDetail({ loaderData }: Route.ComponentProps) {
	const item = loaderData
	const { tab } = useParams()
	const activeTab = tab || "details"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/foreshadowing/${item.slug}/${value === "details" ? "" : value}`)
	}

	if (!item) {
		return <div>Error: Foreshadowing data could not be loaded.</div>
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6 space-y-6">
			<div className="flex justify-between items-center mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/foreshadowing" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Foreshadowing
					</NavLink>
				</Button>
			</div>
			<Header {...item} />
			<ConnectionsContent item={item} />
			<DetailsContent item={item} />
		</div>
	)
}
