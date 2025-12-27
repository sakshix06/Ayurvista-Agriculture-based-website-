
import { Plant } from "@/data/plants";

const STORAGE_KEY = "herbal_bookmarks";

export function getBookmarks(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function isBookmarked(plantId: number): boolean {
  return getBookmarks().includes(plantId);
}

export function toggleBookmark(plantId: number): boolean {
  const bookmarks = getBookmarks();
  let updated: number[];
  if (bookmarks.includes(plantId)) {
    updated = bookmarks.filter((id) => id !== plantId);
  } else {
    updated = [...bookmarks, plantId];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.includes(plantId);
}
