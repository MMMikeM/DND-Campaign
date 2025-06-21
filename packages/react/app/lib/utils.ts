import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const titleToCamelCase = (title: string) => {
	return title[0].toLowerCase() + title.slice(1).replace(/ /g, "_")
}
