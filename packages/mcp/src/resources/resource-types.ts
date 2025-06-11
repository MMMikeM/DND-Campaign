import type { Resource, ResourceTemplate } from "@modelcontextprotocol/sdk/types.js"

export type ResourceContent = {
	uri: string
	mimeType?: string
	text?: string
	blob?: string
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

export type ResourceListHandler = () => Promise<Resource[]>
export type ResourceTemplateListHandler = () => Promise<ResourceTemplate[]>

export type CampaignResourceHandlers = {
	listResources: ResourceListHandler
	listResourceTemplates: ResourceTemplateListHandler
	readResource: ResourceHandler
}
