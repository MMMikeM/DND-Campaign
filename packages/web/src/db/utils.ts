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
		from<P extends keyof T, K extends string>(config: Source<P, K>) {
			type SourceItemType = T[P] extends readonly (infer I)[] ? I : never

			sources.push(config as Source<keyof T, string>)

			return {
				/**
				 * Specify additional source property and its key field
				 */
				with<P2 extends keyof T, K2 extends string>(config: Source<P2, K2>) {
					type SourceItem2Type = T[P2] extends readonly (infer I)[] ? I : never

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
							// Calculate transformed items from first source
							type TransformedItem1 = SourceItemType extends Record<K, infer V>
								? Omit<SourceItemType, K> & Record<TK, V>
								: never

							// Calculate transformed items from second source
							type TransformedItem2 = SourceItem2Type extends Record<K2, infer V>
								? Omit<SourceItem2Type, K2> & Record<TK, V>
								: never

							// Union of all transformed types
							type TransformedUnion = TransformedItem1 | TransformedItem2

							// Calculate properties to exclude from result
							type ExcludedProps = P | P2

							// Final result type
							type ResultType = Omit<T, ExcludedProps> & Record<TP, TransformedUnion[]>

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
									// Extract the specified key and its value
									const { [source.key]: keyValue, ...rest } = item
									// Create a new object with the transformed structure
									return {
										...rest,
										[target.key]: keyValue,
									}
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
					type TransformedItem = SourceItemType extends Record<K, infer V>
						? Omit<SourceItemType, K> & Record<TK, V>
						: never

					type ResultType = Omit<T, P> & Record<TP, TransformedItem[]>

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
						// Extract the specified key and its value
						const { [config.key]: keyValue, ...rest } = item
						// Create a new object with the transformed structure
						return {
							...rest,
							[target.key]: keyValue,
						}
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
