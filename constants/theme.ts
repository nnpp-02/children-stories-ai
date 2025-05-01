/**
 * Available color theme options
 */
export const COLORS = [
  "gray",
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
] as const;

/**
 * Type definition for the available color themes
 */
export type ColorTheme = (typeof COLORS)[number];

/**
 * Type definition for the theme properties
 */
export type ThemeProperties = {
  cover: string;
  page: string;
  accent: string;
  text: string;
  subtext: string;
  border: string;
  shadow: string;
  thank: string;
};

/**
 * Color variant definitions for each theme
 */
export const COLOR_VARIANTS: Record<ColorTheme, ThemeProperties> = {
  gray: {
    cover: "from-gray-200 to-gray-100 dark:from-slate-800 dark:to-slate-900",
    page: "bg-gray-50 dark:bg-slate-900",
    accent: "bg-gray-300/30",
    text: "text-gray-900 dark:text-gray-100",
    subtext: "text-gray-600 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-700",
    shadow: "shadow-gray-400/10",
    thank: "from-gray-200 to-gray-100 dark:from-slate-800 dark:to-slate-700",
  },
  red: {
    cover: "from-red-100 to-rose-50 dark:from-red-950 dark:to-rose-900",
    page: "bg-rose-50 dark:bg-red-950",
    accent: "bg-red-300/30",
    text: "text-red-950 dark:text-red-50",
    subtext: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    shadow: "shadow-red-400/10",
    thank: "from-red-100 to-rose-50 dark:from-red-950 dark:to-red-900",
  },
  green: {
    cover:
      "from-green-100 to-emerald-50 dark:from-green-950 dark:to-emerald-900",
    page: "bg-emerald-50 dark:bg-green-950",
    accent: "bg-green-300/30",
    text: "text-green-950 dark:text-green-50",
    subtext: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    shadow: "shadow-green-400/10",
    thank: "from-green-100 to-emerald-50 dark:from-green-950 dark:to-green-900",
  },
  blue: {
    cover: "from-blue-100 to-indigo-50 dark:from-blue-950 dark:to-indigo-900",
    page: "bg-indigo-50 dark:bg-blue-950",
    accent: "bg-blue-300/30",
    text: "text-blue-950 dark:text-blue-50",
    subtext: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    shadow: "shadow-blue-400/10",
    thank: "from-blue-100 to-indigo-50 dark:from-blue-950 dark:to-blue-900",
  },
  yellow: {
    cover: "from-yellow-100 to-amber-50 dark:from-yellow-950 dark:to-amber-900",
    page: "bg-amber-50 dark:bg-yellow-950",
    accent: "bg-yellow-300/30",
    text: "text-yellow-950 dark:text-yellow-50",
    subtext: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
    shadow: "shadow-yellow-400/10",
    thank:
      "from-yellow-100 to-amber-50 dark:from-yellow-950 dark:to-yellow-900",
  },
  purple: {
    cover:
      "from-purple-100 to-violet-50 dark:from-purple-950 dark:to-violet-900",
    page: "bg-violet-50 dark:bg-purple-950",
    accent: "bg-purple-300/30",
    text: "text-purple-950 dark:text-purple-50",
    subtext: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    shadow: "shadow-purple-400/10",
    thank:
      "from-purple-100 to-violet-50 dark:from-purple-950 dark:to-purple-900",
  },
};

/**
 * Default theme color
 */
export const DEFAULT_THEME: ColorTheme = "blue";
