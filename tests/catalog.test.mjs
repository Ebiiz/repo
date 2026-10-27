import test from "node:test";
import assert from "node:assert/strict";
import { countWatchStatuses, filterTitles, orderRoadmap, parseRegionPreference, parseWatchlist, removeWatchlistEntry, sortTitles, summarizeRoadmapProgress } from "../src/catalog.mjs";
import { roadmaps, titles } from "../src/data.mjs";

const titlesById = new Map(titles.map((title) => [title.id, title]));

test("search matches title, franchise, and genre without case sensitivity", () => {
  assert.equal(filterTitles(titles, { query: "iron" })[0].id, "iron-man");
  assert.equal(filterTitles(titles, { query: "marvel" }).length, titles.length);
  assert.equal(filterTitles(titles, { query: "SCIENCE FICTION" }).length, 3);
});

test("filters combine content type, release year, and unknown availability", () => {
  const result = filterTitles(titles, { type: "movie", year: "2012", provider: "unknown" });
  assert.deepEqual(result.map((title) => title.id), ["avengers"]);
});

test("release-year and title sorting do not mutate the source array", () => {
  const source = [...titles];
  assert.deepEqual(sortTitles(titles, "release").map((title) => title.releaseYear), [2008, 2011, 2012, 2014, 2018, 2019]);
  assert.deepEqual(sortTitles(titles, "title").map((title) => title.title), [...titles].map((title) => title.title).sort((a, b) => a.localeCompare(b)));
  assert.deepEqual(titles, source);
});

test("roadmap order is data-driven and release and story orders differ", () => {
  const entries = roadmaps[0].entries;
  const releaseOrder = orderRoadmap(entries, titlesById, "release").map((entry) => entry.title.id);
  const storyOrder = orderRoadmap(entries, titlesById, "story").map((entry) => entry.title.id);
  assert.equal(releaseOrder[0], "iron-man");
  assert.equal(storyOrder[0], "captain-america-first-avenger");
  assert.notDeepEqual(releaseOrder, storyOrder);
});

test("roadmap progress counts completed and tracked entries from the watchlist", () => {
  const entries = roadmaps[0].entries;
  assert.deepEqual(summarizeRoadmapProgress(entries, [
    { titleId: "iron-man", status: "completed" },
    { titleId: "avengers", status: "watching" },
    { titleId: "outside-roadmap", status: "completed" }
  ]), { total: 6, tracked: 2, completed: 1 });
  assert.deepEqual(summarizeRoadmapProgress([], []), { total: 0, tracked: 0, completed: 0 });
});

test("demo records do not imply verified streaming availability", () => {
  assert.ok(titles.every((title) => title.verification === "unverified"));
  assert.ok(titles.every((title) => title.availability.length === 0));
  assert.equal(filterTitles(titles, { provider: "unknown" }).length, titles.length);
});

test("incomplete title metadata remains safe in search, sorting, roadmap order, and availability filters", () => {
  const incompleteTitle = { id: "incomplete" };
  assert.deepEqual(filterTitles([incompleteTitle]), [incompleteTitle]);
  assert.deepEqual(filterTitles([incompleteTitle], { query: "unknown" }), []);
  assert.deepEqual(filterTitles([incompleteTitle], { provider: "unknown" }), [incompleteTitle]);
  assert.deepEqual(sortTitles([incompleteTitle], "title"), [incompleteTitle]);
  assert.deepEqual(orderRoadmap([{ titleId: "incomplete" }], new Map([["incomplete", incompleteTitle]]), "story")[0].title, incompleteTitle);
});

test("watch status counts include only statuses present in the list", () => {
  assert.deepEqual(countWatchStatuses([
    { status: "want" },
    { status: "completed" },
    { status: "completed" }
  ]), { want: 1, completed: 2 });
});

test("removing a saved title returns a new watchlist without changing the original", () => {
  const saved = [
    { titleId: "iron-man", status: "want" },
    { titleId: "avengers", status: "completed" }
  ];

  assert.deepEqual(removeWatchlistEntry(saved, "iron-man"), [
    { titleId: "avengers", status: "completed" }
  ]);
  assert.deepEqual(removeWatchlistEntry(saved, "unknown-title"), saved);
  assert.equal(saved.length, 2);
});

test("region preference accepts supported values and defaults unknown or missing values", () => {
  const supportedRegions = new Set(["US", "GB", "CA", "AU"]);

  assert.equal(parseRegionPreference("GB", supportedRegions), "GB");
  assert.equal(parseRegionPreference(null, supportedRegions), "US");
  assert.equal(parseRegionPreference("ZZ", supportedRegions), "US");
});

test("saved watchlists ignore malformed and unknown entries and deduplicate by title", () => {
  const parsed = parseWatchlist(JSON.stringify([
    { titleId: "iron-man", status: "want" },
    null,
    { titleId: "unknown-title", status: "completed" },
    { titleId: "avengers", status: "invalid" },
    { titleId: "iron-man", status: "completed" }
  ]), new Set(titlesById.keys()), new Set(["want", "completed"]));
  assert.deepEqual(parsed, [
    { titleId: "iron-man", status: "completed" }
  ]);
});

test("empty, malformed JSON, and invalid watchlist shapes are handled explicitly", () => {
  const ids = new Set(titlesById.keys());
  const statuses = new Set(["want"]);
  assert.deepEqual(parseWatchlist(null, ids, statuses), []);
  assert.throws(() => parseWatchlist("{", ids, statuses), SyntaxError);
  assert.throws(() => parseWatchlist('{"titleId":"iron-man","status":"want"}', ids, statuses), TypeError);
});
