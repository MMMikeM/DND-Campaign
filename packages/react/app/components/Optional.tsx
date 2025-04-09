type OptionalChildrenProps = {
	children: React.ReactNode
	fallback: React.ReactNode
}

export const Optional = ({ children, fallback }: OptionalChildrenProps) => {
	const isEmpty =
		!children ||
		(Array.isArray(children) && children.length === 0) ||
		(Array.isArray(children) && children.every((child) => child == null))

	return isEmpty ? fallback : children
}
