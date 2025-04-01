import { route, index, type RouteConfig } from "@react-router/dev/routes"

// Use a parent route with Outlet instead of a layout route
export default [
	// Parent route that renders the MainLayout
	route("/", "./components/MainLayout.tsx", [
		// All child routes that will render in the Outlet
		index("./routes/index.tsx"),
		// Routes for regions with list and detail views
		route("regions", "./routes/regions/index.tsx"),
		route("regions/:slug/:tab?", "./routes/regions/$slug.tsx"),
		// Nested locations under regions
		route("regions/:regionSlug/locations/:locationSlug/:tab?", "./routes/regions/locations/$locationSlug.tsx"),
		// Routes for factions with list and detail views
		route("factions", "./routes/factions/index.tsx"),
		route("factions/:slug/:tab?", "./routes/factions/$slug.tsx"),
		// Routes for NPCs with list and detail views
		route("npcs", "./routes/npcs/index.tsx"),
		route("npcs/:slug/:tab?", "./routes/npcs/$slug.tsx"),
		// Routes for quests with list and detail views
		route("quests", "./routes/quests/index.tsx"),
		route("quests/:slug/:tab?/:stageId?", "./routes/quests/$slug.tsx"),
	]),
	route("api/items", "./routes/api/items.ts"),
] satisfies RouteConfig
