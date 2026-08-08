/**
 * Creates a fluent interface for unifying relationships
 */
export function unifyRelations<T extends Record<string, unknown>>(obj: T) {
	type Source<P extends keyof T, K extends string> = { property: P; key: K }

	type ItemOf<P extends keyof T> = T[P] extends readonly (infer I)[] ? I : never

	type KeyOf<P extends keyof T> = string & keyof (T[P] extends readonly (infer I)[] ? I : Record<string, unknown>)

	/** The item minus its key field, plus the value that key held */
	type Accumulated<P extends keyof T, K extends string> = {
		rest: Omit<ItemOf<P>, K>
		value: K extends keyof ItemOf<P> ? ItemOf<P>[K] : never
	}

	/** Distributes over the accumulated union, renaming each key to `TK` */
	type Unified<Acc, TK extends string> = Acc extends { rest: infer R; value: infer V }
		? R & { [key in TK]: V }
		: never

	const sources: Source<keyof T, string>[] = []

	/** Builder stage carrying the properties consumed so far and the union of transformed items */
	function stage<Excluded extends keyof T, Acc>() {
		return {
			with<P extends keyof T, K extends KeyOf<P>>(config: Source<P, K>) {
				sources.push(config as Source<keyof T, string>)
				return stage<Excluded | P, Acc | Accumulated<P, K>>()
			},

			to<TP extends string, TK extends string>(target: { property: TP; key: TK }) {
				type ResultType = Omit<T, Excluded> & { [key in TP]: Array<Unified<Acc, TK>> }

				for (const source of sources) {
					if (!Array.isArray(obj[source.property])) {
						throw new Error(`Property must be an array: ${String(source.property)}`)
					}
				}

				const result: Record<string, unknown> = {}
				const excludedProps = new Set(sources.map((s) => s.property))

				for (const [key, value] of Object.entries(obj)) {
					if (!excludedProps.has(key as keyof T)) {
						result[key] = value
					}
				}

				result[target.property] = sources.flatMap((source) => {
					const sourceArray = obj[source.property] as Record<string, unknown>[]
					return sourceArray.map((item) => {
						const copy = { ...item }
						const keyValue = copy[source.key]
						delete copy[source.key]
						copy[target.key] = keyValue
						return copy
					})
				})

				return result as ResultType
			},
		}
	}

	return {
		from<P extends keyof T, K extends KeyOf<P>>(config: Source<P, K>) {
			sources.push(config as Source<keyof T, string>)
			return stage<P, Accumulated<P, K>>()
		},
	}
}
