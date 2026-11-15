import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const STATIC_PATHS = ["/", "/blog/"];

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("posts");
  const paths = [...STATIC_PATHS, ...posts.map((post) => `/blog/${post.id}/`)];
  const urls = paths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
