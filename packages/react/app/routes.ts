import { index, route, type RouteConfig } from "@react-router/dev/routes"

export default [
	route("/", "./components/MainLayout.tsx", [
		index("./routes/index.tsx"),

		route("areas", "./routes/areas/index.tsx"),
		route("areas/:slug/:tab?", "./routes/areas/$slug.tsx"),

		route("conflicts", "./routes/conflicts/index.tsx"),
		route("conflicts/:slug/:tab?", "./routes/conflicts/$slug.tsx"),

		route("factions", "./routes/factions/index.tsx"),
		route("factions/:slug/:tab?", "./routes/factions/$slug.tsx"),

		route("foreshadowing", "./routes/foreshadowing/index.tsx"),
		route("foreshadowing/:slug/:tab?", "./routes/foreshadowing/$slug.tsx"),

		route("narrative-arcs", "./routes/narrative-arcs/index.tsx"),
		route("narrative-arcs/:slug/:tab?", "./routes/narrative-arcs/$slug.tsx"),

		route("npcs", "./routes/npcs/index.tsx"),
		route("npcs/:slug/:tab?", "./routes/npcs/$slug.tsx"),

		route("quests", "./routes/quests/index.tsx"),
		route("quests/:slug/:tab?", "./routes/quests/$slug.tsx", [
			route("stages/:stageSlug/:stageTab?", "./routes/quests/stages/stageTabs/$stageTab.tsx"),
		]),

		route("regions", "./routes/regions/index.tsx"),
		route("regions/:regionSlug/locations/:locationSlug/:tab?", "./routes/regions/locations/$locationSlug.tsx"),
		route("regions/:slug/:tab?", "./routes/regions/$slug.tsx"),

		route("sites", "./routes/sites/index.tsx"),
		route("sites/:slug/:tab?", "./routes/sites/$slug.tsx"),

		route("world", "./routes/world/index.tsx"),
		route("world/:slug/:tab?", "./routes/world/$slug.tsx"),
	]),
	route("api/items", "./routes/api/items.ts"),
	route("api/search", "./routes/api/search.ts"),
] satisfies RouteConfig
