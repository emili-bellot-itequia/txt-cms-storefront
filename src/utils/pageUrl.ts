export function pageUrl(type: string, slug: string): string {
  if (type === 'Default') return '/';
  if (type === 'Category') return `/pages/${slug}`;
  return `/${slug}`;
}
