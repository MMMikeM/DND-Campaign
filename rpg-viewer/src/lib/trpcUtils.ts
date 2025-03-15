/**
 * This file provides a standalone tRPC client for accessing tRPC procedures outside of React components
 * This is useful for utility functions or other non-React code that needs to call the API
 */

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { type AppRouter } from "@/server/routers";
import superjson from "superjson";

/**
 * A standalone tRPC client that can be used outside of React components
 * This client doesn't use React hooks and can be imported anywhere
 */
export const trpcUtils = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
});
