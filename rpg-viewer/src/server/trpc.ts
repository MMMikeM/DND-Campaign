import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Create a new context
export const createTRPCContext = async () => {
  return {};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    console.error("TRPC error:", error);
    return {
      ...shape,
      message: error.message,
      data: {
        ...shape.data,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    };
  },
});

// Export the tRPC router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
