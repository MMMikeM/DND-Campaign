const isObject = (val: unknown): val is Record<string, unknown> => {
	return val != null && typeof val === "object" && Array.isArray(val) === false
}

export const countBy = <const EnumKeys extends readonly string[], V>(
	items: V[],
	extractor: (item: V) => string,
	enumForKeys?: EnumKeys,
): Record<EnumKeys[number], { count: number; percentage: number }> => {
	const grouped = Object.groupBy(items, extractor)
	const result: Partial<Record<EnumKeys[number], { count: number; percentage: number }>> = {}
	for (const key of enumForKeys ?? Object.keys(grouped)) {
		const count = grouped[key]?.length ?? 0
		const percentage = items.length ? (count / (items.length ?? 1)) * 100 : 0
		result[key as EnumKeys[number]] = {
			count,
			percentage,
		}
	}

	return result as Record<EnumKeys[number], { count: number; percentage: number }>
}

export const getUnderrepresentedKeys = <T extends Record<string, { count: number; percentage: number }>>(
	distribution: T,
): (keyof T)[] => {
	const sorted = Object.entries(distribution).toSorted(([, a], [, b]) => a.percentage - b.percentage)
	return sorted.slice(0, Math.ceil(sorted.length * 0.25)).map(([key]) => key as keyof T)
}

export const cleanObject = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
	const newObj = { ...obj }
	for (const key in newObj) {
		const value = newObj[key]
		if (value === null || value === undefined) {
			delete newObj[key]
		} else if (Array.isArray(value)) {
			if (value.length === 0) {
				delete newObj[key]
			}
		} else if (isObject(value)) {
			const cleaned = cleanObject(value)
			if (Object.keys(cleaned).length === 0) {
				delete newObj[key]
			} else {
				// @ts-expect-error - this is fine for our purposes
				newObj[key] = cleaned
			}
		}
	}
	return newObj
}
