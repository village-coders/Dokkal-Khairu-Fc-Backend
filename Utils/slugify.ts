export function slugify(text: string): string {
  const clean = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${clean}-${suffix}`;
}
