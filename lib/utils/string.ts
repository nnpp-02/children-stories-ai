/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return (
    text
      .toString()
      .normalize("NFD") // normalize diacritics
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/[^\w-]+/g, "") // remove non-word chars
      .replace(/--+/g, "-") // replace multiple hyphens with single hyphen
      .replace(/^-+/, "") // trim leading hyphen
      .replace(/-+$/, "") || // trim trailing hyphen
    "untitled"
  ); // fallback to 'untitled' if empty
}
