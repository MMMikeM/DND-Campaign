import type { Resource } from "@modelcontextprotocol/server"
import { db, logger } from ".."
import type { ResourceDefinition, ResourceHandler, ResourceLister } from "./resource-types"
import { createJsonResource } from "./resource-utils"

const listLocationContexts: ResourceLister = async (): Promise<Resource[]> => {
	const [sites, regions] = await Promise.all([
		db.query.sites.findMany({
			columns: { id: true, name: true },
			limit: 3,
		}),
		db.query.regions.findMany({
			columns: { id: true, name: true },
			limit: 2,
		}),
	])

	const siteResources = sites.map(
		(site): Resource => ({
			uri: `campaign://location-context/${encodeURIComponent(site.name)}`,
			name: `${site.name} Location Context`,
			description: `Detailed information about ${site.name} for scene setting`,
			mimeType: "application/json",
		}),
	)

	const regionResources = regions.map(
		(region): Resource => ({
			uri: `campaign://location-context/${encodeURIComponent(region.name)}`,
			name: `${region.name} Regional Context`,
			description: `Regional information about ${region.name} for campaign context`,
			mimeType: "application/json",
		}),
	)

	return [...siteResources, ...regionResources]
}

const handleLocationContext: ResourceHandler = async (uri: string) => {
	const match = uri.match(/^campaign:\/\/location-context\/(.+)$/)
	if (!match || !match[1]) {
		throw new Error(`Invalid location context URI: ${uri}`)
	}

	const locationName = decodeURIComponent(match[1])
	logger.info(`Gathering location context for: ${locationName}`)

	try {
		// Try to find as site first, then region
		const [site, region] = await Promise.all([
			db.query.sites.findFirst({
				where: { name: locationName },
				with: {
					area: {
						with: { region: { columns: { name: true, type: true } } },
					},
					encounters: true,
					secrets: true,
				},
			}),
			db.query.regions.findFirst({
				where: { name: locationName },
				with: {
					areas: {
						with: {
							sites: { columns: { name: true, intendedSiteFunction: true } },
						},
					},
				},
			}),
		])

		let contextData: unknown

		if (site) {
			contextData = {
				location_type: "site",
				site_details: {
					name: site.name,
					type: site.intendedSiteFunction || "location",
					description: site.description,
				},
				encounters: site.encounters.map((enc) => ({
					name: enc.name,
					type: enc.objectiveType,
				})),
				secrets: site.secrets.map((secret) => ({
					type: secret.secretType,
					difficulty: secret.difficultyToDiscover,
				})),
			}
		} else if (region) {
			contextData = {
				location_type: "region",
				region_details: {
					name: region.name,
					type: region.type,
					description: region.description,
					danger_level: region.dangerLevel,
				},
				notable_sites: region.areas.flatMap((area) =>
					area.sites.map((site) => ({
						name: site.name,
						type: site.intendedSiteFunction || "location",
					})),
				),
			}
		} else {
			throw new Error(`Location not found: ${locationName}`)
		}

		return [createJsonResource(uri, contextData)]
	} catch (error) {
		logger.error({ error, locationName }, "Failed to gather location context")
		throw new Error(`Failed to gather context for location: ${locationName}`)
	}
}

export const locationContextResourceDefinition: ResourceDefinition = {
	uriTemplate: "campaign://location-context/{name}",
	name: "Location Context",
	description: "Detailed information about sites and regions for scene setting and encounters",
	mimeType: "application/json",
	handler: handleLocationContext,
	lister: listLocationContexts,
}
