import type { Resource } from "@modelcontextprotocol/server"

export type ResourceContent = {
	uri: string
	mimeType?: string
	text: string
}

export type ResourceHandler = (uri: string) => Promise<ResourceContent | ResourceContent[]>

export type ResourceLister = () => Promise<Resource[]>

export type ResourceDefinition = {
	uriTemplate: string
	name: string
	description?: string
	mimeType?: string
	handler: ResourceHandler
	lister?: ResourceLister
}
