"use client"

import NavigationDrawer from "./NavigationDrawer"
import type { ReactNode } from "react"

interface NavigationDrawerWrapperProps {
	files: string[]
	children: ReactNode
}

export default function NavigationDrawerWrapper({
	files,
	children,
}: NavigationDrawerWrapperProps) {
	return (
		<div className="flex h-screen overflow-hidden">
			{/* Navigation Drawer */}
			<div className="flex-shrink-0">
				<NavigationDrawer
					files={files}
					activeFile={null}
					onSelectFile={() => {}} // Navigation is now handled by Link components
				/>
			</div>

			{/* Main Content */}
			<div className="flex-grow overflow-y-auto p-4">{children}</div>
		</div>
	)
}
