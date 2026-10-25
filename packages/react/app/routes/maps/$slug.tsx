import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { buttonVariants } from "~/components/ui/button"
import { getMap } from "~/lib/entities"
import { orNotFound } from "~/lib/errors"
import type { Route } from "./+types/$slug"
import MapVariants from "./components/VariantContent"

export async function loader({ params }: Route.LoaderArgs) {
	return orNotFound(getMap(params.slug))
}

export default function MapDetail({ loaderData }: Route.ComponentProps) {
	const { name, description, creativePrompts, tags, variants, site } = loaderData

	return (
		<>
			<div className="container mx-auto py-6 px-4 sm:px-6 space-y-6">
				<div className="flex justify-between items-center mb-6">
					<NavLink to="/maps" className={buttonVariants({ variant: "outline", size: "sm" })}>
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Maps
					</NavLink>
				</div>

				<div className="mb-6">
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
						<Icons.Map className="h-6 w-6 mr-2 text-primary" />
						{name}
					</h1>
					{site && (
						<p className="text-muted-foreground">
							Associated with:{" "}
							<NavLink to={`/sites/${site.slug}`} className="text-primary hover:underline">
								{site.name}
							</NavLink>
						</p>
					)}
				</div>
				<Tags tags={tags} variant="secondary" maxDisplay={8} />

				<InfoCard
					title="Map information"
					icon={<Icons.FileText className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No description provided."
					contentClassName="grid grid-cols-1 lg:grid-cols-2 gap-6"
				>
					<List items={description} heading="Description" spacing="sm" textColor="muted" />
					<List items={creativePrompts} heading="Creative Prompts" spacing="sm" textColor="muted" />
				</InfoCard>
				{variants.length > 0 ? (
					<MapVariants variants={variants} />
				) : (
					<InfoCard
						title="Map Variants"
						icon={<Icons.Map className="h-4 w-4 mr-2 text-primary" />}
						emptyMessage="This map has no variants yet."
					/>
				)}
			</div>
		</>
	)
}
