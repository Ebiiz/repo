import { countWatchStatuses, filterTitles, orderRoadmap, parseWatchlist, removeWatchlistEntry, sortTitles, summarizeRoadmapProgress } from "./catalog.mjs";
import { roadmaps, titles } from "./data.mjs";

const storageKey = "reelway.watchlist.v1";
const regionStorageKey = "reelway.region.v1";
const statuses = [
  ["want", "Want to watch"],
  ["watching", "Currently watching"],
  ["completed", "Completed"],
  ["hold", "On hold"],
  ["dropped", "Dropped"]
];
const titlesById = new Map(titles.map((title) => [title.id, title]));
const validTitleIds = new Set(titlesById.keys());
const validWatchStatuses = new Set(statuses.map(([status]) => status));
const supportedRegions = new Set(["US", "GB", "CA", "AU"]);
const palette = ["poster-olive", "poster-plum", "poster-rust", "poster-blue", "poster-violet", "poster-rose"];
let activeView = "discover";
let roadmapOrder = "release";

const elements = {
  search: document.querySelector("#searchInput"),
  type: document.querySelector("#typeFilter"),
  year: document.querySelector("#yearFilter"),
  provider: document.querySelector("#providerFilter"),
  sort: document.querySelector("#sortSelect"),
  catalog: document.querySelector("#catalogGrid"),
  count: document.querySelector("#resultCount"),
  empty: document.querySelector("#emptyState"),
  watchlist: document.querySelector("#watchlistGrid"),
  watchlistEmpty: document.querySelector("#watchlistEmpty"),
  watchlistSummary: document.querySelector("#watchlistSummary"),
  watchlistCount: document.querySelector("#watchlistCount"),
  roadmapList: document.querySelector("#roadmapList"),
  roadmapProgress: document.querySelector("#roadmapProgress"),
  region: document.querySelector("#countrySelect"),
  notice: document.querySelector("#viewNotice"),
  toast: document.querySelector("#toast"),
  dialog: document.querySelector("#titleDialog"),
  dialogContent: document.querySelector("#dialogContent")
};

let watchlist = loadWatchlist();

function loadWatchlist() {
  try {
    return parseWatchlist(localStorage.getItem(storageKey), validTitleIds, validWatchStatuses);
  } catch (error) {
    console.error("Could not load the saved watchlist.", error);
    showNotice("This browser's saved watchlist could not be read. You can still browse; changes may not persist.");
    return [];
  }
}

function syncWatchlist(event) {
  if (event.key === regionStorageKey || event.key === null) {
    elements.region.value = parseRegionPreference(event.key === null ? null : event.newValue, supportedRegions);
  }
  if (event.key !== storageKey && event.key !== null) return;
  try {
    watchlist = parseWatchlist(event.key === null ? null : event.newValue, validTitleIds, validWatchStatuses);
    elements.notice.classList.add("hidden");
    renderCatalog();
    renderWatchlist();
    renderRoadmap();
  } catch (error) {
    console.error("Could not sync the watchlist from another tab.", error);
    showNotice("A saved watchlist change from another tab could not be read. This tab's current list is unchanged.");
  }
}

function persistWatchlist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(watchlist));
    elements.notice.classList.add("hidden");
  } catch (error) {
    console.error("Could not save the watchlist in this browser.", error);
    showNotice("The browser could not save your changes. The watchlist is temporary until this page is closed.");
  }
}

function loadRegionPreference() {
  try {
    return parseRegionPreference(localStorage.getItem(regionStorageKey), supportedRegions);
  } catch (error) {
    console.error("Could not load the saved region preference.", error);
    showNotice("This browser's saved region preference could not be read. The default region is selected.");
    return "US";
  }
}

function persistRegionPreference(region) {
  if (!supportedRegions.has(region)) return;
  try {
    localStorage.setItem(regionStorageKey, region);
    elements.notice.classList.add("hidden");
    showToast(`Region preference saved. Availability data is not connected.`);
  } catch (error) {
    console.error("Could not save the region preference in this browser.", error);
    showNotice("The region preference could not be saved. Availability data is not connected.");
  }
}

