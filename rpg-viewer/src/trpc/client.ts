import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/routers";

// Export the tRPC React hook
export const trpc = createTRPCReact<AppRouter>();
