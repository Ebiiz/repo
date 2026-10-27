export function filterTitles(titles, { query = "", type = "", year = "", provider = "" } = {}) {
  const search = query.trim().toLocaleLowerCase();

  return titles.filter((title) => {
    const searchFields = [title.title ?? "", ...(title.franchiseNames ?? []), ...(title.genres ?? [])];
    const matchesSearch = !search || searchFields
      .some((value) => value.toLocaleLowerCase().includes(search));
    const matchesType = !type || title.type === type;
    const matchesYear = !year || String(title.releaseYear ?? "") === String(year);
    const matchesProvider = !provider || (provider === "unknown" && (title.availability ?? []).length === 0);

    return matchesSearch && matchesType && matchesYear && matchesProvider;
  });
}

export function sortTitles(titles, sort = "release") {
  return [...titles].sort((a, b) => {
    const titleA = a.title ?? "";
    const titleB = b.title ?? "";
    if (sort === "title") return titleA.localeCompare(titleB);
    if (sort === "popular") return (b.popularity ?? -1) - (a.popularity ?? -1) || titleA.localeCompare(titleB);
    return (a.releaseDate ?? "9999").localeCompare(b.releaseDate ?? "9999") || titleA.localeCompare(titleB);
  });
}

export function orderRoadmap(entries, titlesById, order = "release") {
  const positionKey = order === "story" ? "storyPosition" : "releasePosition";
  return [...entries]
    .filter((entry) => titlesById.has(entry.titleId))
    .sort((a, b) => (a[positionKey] ?? Number.MAX_SAFE_INTEGER) - (b[positionKey] ?? Number.MAX_SAFE_INTEGER))
    .map((entry) => ({ ...entry, title: titlesById.get(entry.titleId) }));
}

export function summarizeRoadmapProgress(entries, watchlist) {
  const savedByTitleId = new Map(watchlist.map((entry) => [entry.titleId, entry.status]));
  const tracked = entries.filter((entry) => savedByTitleId.has(entry.titleId)).length;
  const completed = entries.filter((entry) => savedByTitleId.get(entry.titleId) === "completed").length;
  return { total: entries.length, tracked, completed };
}

export function countWatchStatuses(watchlist) {
  return watchlist.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
}

export function removeWatchlistEntry(watchlist, titleId) {
  return watchlist.filter((item) => item.titleId !== titleId);
}

export function parseRegionPreference(value, supportedRegions, fallback = "US") {
  return supportedRegions.has(value) ? value : fallback;
}

export function parseWatchlist(serialized, validTitleIds, validStatuses) {
  if (serialized === null) return [];

  const parsed = JSON.parse(serialized);
  if (!Array.isArray(parsed)) throw new TypeError("Saved watchlist must be an array.");

  const validItems = parsed.filter((item) =>
    item !== null
    && typeof item === "object"
    && validTitleIds.has(item.titleId)
    && validStatuses.has(item.status)
  );
  return [...new Map(validItems.map((item) => [item.titleId, { titleId: item.titleId, status: item.status }])).values()];
}