function showNotice(message) {
  elements.notice.textContent = message;
  elements.notice.classList.remove("hidden");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function getTitleName(title) {
  return title.title || "Unknown title";
}

function getFranchiseNames(title) {
  return title.franchiseNames ?? [];
}

function createTitleCard(title, index) {
  const card = makeElement("article", "title-card");
  const poster = makeElement("button", `poster ${palette[index % palette.length]}`);
  poster.type = "button";
  poster.setAttribute("aria-label", `View details for ${getTitleName(title)}`);
  const posterLabel = makeElement("span", "poster-label", getTitleName(title));
  poster.append(posterLabel, makeElement("span", "poster-credit", "DEMO · UNVERIFIED"));
  poster.addEventListener("click", () => openDetails(title));

  const meta = makeElement("div", "card-meta");
  meta.append(makeElement("span", "", title.type === "movie" ? "FILM" : title.type === "tv" ? "SERIES" : "FORMAT UNKNOWN"));
  meta.append(makeElement("span", "meta-dot", "·"));
  meta.append(makeElement("span", "", String(title.releaseYear ?? "YEAR UNKNOWN")));
  const titleButton = makeElement("button", "card-title", getTitleName(title));
  titleButton.type = "button";
  titleButton.addEventListener("click", () => openDetails(title));
  const franchise = makeElement("p", "card-franchise", getFranchiseNames(title).join(" · ") || "No franchise assigned");

  const actions = makeElement("div", "card-actions");
  const entry = watchlist.find((item) => item.titleId === title.id);
  if (entry) {
    const status = statuses.find(([value]) => value === entry.status)?.[1] ?? "Saved";
    actions.append(makeElement("span", "saved-status", `✓ ${status}`));
  } else {
    const saveButton = makeElement("button", "save-button", "+ Watchlist");
    saveButton.type = "button";
    saveButton.addEventListener("click", () => setWatchStatus(title.id, "want"));
    actions.append(saveButton);
  }
  card.append(poster, meta, titleButton, franchise, actions);
  return card;
}

function renderCatalog() {
  const filtered = filterTitles(titles, {
    query: elements.search.value,
    type: elements.type.value,
    year: elements.year.value,
    provider: elements.provider.value
  });
  const ordered = sortTitles(filtered, elements.sort.value);
  elements.catalog.replaceChildren(...ordered.map(createTitleCard));
  elements.count.textContent = `${ordered.length} ${ordered.length === 1 ? "title" : "titles"}`;
  elements.empty.classList.toggle("hidden", ordered.length > 0);
  elements.catalog.classList.toggle("hidden", ordered.length === 0);
}

function createStatusSelect(entry) {
  const select = document.createElement("select");
  select.className = "status-select";
  select.setAttribute("aria-label", `Watch status for ${getTitleName(titlesById.get(entry.titleId))}`);
  for (const [value, label] of statuses) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = entry.status === value;
    select.append(option);
  }
  select.addEventListener("change", () => setWatchStatus(entry.titleId, select.value));
  return select;
}

function renderWatchlist() {
  elements.watchlistCount.textContent = String(watchlist.length);
  const cards = watchlist.map((entry) => {
    const title = titlesById.get(entry.titleId);
    const card = makeElement("article", "watchlist-card");
    const titleButton = makeElement("button", "watchlist-title", getTitleName(title));
    titleButton.type = "button";
    titleButton.addEventListener("click", () => openDetails(title));
    const controls = makeElement("div", "watchlist-controls");
    controls.append(createStatusSelect(entry), createRemoveButton(title));
    card.append(titleButton, makeElement("span", "watchlist-year", String(title.releaseYear ?? "Year unknown")), controls);
    return card;
  });
  elements.watchlist.replaceChildren(...cards);
  elements.watchlistEmpty.classList.toggle("hidden", watchlist.length > 0);
  const summary = countWatchStatuses(watchlist);
  const completed = summary.completed ?? 0;
  elements.watchlistSummary.textContent = `${completed} of ${watchlist.length} saved ${watchlist.length === 1 ? "title" : "titles"} completed.`;
  elements.watchlistSummary.classList.toggle("hidden", watchlist.length === 0);
}

function setWatchStatus(titleId, status) {
  if (!statuses.some(([value]) => value === status) || !titlesById.has(titleId)) return;
  const existing = watchlist.find((item) => item.titleId === titleId);
  if (existing) existing.status = status;
  else watchlist.push({ titleId, status });
  persistWatchlist();
  renderCatalog();
  renderWatchlist();
  renderRoadmap();
  showToast("Watchlist updated.");
}

function createRemoveButton(title) {
  const button = makeElement("button", "watchlist-remove", "Remove");
  button.type = "button";
  button.setAttribute("aria-label", `Remove ${getTitleName(title)} from watchlist`);
  button.addEventListener("click", () => removeWatchStatus(title.id));
  return button;
}

function removeWatchStatus(titleId) {
  if (!watchlist.some((item) => item.titleId === titleId)) return;
  watchlist = removeWatchlistEntry(watchlist, titleId);
  persistWatchlist();
  renderCatalog();
  renderWatchlist();
  renderRoadmap();
  if (elements.dialog.open) elements.dialog.close();
  showToast("Removed from watchlist.");
}

