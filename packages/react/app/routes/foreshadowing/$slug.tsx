import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { ForeshadowingRef, type ForeshadowingSeed, sourceRefs, targetRefs } from "~/components/ForeshadowingList"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { buttonVariants } from "~/components/ui/button"
import { Link } from "~/components/ui/link"
import { type Foreshadowing, getForeshadowing } from "~/lib/entities"
import { orNotFound } from "~/lib/errors"
import type { Route } from "./+types/$slug"
import { getForeshadowingSubtletyVariant } from "./utils"

export async function loader({ params }: Route.LoaderArgs) {
	return orNotFound(getForeshadowing(params.slug))
}

export default function ForeshadowingDetail({ loaderData }: Route.ComponentProps) {
	const {
		creativePrompts,
		description,
		incomingLoreLinks,
		name,
		narrativeWeight,
		subtlety,
		suggestedDeliveryMethods,
		tags,
	} = loaderData
	const seed: ForeshadowingSeed = loaderData
	const sources = sourceRefs.filter(({ key }) => seed[key])
	const targets = targetRefs.filter(({ key }) => seed[key])

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<NavLink to="/foreshadowing" className={buttonVariants({ variant: "outline", size: "sm" })}>
					<Icons.ChevronLeft className="h-4 w-4 mr-2" />
					Back to Foreshadowing
				</NavLink>
			</div>

			<Header name={name} subtlety={subtlety} narrativeWeight={narrativeWeight} />

			<Tags tags={tags} variant="secondary" maxDisplay={8} className="my-6" />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard
					title="Description"
					icon={<Icons.FileText className="h-4 w-4 mr-2 text-primary" />}
					emptyMessage="No description provided."
					className="md:col-span-2"
				>
					{description.length > 0 && <List items={description} />}
				</InfoCard>

				<InfoCard
					title="Planted Via"
					icon={<Icons.ArrowLeftCircle className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No source recorded."
				>
					{sources.map((config) => (
						<div key={config.key} className="border-b last:border-0 p-3">
							<ForeshadowingRef seed={seed} config={config} />
						</div>
					))}
				</InfoCard>

				<InfoCard
					title="Hints At"
					icon={<Icons.ArrowRightCircle className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No target recorded."
				>
					{targets.map((config) => (
						<div key={config.key} className="border-b last:border-0 p-3">
							<ForeshadowingRef seed={seed} config={config} />
						</div>
					))}
				</InfoCard>

				<InfoCard
					title="Suggested Delivery"
					icon={<Icons.Send className="h-4 w-4 mr-2 text-primary" />}
					emptyMessage="No delivery methods suggested."
				>
					{suggestedDeliveryMethods.length > 0 && (
						<List items={suggestedDeliveryMethods} spacing="sm" className="capitalize" />
					)}
				</InfoCard>

				<InfoCard
					title="Creative Prompts"
					icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-primary" />}
					emptyMessage="No creative prompts."
				>
					{creativePrompts.length > 0 && <List items={creativePrompts} spacing="sm" />}
				</InfoCard>

				<InfoCard
					title="Lore Links"
					icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-primary" />}
					emptyMessage="No lore links to this foreshadowing."
					className="md:col-span-2"
				>
					{incomingLoreLinks.map(({ id, lore, linkRoleOrTypeText, linkDetailsText, description }) => (
						<div key={`lore-${id}`} className="border-b last:border-0 p-3">
							<Link href={`/lore/${lore.slug}`} className="text-sm font-medium">
								{lore.name}
							</Link>
							<p className="text-sm text-muted-foreground">{linkRoleOrTypeText}</p>
							<p className="text-sm text-muted-foreground">{linkDetailsText}</p>
							<List items={description} />
						</div>
					))}
				</InfoCard>
			</div>
		</div>
	)
}

function Header({ name, subtlety, narrativeWeight }: Pick<Foreshadowing, "name" | "subtlety" | "narrativeWeight">) {
	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Eye className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			<div className="flex flex-wrap gap-2 mt-2">
				<BadgeWithTooltip
					variant={getForeshadowingSubtletyVariant(subtlety)}
					tooltipContent="How subtle the hint is"
					className="capitalize"
				>
					<Icons.EyeOff className="h-3.5 w-3.5 mr-1" />
					{subtlety}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="How much narrative weight it carries" className="capitalize">
					<Icons.Weight className="h-3.5 w-3.5 mr-1" />
					{narrativeWeight}
				</BadgeWithTooltip>
			</div>
		</div>
	)
}
