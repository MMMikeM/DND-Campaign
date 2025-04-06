import React from "react"
import * as Icons from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { List } from "~/components/List"
import { InfoCard } from "~/components/InfoCard"
import type { NPC } from "~/lib/entities"

interface OverviewContentProps {
	npc: NPC
}

export function OverviewContent({ npc }: OverviewContentProps) {
	const { name, appearance, background, alignment, attitude, occupation, socialStatus, age, quirk } = npc

	return (
		<>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="text-xl">Overview</CardTitle>
					<CardDescription>Essential information about {name}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h3 className="font-medium mb-2 flex items-center">
								<Icons.BookOpen className="h-4 w-4 mr-2 text-blue-600" />
								Background
							</h3>
							<List items={background} spacing="sm" textColor="muted" />
						</div>

						<Separator />

						<div>
							<h3 className="font-medium mb-2 flex items-center">
								<Icons.UserCircle className="h-4 w-4 mr-2 text-indigo-600" />
								Appearance
							</h3>
							<List items={appearance} spacing="sm" textColor="muted" />
						</div>

						<Separator />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-medium mb-2 flex items-center">
									<Icons.Heart className="h-4 w-4 mr-2 text-red-500" />
									Alignment
								</h3>
								<p className="text-muted-foreground">{alignment}</p>
							</div>
							<div>
								<h3 className="font-medium mb-2 flex items-center">
									<Icons.Smile className="h-4 w-4 mr-2 text-amber-500" />
									Attitude
								</h3>
								<p className="text-muted-foreground">{attitude}</p>
							</div>
						</div>

						<Separator />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-medium mb-2 flex items-center">
									<Icons.Briefcase className="h-4 w-4 mr-2 text-emerald-600" />
									Occupation
								</h3>
								<p className="text-muted-foreground">{occupation}</p>
							</div>
							<div>
								<h3 className="font-medium mb-2 flex items-center">
									<Icons.Users className="h-4 w-4 mr-2 text-purple-600" />
									Social Status
								</h3>
								<p className="text-muted-foreground">{socialStatus}</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<InfoCard
				title="Notable Feature"
				icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-amber-500" />}
				emptyMessage="No notable feature specified."
			>
				<p className="text-sm text-muted-foreground mb-4">What makes this NPC unique</p>
				<div className="p-4 bg-muted rounded-md">
					<p className="text-lg italic">{quirk}</p>
				</div>
			</InfoCard>
		</>
	)
}
