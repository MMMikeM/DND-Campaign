# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

# D&D Campaign Manager React Client

This React application uses React Router 7 for file-based routing and data fetching.

## Data Fetching

The application uses React Router 7's loader pattern to fetch data before rendering components.

### Entity Structure

Entity data is fetched from the server and follows these interfaces:
- `Faction`: Organizations in the campaign world
- `Npc`: Non-player characters
- `Region`: Geographic areas
- `Quest`: Campaign storylines

### Route Structure

Routes are created using React Router 7's file-based routing:
- `routes/index.tsx` - Home page
- `routes/factions.tsx` - List of factions
- `routes/factions.$slug.tsx` - Detail page for a specific faction
- (and similar patterns for npcs, regions, quests)

### How to Use in a Route File

```tsx
// Example routes/factions.tsx
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAllFactions } from '../lib/entities';

// Loader function runs before rendering
export async function loader() {
  try {
    const factions = await getAllFactions();
    return { factions };
  } catch (error) {
    console.error("Error loading factions:", error);
    return { factions: [], error: "Failed to load factions" };
  }
}

export default function FactionsPage() {
  // Access the data returned by the loader
  const { factions, error } = useLoaderData<typeof loader>();
  
  // Rest of component...
}
```

### Using with Parameters

```tsx
// Example routes/factions.$slug.tsx
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getFaction } from '../lib/entities';

export async function loader({ params }: { params: { slug: string } }) {
  try {
    const faction = await getFaction(params.slug);
    return { faction };
  } catch (error) {
    return { error: `Failed to load faction "${params.slug}"`, faction: null };
  }
}

export default function FactionDetailPage() {
  const { faction, error } = useLoaderData<typeof loader>();
  
  // Rest of component...
}
```

### Custom Hooks

You can use the custom hooks in `hooks/useEntityData.ts` to access entity data in a consistent way:

```tsx
import { useFactionData } from '../hooks/useEntityData';

export default function FactionDetailPage() {
  const { data: faction, error, isLoading } = useFactionData<typeof loader>();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!faction) return <div>Faction not found</div>;
  
  return (
    <div>
      <h1>{faction.name}</h1>
      {/* Rest of component */}
    </div>
  );
}
```
