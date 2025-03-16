"use client"

import { useEffect } from "react"

/**
 * ThemeInitializer component
 *
 * This component initializes the theme based on user preferences
 * and system settings without causing hydration mismatches.
 */
export default function ThemeInitializer() {
	useEffect(() => {
		// Check for dark mode preference
		const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
		const hasStoredPreference = localStorage.getItem("darkMode")

		// Apply dark mode class if needed
		if (
			hasStoredPreference === "true" ||
			(!hasStoredPreference && isDarkMode)
		) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
	}, [])

	// This component doesn't render anything
	return null
}
