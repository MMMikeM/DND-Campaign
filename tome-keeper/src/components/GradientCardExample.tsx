import { GradientCard, createCardHeader } from "./GradientCard"
import type { ColorTheme } from "./GradientCard"

export function GradientCardExample() {
	// Sample data for demonstration
	const colorThemes: ColorTheme[] = [
		"blue",
		"green",
		"purple",
		"amber",
		"red",
		"gray",
		"cyan",
		"pink",
	]

	// Icons for each theme (using emojis for simplicity in this example)
	const icons = {
		blue: <span className="text-2xl">💧</span>,
		green: <span className="text-2xl">🌿</span>,
		purple: <span className="text-2xl">🔮</span>,
		amber: <span className="text-2xl">🏆</span>,
		red: <span className="text-2xl">🔥</span>,
		gray: <span className="text-2xl">⚙️</span>,
		cyan: <span className="text-2xl">❄️</span>,
		pink: <span className="text-2xl">🌸</span>,
	}

	return (
		<div className="space-y-8 p-4">
			<h1 className="text-2xl font-bold dark:text-white mb-6">GradientCard Component Examples</h1>

			{colorThemes.map((theme) => {
				const header = createCardHeader(
					`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
					icons[theme],
					theme,
				)

				return (
					<GradientCard key={theme} headerContent={header} colorTheme={theme}>
						<div className="prose dark:prose-invert max-w-none">
							<p>
								This is an example of the <code>{theme}</code> theme. The GradientCard component
								provides a beautiful gradient header with matching colors.
							</p>
							<ul>
								<li>Includes matching icon colors</li>
								<li>Dark mode compatible</li>
								<li>Animated transitions</li>
								<li>Customizable content</li>
							</ul>
						</div>
					</GradientCard>
				)
			})}

			{/* Custom gradient example */}
			<GradientCard
				headerContent={
					<div className="flex items-center">
						<span className="text-pink-500 mr-2 text-2xl">🎨</span>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-pink-200">
							Custom Gradient
						</h2>
					</div>
				}
				customGradient="bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30 dark:from-pink-800/40 dark:via-purple-800/40 dark:to-indigo-800/40"
				customHeaderClass="flex items-center justify-between p-4 border-b border-purple-300/50 dark:border-purple-800/50 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30 dark:from-pink-800/40 dark:via-purple-800/40 dark:to-indigo-800/40 backdrop-blur-md"
			>
				<div className="prose dark:prose-invert max-w-none">
					<p>
						You can also provide completely custom gradients and styles if the preset themes don't
						match your requirements.
					</p>
				</div>
			</GradientCard>
		</div>
	)
}
