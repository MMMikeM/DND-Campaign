import { route, index, type RouteConfig } from "@react-router/dev/routes"

// Use a parent route with Outlet instead of a layout route
export default [
	// Parent route that renders the MainLayout
	route("/", "./components/MainLayout.tsx", [
		// All child routes that will render in the Outlet
		index("./routes/index.tsx"),
		route("regions", "./routes/regions/index.tsx"),
		route("regions/:slug", "./routes/regions/$slug.tsx"),
		route("factions", "./routes/factions/index.tsx"),
		route("factions/:slug", "./routes/factions/$slug.tsx"),
		route("npcs", "./routes/npcs/index.tsx"),
		route("npcs/:slug", "./routes/npcs/$slug.tsx"),
		route("quests", "./routes/quests/index.tsx"),
		route("quests/:slug", "./routes/quests/$slug.tsx"),
	]),
] satisfies RouteConfig
