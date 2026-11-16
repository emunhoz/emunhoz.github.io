import { execFileSync } from "node:child_process";

export type RawCommit = { hash: string; date: string; subject: string };
export type Entry = { hash: string; type: string; scope?: string; subject: string };
export type Release = { version: string; date: string; entries: Entry[] };

type Version = readonly [major: number, minor: number, patch: number];

const CONVENTIONAL = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?: (?<subject>.+)$/;
const FIELD_SEPARATOR = "\x1f";

function parse({ hash, subject }: RawCommit): (Entry & { isBreaking: boolean }) | undefined {
  const groups = CONVENTIONAL.exec(subject)?.groups;
  if (!groups) return undefined;
  const entry: Entry = { hash, type: groups.type, subject: groups.subject };
  return { ...entry, ...(groups.scope && { scope: groups.scope }), isBreaking: Boolean(groups.breaking) };
}

function bump([major, minor, patch]: Version, type: string, isBreaking: boolean): Version | undefined {
  if (isBreaking) return [major + 1, 0, 0];
  if (type === "feat") return [major, minor + 1, 0];
  if (type === "fix" || type === "perf") return [major, minor, patch + 1];
  return undefined;
}

// Commits oldest → newest; returns releases newest first. O(n)
export function buildReleases(commits: RawCommit[]): Release[] {
  const releases: Release[] = [];
  let version: Version = [0, 0, 0];
  let pending: Entry[] = [];

  for (const commit of commits) {
    const parsed = parse(commit);
    if (!parsed) continue;
    const { isBreaking, ...entry } = parsed;
    pending.push(entry);
    const next = bump(version, entry.type, isBreaking);
    if (!next) continue;
    version = next;
    releases.push({ version: version.join("."), date: commit.date, entries: pending });
    pending = [];
  }

  const latest = releases.at(-1);
  if (latest && pending.length > 0) latest.entries.push(...pending);
  return releases.toReversed();
}

export function readGitCommits(): RawCommit[] {
  const output = execFileSync(
    "git",
    ["log", "--reverse", "--date=short", `--format=%h${FIELD_SEPARATOR}%ad${FIELD_SEPARATOR}%s`],
    { encoding: "utf8" },
  );
  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, date, subject] = line.split(FIELD_SEPARATOR);
      return { hash, date, subject };
    });
}

let cachedVersion: string | undefined;

// Base layout renders on every page; read git once per build.
export function latestVersion(): string {
  cachedVersion ??= buildReleases(readGitCommits())[0]?.version ?? "0.0.0";
  return cachedVersion;
}
