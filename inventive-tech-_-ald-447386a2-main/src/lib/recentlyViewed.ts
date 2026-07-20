const STORAGE_KEY = "iq_recently_viewed";
const MAX_ITEMS = 6;

export const getRecentlyViewed = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (productId: string) => {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyViewed().filter((id) => id !== productId);
    const next = [productId, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("recently-viewed-updated"));
  } catch {
    // ignore
  }
};

export const clearRecentlyViewed = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("recently-viewed-updated"));
  } catch {
    // ignore
  }
};

export const TRENDING_SEARCHES = [
  "Rose bouquet",
  "Bear keychain",
  "Bookmark",
  "Bunny",
  "Penguin",
] as const;
