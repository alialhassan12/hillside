// Shared Tailwind class strings for the admin UI, so every page
// uses the same card, input and button styles.

export const cardClass = "rounded-xl border border-stone-200 bg-white shadow-xs";

export const cardHeaderClass =
  "flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-4";

export const cardTitleClass = "font-sans text-base font-semibold text-stone-900";

export const labelClass = "mb-2 block text-sm font-medium text-stone-700";

export const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-gold focus:ring-3 focus:ring-gold/20";

// Forest fill keeps white text readable (gold with white text is only 3.3:1).
export const primaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const secondaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const iconButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-gold";

export const deleteButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600";

export const sampleBadgeClass = "text-xs text-stone-500";

export const tabListClass = "mb-6 inline-flex flex-wrap gap-1 rounded-lg bg-stone-100 p-1";

export const tabClass =
  "cursor-pointer rounded px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-gold";

export const activeTabClass = "bg-white text-stone-900 shadow-xs";

export const inactiveTabClass = "text-stone-600 hover:text-stone-900";

// Selected table row: one quiet surface step, no colored marker.
export const selectedRowClass = "bg-stone-100";

// Loading placeholder block; size it with h-/w- classes where it is used.
export const skeletonClass =
  "animate-pulse rounded bg-stone-200 motion-reduce:animate-none";
