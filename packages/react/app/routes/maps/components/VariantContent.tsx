import * as Icons from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { MapVariant } from "../utils"

const tabContentVariants = {
	active: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
	inactive: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
}

const imageClasses: Record<MapVariant["orientation"], string> = {
	landscape: "w-full max-h-[40vh] md:max-h-[60vh]",
	portrait: "w-auto max-w-full block mx-auto max-h-[60vh] md:max-h-[80vh]",
	square: "w-full max-h-[50vh] md:max-h-[70vh]",
}

export default function MapVariants({ variants }: { variants: MapVariant[] }) {
	const defaultVariant = variants.find((v) => v.isDefault) || variants[0]
	const [activeVariantId, setActiveVariantId] = useState(() => defaultVariant.id.toString())

	return (
		<div className="mt-6">
			<h2 className="text-2xl font-semibold mb-4">Map Variants</h2>
			<Tabs value={activeVariantId} onValueChange={setActiveVariantId}>
				<TabsList>
					{variants.map(({ id, isDefault, variantName }) => (
						<TabsTrigger
							key={id}
							value={id.toString()}
							className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
						>
							<div className="flex items-center">
								{isDefault && <Icons.Star className="h-3 w-3 mr-1" />}
								{variantName || "Default"}
							</div>
						</TabsTrigger>
					))}
				</TabsList>
				{variants.map(
					({
						variantName,
						isDefault,
						id,
						mapFile,
						description,
						gmNotes,
						creativePrompts,
						coverOptions,
						elevationFeatures,
						movementRoutes,
						difficultTerrain,
						chokePoints,
						sightLines,
						tacticalPositions,
						interactiveElements,
						environmentalHazards,
						orientation,
						tags,
					}) => (
						<TabsContent key={id} value={id.toString()} forceMount className="w-full mt-4 data-[state=inactive]:hidden">
							<motion.div
								className="space-y-6"
								variants={tabContentVariants}
								animate={activeVariantId === id.toString() ? "active" : "inactive"}
								initial={false}
							>
								<div className="flex items-center mb-4 h-6 gap-4">
									<h3 className="text-xl font-semibold">{variantName || "Default Variant"}</h3>

									{isDefault && (
										<Badge variant="default">
											<Icons.Star className="h-3 w-3 mr-1" />
											Default
										</Badge>
									)}
								</div>

								<div className="mb-6">
									<img
										src={`/api/maps/images/${mapFile.id}`}
										alt={variantName || "Default"}
										className={`object-contain ${imageClasses[orientation]}`}
										loading="lazy"
									/>
								</div>

								<InfoCard
									title="Map detail"
									icon={<Icons.Eye className="h-4 w-4 mr-2 text-red-600" />}
									contentClassName="grid grid-cols-1 lg:grid-cols-2 gap-6"
								>
									<List items={description} heading="Description" spacing="xs" textSize="sm" collapsible={false} />
									<List items={gmNotes} heading="GM Notes" spacing="xs" textSize="sm" collapsible={false} />
									<List
										items={creativePrompts}
										heading="Creative Prompts"
										spacing="xs"
										textSize="sm"
										collapsible={false}
									/>
									<List
										items={interactiveElements}
										heading="Interactive Elements"
										spacing="xs"
										textSize="sm"
										collapsible={false}
									/>
								</InfoCard>

								<InfoCard
									title="Tactical Information"
									icon={<Icons.Eye className="h-4 w-4 mr-2 text-red-600" />}
									contentClassName="grid grid-cols-1 lg:grid-cols-2 gap-6"
									className={`${orientation === "landscape" ? "col-span-2" : "col-span-1"} w-full h-fit`}
								>
									<List items={coverOptions} heading="Cover Options" spacing="xs" textSize="sm" />
									<List items={elevationFeatures} heading="Elevation Features" spacing="xs" textSize="sm" />
									<List items={movementRoutes} heading="Movement Routes" spacing="xs" textSize="sm" />
									<List items={difficultTerrain} heading="Difficult Terrain" spacing="xs" textSize="sm" />
									<List items={chokePoints} heading="Choke Points" spacing="xs" textSize="sm" />
									<List items={sightLines} heading="Sight Lines" spacing="xs" textSize="sm" />
									<List items={tacticalPositions} heading="Tactical Positions" spacing="xs" textSize="sm" />
									<List items={environmentalHazards} heading="Environmental Hazards" spacing="xs" textSize="sm" />
								</InfoCard>
							</motion.div>
						</TabsContent>
					),
				)}
			</Tabs>
		</div>
	)
}
