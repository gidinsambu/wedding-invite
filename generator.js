const storedGuests = window.INVITE_GUESTS || {};
const generatorForm = document.querySelector("[data-generator-form]");
const baseUrlInput = document.querySelector("[data-base-url]");
const namesInput = document.querySelector("[data-guest-names]");
const linkList = document.querySelector("[data-link-list]");
const linkCount = document.querySelector("[data-link-count]");
const entriesOutput = document.querySelector("[data-guest-entries]");
const statusMessage = document.querySelector("[data-generator-status]");
const copyLinksButton = document.querySelector("[data-copy-links]");
const copyEntriesButton = document.querySelector("[data-copy-entries]");

let currentRows = [];

function getDefaultBaseUrl() {
  const baseUrl = new URL("index.html", window.location.href);
  baseUrl.search = "";
  baseUrl.hash = "";
  return baseUrl.href;
}

function normalizeBaseUrl(value) {
  try {
    const url = new URL(value || getDefaultBaseUrl(), window.location.href);
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return new URL(getDefaultBaseUrl());
  }
}

function buildInviteUrl(code) {
  const url = normalizeBaseUrl(baseUrlInput.value);
  url.searchParams.set("guest", code);
  return url.href;
}

function slugifyName(name, takenCodes) {
  const baseCode =
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "guest";

  let code = baseCode;
  let suffix = 2;

  while (takenCodes.has(code)) {
    code = `${baseCode}-${suffix}`;
    suffix += 1;
  }

  takenCodes.add(code);
  return code;
}

function parseGuestNames() {
  const seenNames = new Set();

  return namesInput.value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter((name) => {
      const key = name.toLowerCase();
      const isValid = Boolean(name) && !seenNames.has(key);
      seenNames.add(key);
      return isValid;
    });
}

function getStoredRows() {
  return Object.entries(storedGuests)
    .filter(([, name]) => typeof name === "string" && name.trim())
    .map(([code, name]) => ({
      code,
      name: name.trim(),
      source: "Saved",
    }));
}

function getGeneratedRows(takenCodes) {
  return parseGuestNames().map((name) => ({
    code: slugifyName(name, takenCodes),
    name,
    source: "New",
  }));
}

function getRows() {
  const storedRows = getStoredRows();
  const takenCodes = new Set(storedRows.map((row) => row.code));
  return [...storedRows, ...getGeneratedRows(takenCodes)];
}

function getGuestEntries(rows) {
  const newRows = rows.filter((row) => row.source === "New");

  if (!newRows.length) {
    return "";
  }

  return newRows
    .map((row) => `  ${JSON.stringify(row.code)}: ${JSON.stringify(row.name)},`)
    .join("\n");
}

function getLinksText(rows) {
  return rows.map((row) => `${row.name}: ${buildInviteUrl(row.code)}`).join("\n");
}

function renderRows() {
  currentRows = getRows();
  linkList.replaceChildren();

  currentRows.forEach((row) => {
    const item = document.createElement("article");
    const copyButton = document.createElement("button");
    const link = document.createElement("a");
    const meta = document.createElement("div");
    const name = document.createElement("strong");
    const code = document.createElement("span");

    item.className = "link-item";
    copyButton.className = "button ghost compact-button";
    copyButton.type = "button";
    copyButton.textContent = "Copy";
    copyButton.dataset.copyLink = buildInviteUrl(row.code);

    link.href = buildInviteUrl(row.code);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = buildInviteUrl(row.code);

    meta.className = "link-meta";
    name.textContent = row.name;
    code.textContent = `${row.source} | ${row.code}`;

    meta.append(name, code);
    item.append(meta, link, copyButton);
    linkList.append(item);
  });

  linkCount.textContent = `${currentRows.length} ${currentRows.length === 1 ? "link" : "links"}`;
  entriesOutput.value = getGuestEntries(currentRows);
}

async function copyText(text, successMessage) {
  if (!text) {
    statusMessage.textContent = "No links to copy.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    statusMessage.textContent = successMessage;
  } catch {
    statusMessage.textContent = "Select the link text and copy it manually.";
  }
}

baseUrlInput.value = getDefaultBaseUrl();
renderRows();

generatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderRows();
  statusMessage.textContent = "Links generated.";
});

baseUrlInput.addEventListener("input", renderRows);
namesInput.addEventListener("input", renderRows);

copyLinksButton.addEventListener("click", () => {
  copyText(getLinksText(currentRows), "Links copied.");
});

copyEntriesButton.addEventListener("click", () => {
  copyText(entriesOutput.value, "Guest entries copied.");
});

linkList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-link]");

  if (!button) {
    return;
  }

  copyText(button.dataset.copyLink, "Link copied.");
});
