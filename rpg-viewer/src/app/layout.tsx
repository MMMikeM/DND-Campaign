import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "RPG Campaign Viewer",
	description: "View and manage your RPG campaign data",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Script to detect system preference before the page renders to avoid hydration mismatch */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
              (function() {
                // Check for dark mode preference
                const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const hasStoredPreference = localStorage.getItem('darkMode');
                
                // Apply dark mode class if needed
                if ((hasStoredPreference === 'true') || (!hasStoredPreference && isDarkMode)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
					}}
				/>
			</head>
			<body className={inter.className} suppressHydrationWarning>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
