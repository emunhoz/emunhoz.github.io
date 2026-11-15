import { getCollection, type CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;

// Drafts render in `astro dev` for review but never reach the production build.
export async function getPublishedWork(): Promise<WorkEntry[]> {
  const entries = await getCollection("work", ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.toSorted((a, b) => a.data.order - b.data.order);
}
