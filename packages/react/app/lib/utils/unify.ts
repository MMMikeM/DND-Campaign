/**
 * Creates a fluent interface for unifying relationships
 */
export function unifyRelations<T extends Record<string, unknown>>(obj: T) {
	type Source<P extends keyof T, K extends string> = { property: P; key: K }

	const sources: Source<keyof T, string>[] = []

	const builder = {
		/**
		 * Specify the first source property and its key field
		 */
		from<
			P extends keyof T,
			K extends keyof (T[P] extends readonly (infer I)[] ? I : Record<string, unknown>),
		>(config: Source<P, string & K>) {
			// Infer the type of items in the source array
			type SourceItemType = T[P] extends readonly (infer I)[] ? I : never
			// Infer the type of the key being transformed
			type KeyType = K extends keyof SourceItemType ? SourceItemType[K] : never

			sources.push(config as Source<keyof T, string>)

			return {
				/**
				 * Specify additional source property and its key field
				 */
				with<
					P2 extends keyof T,
					K2 extends keyof (T[P2] extends readonly (infer I)[] ? I : Record<string, unknown>),
				>(config: Source<P2, string & K2>) {
					// Infer the type of items in the second source array
					type SourceItem2Type = T[P2] extends readonly (infer I)[] ? I : never
					// Infer the type of the second key being transformed
					type Key2Type = K2 extends keyof SourceItem2Type ? SourceItem2Type[K2] : never

					sources.push(config as Source<keyof T, string>)

					return {
						/**
						 * Add another source property
						 */
						with<P3 extends keyof T, K3 extends string>(config: Source<P3, K3>) {
							sources.push(config as Source<keyof T, string>)
							return this
						},

						/**
						 * Specify the target property and key name
						 */
						to<TP extends string, TK extends string>(target: { property: TP; key: TK }) {
							// Calculate properties to exclude from result
							type ExcludedProps = P | P2

							// Define unified item types with renamed keys - preserving original types
							type TransformedItem1 = Omit<SourceItemType, K> & { [key in TK]: KeyType }
							type TransformedItem2 = Omit<SourceItem2Type, K2> & { [key in TK]: Key2Type }

							// Type for result with the transformed items
							type ResultType = Omit<T, ExcludedProps> & {
								[key in TP]: Array<TransformedItem1 | TransformedItem2>
							}

							// Validate inputs
							for (const source of sources) {
								if (!Array.isArray(obj[source.property])) {
									throw new Error(`Property must be an array: ${String(source.property)}`)
								}
							}

							// Create a new object excluding source properties
							const result: Record<string, unknown> = {}
							const excludedProps = new Set(sources.map((s) => s.property))

							// Copy non-source properties
							for (const [key, value] of Object.entries(obj)) {
								if (!excludedProps.has(key as keyof T)) {
									result[key] = value
								}
							}

							// Process each relationship source
							const transformedItems = sources.flatMap((source) => {
								const sourceArray = obj[source.property] as Record<string, unknown>[]
								return sourceArray.map((item) => {
									// Create a shallow copy of the item
									const copy = { ...item }
									// Extract the key value
									const keyValue = copy[source.key]
									// Delete the original key
									delete copy[source.key]
									// Add the transformed key
									copy[target.key] = keyValue
									// Return the modified item
									return copy
								})
							})

							// Add the transformed relationships to the result
							result[target.property] = transformedItems

							return result as ResultType
						},
					}
				},

				/**
				 * Specify the target property and key name when there's only one source
				 */
				to<TP extends string, TK extends string>(target: { property: TP; key: TK }) {
					// Simple transformed item type with renamed key - preserving original type
					type TransformedItem = Omit<SourceItemType, K> & { [key in TK]: KeyType }

					// Define result type with array of transformed items
					type ResultType = Omit<T, P> & { [key in TP]: Array<TransformedItem> }

					// Validate input
					if (!Array.isArray(obj[config.property])) {
						throw new Error(`Property must be an array: ${String(config.property)}`)
					}

					// Create a new object excluding source property
					const result: Record<string, unknown> = {}

					// Copy non-source properties
					for (const [key, value] of Object.entries(obj)) {
						if (key !== config.property) {
							result[key] = value
						}
					}

					// Process the relationship source
					const sourceArray = obj[config.property] as Record<string, unknown>[]
					const transformedItems = sourceArray.map((item) => {
						// Create a shallow copy of the item
						const copy = { ...item }
						// Extract the key value
						const keyValue = copy[config.key]
						// Delete the original key
						delete copy[config.key]
						// Add the transformed key
						copy[target.key] = keyValue
						// Return the modified item
						return copy
					})

					// Add the transformed relationships to the result
					result[target.property] = transformedItems

					return result as ResultType
				},
			}
		},
	}

	return builder
}
