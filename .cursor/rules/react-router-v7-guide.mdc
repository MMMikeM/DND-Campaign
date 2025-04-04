---
description: 
globs: 
alwaysApply: true
---
# DND Campaign - React Router Guide

## Project Router Structure

This project uses a config-based routing approach with a parent layout component that contains an `Outlet` for rendering child routes.

## Import Structure

```typescript
// Core routing APIs
import { useLocation, useParams, Outlet } from "react-router"

// Core link components
import { Link } from "~/components/ui/link"

// For route configuration
import { route, index, type RouteConfig } from "@react-router/dev/routes"

// For accessing route data
import type { Route } from "./+types/path-to-component"
```

## Route Configuration

The project uses a config-based routing approach with a consistent pattern:

```typescript
// routes.ts
import { route, index, type RouteConfig } from "@react-router/dev/routes"

export default [
  // Parent route with layout component
  route("/", "./components/MainLayout.tsx", [
    // Index route
    index("./routes/index.tsx"),
    
    // List routes
    route("entities", "./routes/entities/index.tsx"),
    
    // Detail routes with dynamic parameters
    route("entities/:slug", "./routes/entities/$slug.tsx"),
  ]),
] satisfies RouteConfig
```

### Convention for Dynamic Route Files

- Static routes: Use the exact path name (e.g., `index.tsx`)
- Dynamic segments: Use `$` prefix in filenames (e.g., `$slug.tsx` for `:slug` parameter in the route)

## Data Fetching with Loaders

The project uses strongly-typed loaders for data fetching:

```typescript
// routes/entities/$slug.tsx
import { getEntity } from "~/lib/entities"
import type { Route } from "./+types/$slug"

// Server-side data fetching with type-safe params
export async function loader({ params }: Route.LoaderArgs) {
  if (!params.slug) {
    throw new Response("No slug provided", { status: 400 })
  }

  const entity = await getEntity(params.slug)
  if (!entity) {
    throw new Response("Entity not found", { status: 404 })
  }

  return entity
}

// Component with type-safe loader data
export default function Entity({ loaderData }: Route.ComponentProps) {
  const entity = loaderData
  
  return (
    <div>
      <h1>{entity.name}</h1>
      {/* Rest of component */}
    </div>
  )
}
```

## Layout Structure

This project uses a main layout component with an Outlet to render child routes:

```typescript
// components/MainLayout.tsx
import { Outlet, useLocation, useLoaderData } from "react-router"
import type { Route } from "./+types/MainLayout"

export async function loader({ params }: Route.LoaderArgs) {
  // Fetch shared data for the layout
  return { /* shared data */ }
}

export function MainLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="layout">
      <Sidebar>
        {/* Navigation links */}
      </Sidebar>
      
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}
```

## Navigation

Use the Link component from the UI library for navigation:

```typescript
import { Link } from "~/components/ui/link"

// Basic navigation
<Link href="/entities">All Entities</Link>

// Navigation with button styling
<Link href="/entities" asButton variant="outline">
  <Icons.ChevronLeft className="h-4 w-4 mr-1" />
  Back to Entities
</Link>
```

## Type Safety

The project uses automatically generated types from React Router:

```typescript
// Import route-specific types
import type { Route } from "./+types/$slug"

// Type-safe loader arguments
export async function loader({ params }: Route.LoaderArgs) {
  // params.slug is typed
}

// Type-safe component props
export default function Component({ loaderData }: Route.ComponentProps) {
  // loaderData is typed based on loader return type
}
```

## Entity Pattern

The project follows a consistent pattern for entity data handling:

1. List view (`/entities`) displays a summary of all entities
2. Detail view (`/entities/:slug`) displays detailed information about a specific entity
3. A shared layout component wraps all routes

## Best Practices

1. **Type Safety**
   - Import route-specific types with `import type { Route } from "./+types/path-to-component"`
   - Let TypeScript infer types where possible
   - Don't add unnecessary type annotations

2. **Data Fetching with Loaders**
   - Use strongly-typed loaders for data fetching
   - Handle error cases properly with appropriate HTTP status codes
   - Validate parameters before fetching data

3. **Consistent Layouts**
   - Use the MainLayout component with Outlet for consistent UI
   - Fetch shared data in the layout loader

4. **Routing Conventions**
   - Follow the established pattern for route configuration
   - Use the `$` prefix for dynamic segments in filenames
   - Group related routes in folders