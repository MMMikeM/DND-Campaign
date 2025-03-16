"use client";

import { ReactNode } from "react";
import { TRPCProvider } from "@/trpc/provider";
import { CrossReferenceProvider } from "@/components/CrossReferenceContext";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<CrossReferenceProvider onFileChange={() => {}}>
			<TRPCProvider>{children}</TRPCProvider>
		</CrossReferenceProvider>
	);
}
