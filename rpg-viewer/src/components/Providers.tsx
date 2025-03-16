"use client";

import { ReactNode } from "react";
import { CrossReferenceProvider } from "@/components/CrossReferenceContext";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<CrossReferenceProvider onFileChange={() => {}}>
			{children}
		</CrossReferenceProvider>
	);
}
