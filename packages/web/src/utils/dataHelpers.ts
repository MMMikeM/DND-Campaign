/**
 * Checks if an array field exists and has items
 */
export const hasItems = <T>(arr: T[] | null | undefined): boolean => {
	return Boolean(arr && arr.length > 0)
}

/**
 * Checks if an object has a specific property
 */
export const hasProperty = <T, K extends PropertyKey>(
	obj: T | null | undefined,
	prop: K,
): boolean => {
	return Boolean(obj && prop in (obj as object))
}

/**
 * Checks if an array field exists, has items, and the first item has a specific property
 */
export const hasItemsWithProperty = <T, K extends PropertyKey>(
	arr: T[] | null | undefined,
	prop: K,
): boolean => {
	if (!arr || arr.length === 0) return false
	return hasProperty(arr[0], prop)
}

/**
 * Helper to safely access array items (returns undefined instead of throwing errors)
 */
export const safeArrayAccess = <T>(arr: T[] | null | undefined, index: number): T | undefined => {
	if (!arr || arr.length <= index) return undefined
	return arr[index]
}
