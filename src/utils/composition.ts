export function formatComposition(json?: string): string | null {
  if (!json) return null;
  try {
    const items: { material: string; percentage: number }[] = JSON.parse(json);
    if (!items.length) return null;
    return items.map(i => `${i.percentage}% ${i.material}`).join(' · ');
  } catch {
    return null;
  }
}
