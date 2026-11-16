import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import receipts from "./integrations/receipts.mjs";

export default defineConfig({
  site: "https://emunhoz.github.io",
  integrations: [mdx(), receipts()],
  image: {
    layout: "constrained",
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
