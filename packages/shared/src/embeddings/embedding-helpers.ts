/**
 * Generic helper functions for building embedding text
 */

/**
 * Builder class for more fluent embedding text construction
 */
export class EmbeddingBuilder {
	private sections: string[] = []

	title(entityType: string, name: string): this {
		this.sections.push(`${entityType}: ${name}`)
		return this
	}

	overview(description?: string[] | null): this {
		if (description && description.length > 0) {
			this.sections.push("Overview:")
			description.forEach((desc) => this.sections.push(desc))
		}
		return this
	}

	field(label: string, value?: string | number | null, convertSpaces = true): this {
		if (value !== undefined && value !== null && value !== "") {
			const displayValue = convertSpaces && typeof value === "string" ? value.replace(/_/g, " ") : String(value)
			this.sections.push(`${label}: ${displayValue}`)
		}
		return this
	}

	fields(fields: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>): this {
		fields.forEach(({ label, value, convertSpaces = true }) => {
			if (value !== undefined && value !== null && value !== "") {
				const displayValue = convertSpaces && typeof value === "string" ? value.replace(/_/g, " ") : String(value)
				this.sections.push(`${label}: ${displayValue}`)
			}
		})
		return this
	}

	basicInfoSection(
		fields: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
		sectionTitle = "Basic Information",
	): this {
		const basicInfo: string[] = []

		fields.forEach(({ label, value, convertSpaces = true }) => {
			if (value !== undefined && value !== null && value !== "") {
				const displayValue = convertSpaces && typeof value === "string" ? value.replace(/_/g, " ") : String(value)
				basicInfo.push(`${label}: ${displayValue}`)
			}
		})

		if (basicInfo.length > 0) {
			this.sections.push(`${sectionTitle}:`)
			basicInfo.forEach((info) => this.sections.push(info))
		}
		return this
	}

	list(title: string, items?: string[] | null): this {
		if (items && items.length > 0) {
			this.sections.push(`${title}:`)
			items.forEach((item) => this.sections.push(`- ${item}`))
		}
		return this
	}

	lists(lists: Array<{ title: string; items?: string[] | null }>): this {
		lists.forEach(({ title, items }) => {
			this.list(title, items)
		})
		return this
	}

	groupedLists(sectionTitle: string, groups: Array<{ title: string; items?: string[] | null }>): this {
		const validGroups = groups
			.filter(({ items }) => items && items.length > 0)
			.map(({ title, items }) => ({
				title,
				items: items!.map((item) => `- ${item}`),
			}))

		if (validGroups.length > 0) {
			this.sections.push(`${sectionTitle}:`)
			validGroups.forEach(({ title, items }) => {
				this.sections.push(`${title}:`)
				items.forEach((item) => this.sections.push(item))
			})
		}
		return this
	}

	conditionalSection(sectionTitle: string, builder: () => string[]): this {
		const items = builder()
		if (items.length > 0) {
			this.sections.push(`${sectionTitle}:`)
			items.forEach((item) => this.sections.push(item))
		}
		return this
	}

	conditionalFieldSection(
		sectionTitle: string,
		fieldMappings: Array<{ label: string; value?: string | number | null; convertSpaces?: boolean }>,
	): this {
		const items = fieldMappings
			.filter(({ value }) => value !== undefined && value !== null && value !== "")
			.map(({ label, value, convertSpaces = true }) => {
				const displayValue = convertSpaces && typeof value === "string" ? value.replace(/_/g, " ") : String(value)
				return `${label}: ${displayValue}`
			})

		if (items.length > 0) {
			this.sections.push(`${sectionTitle}:`)
			items.forEach((item) => this.sections.push(item))
		}
		return this
	}

	build(): string {
		return this.sections.join("\n")
	}
}
