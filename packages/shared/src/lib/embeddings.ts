const camelToTitle = (text: string) => {
	return text.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
}
const removeAppendedId = (text: string | number | symbol) => camelToTitle(String(text).replace(/id/i, "").trim())

export function getTextForEmbedding<T extends Record<string, unknown>, K extends keyof T>(
	record: T,
	fields: K[],
	rename?: Partial<Record<K, string>>,
) {
	return fields
		.map((field) => {
			const label = removeAppendedId(rename?.[field] ?? field)
			const value = record[field]
			if (Array.isArray(value)) {
				const arr = value.filter((v) => typeof v === "string" && v.trim())
				if (arr.length) return `${label}: ${arr.join(". ")}`
				return ""
			} else if (typeof value === "string" && value.trim()) {
				return `${label}: ${value}`
			} else if (value != null) {
				return `${label}: ${value}`
			}
			return ""
		})
		.filter(Boolean)
		.join("\n")
}
