"use client"

import NavigationDrawer from "./NavigationDrawer"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

interface NavigationDrawerWrapperProps {
	files: string[]
	children: ReactNode
}

export default function NavigationDrawerWrapper({
	files,
	children,
}: NavigationDrawerWrapperProps) {
	const router = useRouter()

	// Client-side handler for file selection
	const handleSelectFile = (fileName: string) => {
		console.log(`Selected file: ${fileName}`)

		// Navigate based on file type
		if (fileName.toLowerCase().includes("npc")) {
			router.push("/npcs")
		} else if (fileName.toLowerCase().includes("faction")) {
			router.push("/factions")
		} else if (fileName.toLowerCase().includes("location")) {
			router.push("/locations")
		} else if (fileName.toLowerCase().includes("quest")) {
			router.push("/quests")
		}
	}

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Navigation Drawer */}
			<div className="flex-shrink-0">
				<NavigationDrawer
					files={files}
					activeFile={null}
					onSelectFile={handleSelectFile}
				/>
			</div>

			{/* Main Content */}
			<div className="flex-grow overflow-y-auto p-4">{children}</div>
		</div>
	)
}
