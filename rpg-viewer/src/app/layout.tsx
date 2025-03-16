import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "@/components/Providers"
import { getDataByType } from "@/server/utils/contentUtils"
import type {
	NpcsFile,
	FactionsFile,
	LocationsFile,
	QuestsFile,
} from "@/server/schemas"
import {
	NpcsFileSchema,
	FactionsFileSchema,
	LocationsFileSchema,
	QuestsFileSchema,
} from "@/server/schemas"
import {
	CampaignDataProvider,
	type CampaignData,
} from "@/components/CampaignDataProvider"
import NavigationDrawerWrapper from "@/components/NavigationDrawerWrapper"
import ThemeInitializer from "@/components/ThemeInitializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Tomekeeper",
	description: "Your digital grimoire for campaign management",
}

// Define the data sources we need to fetch with their keys for the final data object
const dataSources = [
	{ key: "npcs", type: "npcs", schema: NpcsFileSchema },
	{ key: "factions", type: "factions", schema: FactionsFileSchema },
	{ key: "locations", type: "locations", schema: LocationsFileSchema },
	{ key: "quests", type: "quests", schema: QuestsFileSchema },
]

/**
 * Fetches all campaign data concurrently and handles errors gracefully
 * @returns The campaign data object with all data types
 */
async function getInitialData(): Promise<CampaignData> {
	return Promise.allSettled(
		dataSources.map(({ type, schema }) => fetchData(type, schema)),
	).then((results) => {
		// Create an object with the results
		return dataSources.reduce(
			(acc, { key }, index) => {
				const result = results[index]
				acc[key] =
					result.status === "fulfilled"
						? result.value
						: (() => {
								console.error(
									`Failed to fetch ${dataSources[index].type} data:`,
									result.reason,
								)
								return []
							})()
				return acc
			},
			{ npcs: [], factions: [], locations: [], quests: [] } as CampaignData,
		)
	})
}

// Helper function to fetch data with error handling
async function fetchData(
	contentType: string,
	schema:
		| typeof NpcsFileSchema
		| typeof FactionsFileSchema
		| typeof LocationsFileSchema
		| typeof QuestsFileSchema,
) {
	try {
		return getDataByType(contentType, schema, "shattered-spire")
	} catch (error) {
		console.error(`Error fetching ${contentType} data:`, error)
		return []
	}
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const initialData = await getInitialData()

	// Content files for navigation (derived from data sources for consistency)
	const contentFiles = dataSources.map(({ type }) => `${type}.yaml`)

	// Log data for debugging
	console.log("Server loaded factions data:", initialData.factions)

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeInitializer />
			</head>
			<body
				className={`${inter.className} bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300`}
				suppressHydrationWarning
			>
				<CampaignDataProvider initialData={initialData}>
					<Providers>
						<NavigationDrawerWrapper files={contentFiles}>
							{children}
						</NavigationDrawerWrapper>
					</Providers>
				</CampaignDataProvider>
			</body>
		</html>
	)
}
