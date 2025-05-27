/**
 * Generic helper functions for building embedding text
 */

/**
 * Adds a title section to the sections array
 */
export const addTitle = (sections: string[], entityType: string, name: string): void => {
	sections.push(`${entityType}: ${name}`)
}

/**
 * Adds an overview section from description array if it exists and has content
 */
export const addOverview = (sections: string[], description?: string[] | null): void => {
	if (description && description.length > 0) {
		sections.push("Overview:")
		description.forEach((desc) => sections.push(desc))
	}
}

/**
 * Adds a simple field to sections if the value exists
 */
export const addField = (sections: string[], label: string, value?: string | number | null): void => {
	if (value !== undefined && value !== null && value !== "") {
		sections.push(`${label}: ${value}`)
	}
}

/**
 * Adds a field with underscore-to-space conversion if the value exists
 */
export const addFieldWithSpaces = (sections: string[], label: string, value?: string | null): void => {
	if (value !== undefined && value !== null && value !== "") {
		sections.push(`${label}: ${value.replace(/_/g, " ")}`)
	}
}

/**
 * Adds multiple fields at once - more elegant than multiple addField calls
 */
export const addFields = (
	sections: string[],
	fields: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
): void => {
	fields.forEach(({ label, value, convertSpaces = true }) => {
		if (value !== undefined && value !== null && value !== "") {
			const displayValue = convertSpaces && typeof value === "string" ? value.replace(/_/g, " ") : String(value)
			sections.push(`${label}: ${displayValue}`)
		}
	})
}

/**
 * Builds a list of conditional fields - cleaner than multiple if statements
 */
export const buildConditionalFields = (
	fieldMappings: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
): string[] => {
	return fieldMappings
		.filter(({ value }) => value !== undefined && value !== null && value !== "")
		.map(({ label, value, convertSpaces = true }) => {
			const displayValue = convertSpaces && typeof value === "string" ? value.replace(/_/g, " ") : String(value)
			return `${label}: ${displayValue}`
		})
}

/**
 * Adds a list section if the array exists and has content
 */
export const addList = (sections: string[], sectionTitle: string, items?: string[] | null): void => {
	if (items && items.length > 0) {
		sections.push(`${sectionTitle}:`)
		items.forEach((item) => sections.push(`- ${item}`))
	}
}

/**
 * Adds multiple list sections at once
 */
export const addLists = (sections: string[], lists: Array<{ title: string; items?: string[] | null }>): void => {
	lists.forEach(({ title, items }) => {
		addList(sections, title, items)
	})
}

/**
 * Builds a basic information section from key-value pairs
 */
export const addBasicInfoSection = (
	sections: string[],
	fields: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
	sectionTitle = "Basic Information",
): void => {
	const basicInfo: string[] = []

	fields.forEach(({ label, value, convertSpaces = true }) => {
		if (value !== undefined && value !== null && value !== "") {
			const displayValue = convertSpaces && typeof value === "string" ? value.replace(/_/g, " ") : String(value)
			basicInfo.push(`${label}: ${displayValue}`)
		}
	})

	if (basicInfo.length > 0) {
		sections.push(`${sectionTitle}:`)
		basicInfo.forEach((info) => sections.push(info))
	}
}

/**
 * Builds a grouped section with multiple subsections - simplified interface
 */
export const addGroupedSection = (
	sections: string[],
	sectionTitle: string,
	groups: Array<{
		title?: string
		items: string[]
		isSubList?: boolean
	}>,
): void => {
	const allItems: string[] = []

	groups.forEach(({ title, items, isSubList = false }) => {
		if (items.length > 0) {
			if (title) {
				allItems.push(`${title}:`)
			}
			items.forEach((item) => {
				const prefix = isSubList ? "- " : ""
				allItems.push(`${prefix}${item}`)
			})
		}
	})

	if (allItems.length > 0) {
		sections.push(`${sectionTitle}:`)
		allItems.forEach((item) => sections.push(item))
	}
}

/**
 * Simplified grouped section for common pattern of lists with titles
 */
export const addGroupedLists = (
	sections: string[],
	sectionTitle: string,
	groups: Array<{ title: string; items?: string[] | null }>,
): void => {
	const validGroups = groups
		.filter(({ items }) => items && items.length > 0)
		.map(({ title, items }) => ({
			title,
			items: items!.map((item) => `- ${item}`),
		}))

	addGroupedSection(sections, sectionTitle, validGroups)
}

/**
 * Builds a conditional section that only adds content if any items exist
 */
export const addConditionalSection = (sections: string[], sectionTitle: string, builder: () => string[]): void => {
	const items = builder()
	if (items.length > 0) {
		sections.push(`${sectionTitle}:`)
		items.forEach((item) => sections.push(item))
	}
}

/**
 * Adds a conditional section using field mappings - much cleaner than manual if statements
 */
export const addConditionalFieldSection = (
	sections: string[],
	sectionTitle: string,
	fieldMappings: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
): void => {
	const items = buildConditionalFields(fieldMappings)
	if (items.length > 0) {
		sections.push(`${sectionTitle}:`)
		items.forEach((item) => sections.push(item))
	}
}

/**
 * Joins all sections into final embedding text
 */
export const buildEmbeddingText = (sections: string[]): string => {
	return sections.join("\n")
}

/**
 * Builder class for more fluent embedding text construction
 */
export class EmbeddingBuilder {
	private sections: string[] = []

	title(entityType: string, name: string): this {
		addTitle(this.sections, entityType, name)
		return this
	}

	overview(description?: string[] | null): this {
		addOverview(this.sections, description)
		return this
	}

	field(label: string, value?: string | number | null, convertSpaces = true): this {
		if (convertSpaces) {
			addFieldWithSpaces(this.sections, label, value as string)
		} else {
			addField(this.sections, label, value)
		}
		return this
	}

	fields(fields: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>): this {
		addFields(this.sections, fields)
		return this
	}

	basicInfoSection(
		fields: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
		sectionTitle = "Basic Information",
	): this {
		addBasicInfoSection(this.sections, fields, sectionTitle)
		return this
	}

	list(title: string, items?: string[] | null): this {
		addList(this.sections, title, items)
		return this
	}

	lists(lists: Array<{ title: string; items?: string[] | null }>): this {
		addLists(this.sections, lists)
		return this
	}

	groupedLists(sectionTitle: string, groups: Array<{ title: string; items?: string[] | null }>): this {
		addGroupedLists(this.sections, sectionTitle, groups)
		return this
	}

	conditionalSection(sectionTitle: string, builder: () => string[]): this {
		addConditionalSection(this.sections, sectionTitle, builder)
		return this
	}

	conditionalFieldSection(
		sectionTitle: string,
		fieldMappings: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
	): this {
		addConditionalFieldSection(this.sections, sectionTitle, fieldMappings)
		return this
	}

	build(): string {
		return buildEmbeddingText(this.sections)
	}
}
