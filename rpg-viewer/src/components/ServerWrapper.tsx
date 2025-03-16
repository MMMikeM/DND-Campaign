import { Suspense } from "react";
import { getYamlFiles } from "@/server/yaml";
import NavigationDrawerClient from "./NavigationDrawerClient";

interface ServerWrapperProps {
	children: React.ReactNode;
}

export default async function ServerWrapper({ children }: ServerWrapperProps) {
	// Server-side fetching of yaml files
	const files = await getYamlFiles();

	if (!files || files.length === 0) {
		return (
			<div className="p-8 text-center text-red-500">
				No campaign files found. Please add YAML files to your project.
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Navigation Drawer - client component */}
			<Suspense
				fallback={<div className="w-64 bg-gray-900">Loading navigation...</div>}
			>
				<NavigationDrawerClient files={files} />
			</Suspense>

			{/* Main Content */}
			<div className="flex-1 overflow-auto p-4 md:p-6">
				<div className="max-w-5xl mx-auto">{children}</div>
			</div>
		</div>
	);
}