function openDetails(title) {
  elements.dialogContent.replaceChildren();
  const eyebrow = makeElement("p", "eyebrow", "TITLE DETAILS · UNVERIFIED");
  const heading = makeElement("h2", "dialog-title", getTitleName(title));
  heading.id = "dialogTitle";
  const summary = makeElement("p", "dialog-summary", "This demo record has not been verified against a metadata provider. Details such as credits, runtimes, and ratings are not available.");
  const facts = makeElement("dl", "detail-facts");
  for (const [label, value] of [
    ["Format", title.type === "movie" ? "Movie" : title.type === "tv" ? "TV series" : "Unknown"],
    ["Release year", title.releaseYear ?? "Unknown"],
    ["Franchise", getFranchiseNames(title).join(", ") || "Unknown"],
    ["Metadata source", title.source ?? "Unknown"],
    ["Streaming availability", "Unknown — no provider data connected"]
  ]) {
    facts.append(makeElement("dt", "", label), makeElement("dd", "", String(value)));
  }
  const existing = watchlist.find((item) => item.titleId === title.id);
  const actions = makeElement("div", "dialog-actions");
  if (existing) {
    const statusLabel = makeElement("label", "dialog-status-label", "Your watch status");
    const statusSelect = createStatusSelect(existing);
    statusLabel.append(statusSelect);
    actions.append(statusLabel, createRemoveButton(title));
  } else {
    const action = makeElement("button", "button button-primary", "Add to watchlist");
    action.type = "button";
    action.addEventListener("click", () => setWatchStatus(title.id, "want"));
    actions.append(action);
  }
  elements.dialogContent.append(eyebrow, heading, summary, facts, actions);
  elements.dialog.showModal();
}

function renderRoadmap(order = roadmapOrder) {
  const roadmap = roadmaps[0];
  const ordered = orderRoadmap(roadmap.entries, titlesById, order);
  const progress = summarizeRoadmapProgress(roadmap.entries, watchlist);
  elements.roadmapProgress.textContent = `${progress.completed} of ${progress.total} completed · ${progress.tracked} tracked`;
  elements.roadmapList.replaceChildren(...ordered.map((entry, index) => {
    const item = makeElement("li", "roadmap-entry");
    const number = makeElement("span", "roadmap-number", String(index + 1).padStart(2, "0"));
    const copy = makeElement("div", "roadmap-copy");
    const titleButton = makeElement("button", "roadmap-title", getTitleName(entry.title));
    titleButton.type = "button";
    titleButton.addEventListener("click", () => openDetails(entry.title));
    copy.append(titleButton, makeElement("span", "", `${entry.title.releaseYear ?? "Year unknown"} · ${entry.classification ?? "unverified"}`));
    const savedEntry = watchlist.find((saved) => saved.titleId === entry.titleId);
    const trackingControl = savedEntry
      ? createStatusSelect(savedEntry)
      : makeElement("button", "roadmap-add", "Track");
    if (!savedEntry) {
      trackingControl.type = "button";
      trackingControl.setAttribute("aria-label", `Add ${getTitleName(entry.title)} to watchlist`);
      trackingControl.addEventListener("click", () => setWatchStatus(entry.titleId, "want"));
    }
    item.append(number, copy, trackingControl);
    return item;
  }));
}

function updateView(view) {
  activeView = ["discover", "roadmaps", "watchlist"].includes(view) ? view : "discover";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const selected = link.dataset.view === activeView;
    link.classList.toggle("active", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  const targets = { discover: "#catalog", roadmaps: "#roadmaps", watchlist: "#watchlist" };
  document.querySelector(targets[activeView]).scrollIntoView({ behavior: "smooth", block: "start" });
}

function initialize() {
  elements.region.value = loadRegionPreference();
  const years = [...new Set(titles.map((title) => title.releaseYear).filter(Boolean))].sort((a, b) => b - a);
  for (const year of years) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    elements.year.append(option);
  }

  [elements.search, elements.type, elements.year, elements.provider, elements.sort].forEach((control) => {
    control.addEventListener("input", renderCatalog);
    control.addEventListener("change", renderCatalog);
  });
  document.querySelector("#clearFilters").addEventListener("click", () => {
    elements.search.value = "";
    elements.type.value = "";
    elements.year.value = "";
    elements.provider.value = "";
    elements.sort.value = "release";
    renderCatalog();
  });
  document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    const view = link.dataset.view;
    if (location.hash !== `#${view}`) history.pushState(null, "", `#${view}`);
    updateView(view);
  }));
  document.querySelectorAll(".order-button").forEach((button) => button.addEventListener("click", () => {
    roadmapOrder = button.dataset.order;
    document.querySelectorAll(".order-button").forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle("selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });
    renderRoadmap();
  }));
  document.querySelector("#closeDialog").addEventListener("click", () => elements.dialog.close());
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) elements.dialog.close();
  });
  elements.region.addEventListener("change", () => persistRegionPreference(elements.region.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      elements.search.focus();
    }
  });
  window.addEventListener("hashchange", () => updateView(location.hash.slice(1)));
  window.addEventListener("storage", syncWatchlist);
  renderCatalog();
  renderWatchlist();
  renderRoadmap();
  if (location.hash) updateView(location.hash.slice(1));
}

initialize();
