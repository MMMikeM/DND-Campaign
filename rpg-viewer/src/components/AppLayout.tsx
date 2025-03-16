"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import NavigationDrawer from "./NavigationDrawer";
import YamlDisplay from "./YamlDisplay";

export default function AppLayout() {
	const [activeFile, setActiveFile] = useState<string | null>(null);
	const [files, setFiles] = useState<string[]>([]);

	// Fetch all available YAML files
	const { data: yamlFiles, isLoading } = trpc.yaml.listFiles.useQuery(
		undefined,
		{
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	);

	// Update files when data is loaded
	useEffect(() => {
		if (yamlFiles && yamlFiles.length > 0) {
			setFiles(yamlFiles);
			// Set first file as active if none selected
			if (!activeFile) {
				setActiveFile(yamlFiles[0]);
			}
		}
	}, [yamlFiles, activeFile]);

	const handleFileSelect = (fileName: string) => {
		setActiveFile(fileName);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="text-center">
					<svg
						className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						aria-label="Loading spinner"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					<p className="text-gray-600 dark:text-gray-300">
						Loading campaign files...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
			{/* Navigation Drawer */}
			<NavigationDrawer
				files={files}
				activeFile={activeFile}
				onSelectFile={handleFileSelect}
			/>

			{/* Main Content */}
			<div className="flex-1 overflow-auto p-4 md:p-6">
				<div className="max-w-5xl mx-auto">
					<YamlDisplay filename={activeFile} />
				</div>
			</div>
		</div>
	);
}
