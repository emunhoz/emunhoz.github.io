import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPublishedWork } from "../lib/work";

export const GET: APIRoute = async ({ site }) => {
  const [posts, work] = await Promise.all([getCollection("posts"), getPublishedWork()]);
  const link = (title: string, path: string, note?: string): string =>
    `- [${title}](${new URL(path, site)})${note ? `: ${note}` : ""}`;

  const body = [
    "# Eder Munhoz",
    "",
    "> Design Engineer based in Amsterdam, NL. Designs user interfaces and engineers digital products. Designer turned engineer, now building e-commerce at KPN.",
    "",
    "## Work",
    ...work.map((entry) => link(entry.data.title, `/work/${entry.id}/`, entry.data.summary)),
    "",
    "## Writing",
    ...posts.map((post) => link(post.data.title, `/blog/${post.id}/`, post.data.description)),
    "",
    "## About this site",
    link("How this site is built", "/system/", "design tokens and decisions"),
    link("Lab", "/lab/", "small UI experiments with source"),
    link("Changelog", "/changelog/"),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
