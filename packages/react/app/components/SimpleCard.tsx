import * as React from "react"
import { InfoCard } from "./InfoCard"

interface SimpleCardProps {
	title: string
	icon: React.ReactNode
	children?: React.ReactNode
	className?: string
}

/**
 * SimpleCard is a wrapper around InfoCard for backward compatibility
 * This component is being deprecated in favor of InfoCard
 */
export function SimpleCard({ title, icon, children, className }: SimpleCardProps) {
	return (
		<InfoCard title={title} icon={icon} className={className}>
			{children}
		</InfoCard>
	)
}

export default SimpleCard
