import { Children } from "react"

type OptionalChildrenProps = {
	children: React.ReactNode
	fallback: React.ReactNode
}

export const Optional = ({ children, fallback }: OptionalChildrenProps) => {
	const isEmpty = Children.toArray(children).length === 0

	return isEmpty ? fallback : children
}
