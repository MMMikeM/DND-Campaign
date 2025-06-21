import type { loader } from "./$slug"

export type MapVariant = Awaited<ReturnType<typeof loader>>["variants"][number]
