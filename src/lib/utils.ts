import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard utility to merge Tailwind classes efficiently.
 * Solves conflicts (e.g., 'bg-red-500' overrides 'bg-blue-500').
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
