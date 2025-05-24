import * as Icons from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { NavLink, useFetcher, useNavigation } from "react-router"
import type { loader } from "~/routes/api/search"
import { Input } from "./ui/input"

export function Search() {
	const navigation = useNavigation()

	const fetcher = useFetcher<typeof loader>()
	const isPending = navigation.state === "loading"
	const [isFocused, setIsFocused] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")

	return (
		<div className="max-w-md mx-auto relative">
			<div className="relative">
				<fetcher.Form method="get" action="/api/search" autoComplete="off">
					<Input
						placeholder="Search Campaign"
						className="pl-10"
						name="q"
						onChange={(event) => {
							const value = event.currentTarget.value
							setSearchQuery(value)
							if (value.length >= 3) {
								fetcher.submit(event.currentTarget.form)
							}
						}}
						onFocus={() => setIsFocused(true)}
						onBlur={() => {
							// Small delay to allow clicking on results
							setTimeout(() => setIsFocused(false), 200)
						}}
					/>
					<Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					{isPending && (
						<Icons.Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
					)}
				</fetcher.Form>
			</div>

			{/* Search Results */}
			<AnimatePresence>{isFocused && <SearchResults data={fetcher.data} searchQuery={searchQuery} />}</AnimatePresence>
		</div>
	)
}

const SearchWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<motion.div
			className="absolute z-10 w-full mt-2 bg-background border rounded-md shadow-lg max-h-80 overflow-y-auto"
			initial={{ opacity: 0, y: -10, height: 0 }}
			animate={{
				opacity: 1,
				y: 0,
				height: "auto",
				transition: {
					duration: 0.2,
					ease: "easeOut",
				},
			}}
			exit={{
				opacity: 0,
				y: -10,
				height: 0,
				transition: {
					duration: 0.2,
					ease: "easeInOut",
				},
			}}
		>
			{children}
		</motion.div>
	)
}

const SearchResults = ({ data, searchQuery }: { data?: Awaited<ReturnType<typeof loader>>; searchQuery: string }) => {
	return (
		<SearchWrapper>
			{searchQuery.length < 3 ? (
				<div className="p-3 text-muted-foreground">Type more to find something</div>
			) : data && data.length === 0 ? (
				<div className="p-3 text-muted-foreground">No results found</div>
			) : (
				data &&
				data.map(({ id, table, slug, name }, index) => (
					<motion.div
						key={`${table}-${id}`}
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: {
								delay: 0.05 * index,
								duration: 0.2,
							},
						}}
						exit={{
							opacity: 0,
							transition: {
								delay: 0.02 * index,
								duration: 0.1,
							},
						}}
					>
						<NavLink
							to={`/${table}/${slug}`}
							className="block p-3 hover:bg-muted border-b last:border-b-0 no-underline text-foreground"
						>
							<div className="flex items-center">
								<Icons.Search className="h-4 w-4 text-muted-foreground mr-2" />
								<span className="font-semibold">{name}</span>
								<span className="text-sm text-muted-foreground ml-2">{table}</span>
							</div>
						</NavLink>
					</motion.div>
				))
			)}
		</SearchWrapper>
	)
}
