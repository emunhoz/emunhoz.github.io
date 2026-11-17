import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import receipts from "./integrations/receipts.mjs";

export default defineConfig({
  site: "https://emunhoz.github.io",
  build: {
    // GH Pages caps cache at 10 min, so a shared CSS file buys little and blocks first render
    inlineStylesheets: "always",
  },
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
