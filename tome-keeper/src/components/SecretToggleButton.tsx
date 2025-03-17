import { motion } from "framer-motion"
import { EyeIcon, EyeSlashIcon } from "../app/npcs/[id]/components/icons"

type SecretToggleButtonProps = {
	showSecret: boolean
	toggleSecret: () => void
	className?: string
}

export function SecretToggleButton({
	showSecret,
	toggleSecret,
	className = "",
}: SecretToggleButtonProps) {
	return (
		<motion.button
			initial={{ opacity: 0.9 }}
			animate={{
				opacity: 1,
			}}
			whileHover={{
				scale: 1.05,
			}}
			whileTap={{ scale: 0.95 }}
			transition={{ duration: 0.2 }}
			onClick={toggleSecret}
			type="button"
			className={`px-2 py-1 text-sm font-medium rounded-full transition-colors cursor-pointer flex items-center ${
				showSecret
					? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700"
					: "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
			} ${className}`}
			aria-label={showSecret ? "Hide secret content" : "Show secret content"}
		>
			<span>DM Only</span>
			<span className="ml-1">
				{showSecret ? (
					<EyeSlashIcon className="dark:text-white" />
				) : (
					<EyeIcon className="dark:text-white" />
				)}
			</span>
		</motion.button>
	)
}
