import { describe, expect, test } from "bun:test";
import { buildReleases, type RawCommit } from "./changelog";

const commit = (subject: string, date = "2026-01-01"): RawCommit => ({ hash: subject, date, subject });

describe("buildReleases", () => {
  test("bumps minor on feat, patch on fix/perf, nothing on other types", () => {
    const releases = buildReleases([
      commit("feat: first page"),
      commit("style: tweak spacing"),
      commit("fix: broken link"),
      commit("perf: drop web fonts"),
      commit("feat(nav): add lab"),
    ]);
    expect(releases.map((r) => r.version)).toEqual(["0.2.0", "0.1.2", "0.1.1", "0.1.0"]);
  });

  test("groups non-bumping commits into the next release", () => {
    const [latest] = buildReleases([commit("feat: a"), commit("style: b"), commit("fix: c")]);
    expect(latest.version).toBe("0.1.1");
    expect(latest.entries.map((e) => e.type)).toEqual(["style", "fix"]);
  });

  test("breaking change bumps major and resets minor/patch", () => {
    const [latest] = buildReleases([commit("feat: a"), commit("fix: b"), commit("feat!: redesign")]);
    expect(latest.version).toBe("1.0.0");
  });

  test("ignores non-conventional subjects and parses scope", () => {
    const [latest] = buildReleases([commit("Merge pull request #1"), commit("feat(blog): rss")]);
    expect(latest.entries).toEqual([{ hash: "feat(blog): rss", type: "feat", scope: "blog", subject: "rss" }]);
  });

  test("unreleased trailing commits are kept under the current version", () => {
    const releases = buildReleases([commit("feat: a"), commit("style: b")]);
    expect(releases.map((r) => r.version)).toEqual(["0.1.0"]);
    expect(releases[0].entries).toHaveLength(2);
  });
});
